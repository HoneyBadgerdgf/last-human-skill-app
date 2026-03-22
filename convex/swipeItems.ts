import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("youtube"),
        v.literal("post"),
        v.literal("article"),
        v.literal("quote"),
        v.literal("image"),
        v.literal("idea")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("swipeItems")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("swipeItems").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("swipeItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    type: v.union(
      v.literal("youtube"),
      v.literal("post"),
      v.literal("article"),
      v.literal("quote"),
      v.literal("image"),
      v.literal("idea")
    ),
    url: v.optional(v.string()),
    title: v.string(),
    thumbnail: v.optional(v.string()),
    content: v.optional(v.string()),
    notes: v.optional(v.string()),
    whatToEmulate: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("swipeItems", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("swipeItems"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    content: v.optional(v.string()),
    notes: v.optional(v.string()),
    whatToEmulate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
  },
});

export const remove = mutation({
  args: { id: v.id("swipeItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addBreakdown = mutation({
  args: {
    id: v.id("swipeItems"),
    breakdown: v.object({
      contentType: v.string(),
      macroAnalysis: v.string(),
      microAnalysis: v.string(),
      psychologicalTactics: v.string(),
      replicationGuide: v.string(),
      tacticsUsed: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      breakdown: args.breakdown,
      breakdownGeneratedAt: Date.now(),
    });
  },
});

export const count = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("swipeItems").collect();
    return items.length;
  },
});
