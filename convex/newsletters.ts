import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outlining"),
        v.literal("drafting"),
        v.literal("editing"),
        v.literal("scheduled"),
        v.literal("published")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("newsletters")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("newsletters").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCurrent = query({
  handler: async (ctx) => {
    // Get the most recent non-published newsletter
    const newsletters = await ctx.db
      .query("newsletters")
      .order("desc")
      .collect();
    
    return newsletters.find(n => n.status !== "published") || newsletters[0] || null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    status: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outlining"),
        v.literal("drafting"),
        v.literal("editing"),
        v.literal("scheduled"),
        v.literal("published")
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newsletters", {
      title: args.title,
      status: args.status || "idea",
      swipeItemIds: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("newsletters"),
    title: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outlining"),
        v.literal("drafting"),
        v.literal("editing"),
        v.literal("scheduled"),
        v.literal("published")
      )
    ),
    audience: v.optional(v.string()),
    hyperbolicTruth: v.optional(v.string()),
    painPoint: v.optional(v.string()),
    novelPerspective: v.optional(v.string()),
    uniqueMechanism: v.optional(v.string()),
    coreTakeaway: v.optional(v.string()),
    subjectLine: v.optional(v.string()),
    previewText: v.optional(v.string()),
    bodyContent: v.optional(v.string()),
    publishDate: v.optional(v.string()),
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
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const publish = mutation({
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "published",
      publishedAt: Date.now(),
    });
  },
});

export const count = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("newsletters").collect();
    return items.length;
  },
});

export const countPublished = query({
  handler: async (ctx) => {
    const items = await ctx.db
      .query("newsletters")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    return items.length;
  },
});
