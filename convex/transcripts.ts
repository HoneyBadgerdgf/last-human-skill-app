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

// Decode HTML entities
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

// Parse transcript XML from YouTube
function parseTranscriptXml(xml: string): string[] {
  const textParts: string[] = [];
  
  // Try new format first: <p t="offset" d="duration">text</p>
  const pMatches = xml.matchAll(/<p\s+t="\d+"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g);
  for (const match of pMatches) {
    let text = match[1];
    // Extract text from <s> tags if present
    const sMatches = text.matchAll(/<s[^>]*>([^<]*)<\/s>/g);
    let sText = '';
    for (const s of sMatches) {
      sText += s[1];
    }
    text = sText || text.replace(/<[^>]+>/g, '');
    text = decodeEntities(text).trim();
    if (text) textParts.push(text);
  }
  
  if (textParts.length > 0) return textParts;
  
  // Fallback to old format: <text start="x" dur="y">text</text>
  const textMatches = xml.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
  for (const match of textMatches) {
    const text = decodeEntities(match[1]).trim();
    if (text) textParts.push(text);
  }
  
  return textParts;
}

// Fetch transcript using YouTube's innertube API (Android client)
async function fetchViaInnerTube(videoId: string): Promise<{ captionUrl: string } | null> {
  try {
    const response = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'com.google.android.youtube/20.10.38 (Linux; U; Android 14)',
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'ANDROID',
            clientVersion: '20.10.38',
          },
        },
        videoId,
      }),
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
      return null;
    }
    
    // Get the first available caption track (usually English or auto-generated)
    const captionUrl = captionTracks[0].baseUrl;
    if (!captionUrl) return null;
    
    return { captionUrl };
  } catch (error) {
    console.error('InnerTube fetch failed:', error);
    return null;
  }
}

// Fetch transcript from web page as fallback
async function fetchViaWebPage(videoId: string): Promise<{ captionUrl: string } | null> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Check for captcha
    if (html.includes('class="g-recaptcha"')) {
      console.error('YouTube requires captcha');
      return null;
    }
    
    // Extract ytInitialPlayerResponse
    const match = html.match(/var ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
    if (!match) return null;
    
    // Find the closing brace properly
    let depth = 0;
    let endIndex = 0;
    const startIndex = html.indexOf('var ytInitialPlayerResponse = ') + 30;
    for (let i = startIndex; i < html.length; i++) {
      if (html[i] === '{') depth++;
      else if (html[i] === '}') {
        depth--;
        if (depth === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    if (endIndex === 0) return null;
    
    try {
      const playerResponse = JSON.parse(html.slice(startIndex, endIndex));
      const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      
      if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
        return null;
      }
      
      return { captionUrl: captionTracks[0].baseUrl };
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Web page fetch failed:', error);
    return null;
  }
}

// Fetch transcript directly from YouTube
async function fetchYouTubeTranscript(videoId: string): Promise<{ transcript: string; title: string; channelName?: string } | null> {
  try {
    // Try innertube API first (more reliable)
    let captionData = await fetchViaInnerTube(videoId);
    
    // Fallback to web page scraping
    if (!captionData) {
      captionData = await fetchViaWebPage(videoId);
    }
    
    if (!captionData) {
      return null;
    }
    
    // Fetch the actual transcript
    const captionResponse = await fetch(captionData.captionUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)',
      },
    });
    
    if (!captionResponse.ok) {
      return null;
    }
    
    const captionXml = await captionResponse.text();
    const textParts = parseTranscriptXml(captionXml);
    
    if (textParts.length === 0) {
      return null;
    }
    
    // Get video metadata
    const metaResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    const metaData = metaResponse.ok ? await metaResponse.json() : {};
    
    return {
      transcript: textParts.join(' '),
      title: metaData.title || 'Unknown Title',
      channelName: metaData.author_name,
    };
  } catch (error) {
    console.error('Failed to fetch YouTube transcript:', error);
    return null;
  }
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
      // Get video metadata first
      const metaResponse = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      const metaData = metaResponse.ok ? await metaResponse.json() : {};
      
      // Try supadata.ai API (requires API key in env)
      const supadataKey = process.env.SUPADATA_API_KEY;
      if (supadataKey) {
        const supadataResponse = await fetch(
          `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
          {
            headers: {
              'x-api-key': supadataKey,
              'Accept': 'application/json',
            },
          }
        );
        
        if (supadataResponse.ok) {
          const data = await supadataResponse.json();
          const transcript = typeof data === 'string' ? data : (data.content || data.transcript || data.text || '');
          
          if (transcript) {
            return {
              success: true,
              videoId,
              title: metaData.title || 'Unknown Title',
              channelName: metaData.author_name,
              transcript,
            };
          }
        }
      }
      
      // Try direct YouTube transcript extraction
      const result = await fetchYouTubeTranscript(videoId);
      
      if (result) {
        return {
          success: true,
          videoId,
          title: result.title,
          channelName: result.channelName,
          transcript: result.transcript,
        };
      }
      
      // If no API key configured, provide helpful error
      if (!supadataKey) {
        return { 
          success: false, 
          error: "Transcript API not configured. Add SUPADATA_API_KEY to Convex environment variables. Get free key at supadata.ai" 
        };
      }
      
      return { 
        success: false, 
        error: "Could not fetch transcript. Video may not have captions enabled." 
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
