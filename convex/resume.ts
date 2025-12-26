import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveResumeId = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    // Store the latest resume storage ID in the database
    const existing = await ctx.db
      .query("resume")
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { storageId });
    } else {
      await ctx.db.insert("resume", { storageId });
    }
  },
});

export const getResumeUrl = query({
  handler: async (ctx) => {
    const resume = await ctx.db
      .query("resume")
      .first();

    if (!resume) return null;

    return await ctx.storage.getUrl(resume.storageId);
  },
});

export const checkResume = query({
  handler: async (ctx) => {
    const resume = await ctx.db
      .query("resume")
      .first();

    return { exists: !!resume };
  },
});
