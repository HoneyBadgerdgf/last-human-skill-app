import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  swipeItems: defineTable({
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
    // Content Breakdown
    breakdown: v.optional(
      v.object({
        contentType: v.string(),
        macroAnalysis: v.string(),
        microAnalysis: v.string(),
        psychologicalTactics: v.string(),
        replicationGuide: v.string(),
        tacticsUsed: v.array(v.string()),
      })
    ),
    breakdownGeneratedAt: v.optional(v.number()),
  }).index("by_type", ["type"]),

  newsletters: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
    weekOf: v.optional(v.string()),
    status: v.union(
      v.literal("idea"),
      v.literal("outlining"),
      v.literal("drafting"),
      v.literal("editing"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    // Dan Koe Framework sections
    audience: v.optional(v.string()),
    hyperbolicTruth: v.optional(v.string()),
    painPoint: v.optional(v.string()),
    novelPerspective: v.optional(v.string()),
    uniqueMechanism: v.optional(v.string()),
    coreTakeaway: v.optional(v.string()),
    // Meta
    subjectLine: v.optional(v.string()),
    previewText: v.optional(v.string()),
    bodyContent: v.optional(v.string()),
    // Publishing
    publishDate: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    beehiivUrl: v.optional(v.string()),
    openRate: v.optional(v.number()),
    clickRate: v.optional(v.number()),
    // References
    swipeItemIds: v.array(v.id("swipeItems")),
  }).index("by_status", ["status"]),

  ideas: defineTable({
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("voice"), v.literal("image")),
    processed: v.boolean(),
    promotedTo: v.optional(
      v.union(v.literal("swipe"), v.literal("newsletter"), v.literal("discarded"))
    ),
  }).index("by_processed", ["processed"]),

  writingSessions: defineTable({
    newsletterId: v.id("newsletters"),
    date: v.string(),
    durationMinutes: v.number(),
    wordCountStart: v.number(),
    wordCountEnd: v.number(),
    notes: v.optional(v.string()),
  }).index("by_newsletter", ["newsletterId"]),

  contentBreakdowns: defineTable({
    swipeItemId: v.id("swipeItems"),
    contentType: v.string(),
    macroAnalysis: v.string(),
    microAnalysis: v.string(),
    psychologicalTactics: v.string(),
    replicationGuide: v.string(),
    tacticsUsed: v.array(v.string()),
    generatedAt: v.number(),
  }).index("by_swipeItem", ["swipeItemId"]),
});
