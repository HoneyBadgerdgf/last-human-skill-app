import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Action to fetch transcript from YouTube
export const fetchTranscript = action({
  args: { url: v.string() },
  handler: async (ctx, args): Promise<{
    success: boolean;
    videoId?: string;
    title?: string;
    channelName?: string;
    transcript?: string;
    error?: string;
  }> => {
    const videoId = extractVideoId(args.url);
    if (!videoId) {
      return { success: false, error: "Invalid YouTube URL" };
    }

    try {
      // Use supadata.ai free transcript API
      const response = await fetch(
        `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Fallback to youtubetotranscript.com API
        const fallbackResponse = await fetch(
          `https://youtubetotranscript.com/api/transcript?videoId=${videoId}`
        );
        
        if (!fallbackResponse.ok) {
          return { success: false, error: "Could not fetch transcript. Video may not have captions." };
        }
        
        const fallbackData = await fallbackResponse.json();
        return {
          success: true,
          videoId,
          title: fallbackData.title || "Unknown Title",
          transcript: fallbackData.transcript || fallbackData.text || "",
        };
      }

      const data = await response.json();
      
      // Get video metadata
      const metaResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      const metaData = metaResponse.ok ? await metaResponse.json() : {};

      return {
        success: true,
        videoId,
        title: metaData.title || "Unknown Title",
        channelName: metaData.author_name,
        transcript: typeof data === "string" ? data : (data.transcript || data.text || JSON.stringify(data)),
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to fetch transcript: ${error instanceof Error ? error.message : "Unknown error"}` 
      };
    }
  },
});

// Save transcript to database
export const saveTranscript = mutation({
  args: {
    videoId: v.string(),
    videoUrl: v.string(),
    title: v.string(),
    channelName: v.optional(v.string()),
    duration: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    transcript: v.string(),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("transcripts")
      .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        ...args,
        createdAt: Date.now(),
      });
      return existing._id;
    }

    // Create new
    return await ctx.db.insert("transcripts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get all transcripts
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("transcripts").order("desc").collect();
  },
});

// Get transcript by ID
export const get = query({
  args: { id: v.id("transcripts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get transcript by video ID
export const getByVideoId = query({
  args: { videoId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcripts")
      .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
      .first();
  },
});

// Delete transcript
export const remove = mutation({
  args: { id: v.id("transcripts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Save transcript to swipe file
export const saveToSwipeFile = mutation({
  args: { 
    transcriptId: v.id("transcripts"),
    notes: v.optional(v.string()),
    whatToEmulate: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const transcript = await ctx.db.get(args.transcriptId);
    if (!transcript) throw new Error("Transcript not found");

    // Create swipe item
    const swipeItemId = await ctx.db.insert("swipeItems", {
      type: "youtube",
      url: transcript.videoUrl,
      title: transcript.title,
      thumbnail: transcript.thumbnail,
      content: transcript.transcript,
      notes: args.notes,
      whatToEmulate: args.whatToEmulate,
      tags: args.tags,
    });

    // Link transcript to swipe item
    await ctx.db.patch(args.transcriptId, {
      swipeItemId,
    });

    return swipeItemId;
  },
});
