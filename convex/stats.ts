import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWritingStreak = query({
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query("writingSessions")
      .order("desc")
      .collect();

    if (sessions.length === 0) return 0;

    // Calculate streak based on consecutive days
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDates = new Set(sessions.map((s) => s.date));
    
    // Check each day going backwards
    for (let i = 0; i <= sessions.length + 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];
      
      if (sessionDates.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        // Allow today to not have a session yet
        break;
      }
    }

    return streak;
  },
});

export const recordSession = mutation({
  args: {
    newsletterId: v.id("newsletters"),
    durationMinutes: v.number(),
    wordCountStart: v.number(),
    wordCountEnd: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const date = new Date().toISOString().split("T")[0];
    return await ctx.db.insert("writingSessions", {
      ...args,
      date,
    });
  },
});

export const getDashboardStats = query({
  handler: async (ctx) => {
    const swipeItems = await ctx.db.query("swipeItems").collect();
    const newsletters = await ctx.db.query("newsletters").collect();
    const publishedNewsletters = newsletters.filter(n => n.status === "published");
    const sessions = await ctx.db.query("writingSessions").order("desc").collect();
    
    // Calculate streak
    let streak = 0;
    if (sessions.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sessionDates = new Set(sessions.map((s) => s.date));
      
      for (let i = 0; i <= sessions.length + 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split("T")[0];
        
        if (sessionDates.has(dateStr)) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
    }

    // Get current newsletter
    const currentNewsletter = newsletters.find(n => n.status !== "published") || null;

    return {
      swipeItemCount: swipeItems.length,
      newsletterCount: publishedNewsletters.length,
      writingStreak: streak,
      currentNewsletter,
    };
  },
});
