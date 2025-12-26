import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    skills: v.array(v.string()),
    githubUrl: v.optional(v.string()),
    liveUrl: v.optional(v.string()),
  }),

  blogs: defineTable({
    title: v.string(),
    description: v.string(),
    url: v.string(),
  }),

  techstack: defineTable({
    name: v.string(),
    category: v.string(),
  }),

  resume: defineTable({
    storageId: v.id("_storage"),
  }),
});
