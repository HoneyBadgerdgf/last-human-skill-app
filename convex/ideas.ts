import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    processed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.processed !== undefined) {
      return await ctx.db
        .query("ideas")
        .withIndex("by_processed", (q) => q.eq("processed", args.processed!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("ideas").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("voice"), v.literal("image"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ideas", {
      content: args.content,
      type: args.type || "text",
      processed: false,
    });
  },
});

export const promote = mutation({
  args: {
    id: v.id("ideas"),
    promotedTo: v.union(v.literal("swipe"), v.literal("newsletter"), v.literal("discarded")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      processed: true,
      promotedTo: args.promotedTo,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("ideas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const ideas = await ctx.db
      .query("ideas")
      .withIndex("by_processed", (q) => q.eq("processed", false))
      .order("desc")
      .take(limit);
    return ideas;
  },
});
