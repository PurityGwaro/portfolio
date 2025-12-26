import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("blogs").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const blogId = await ctx.db.insert("blogs", args);
    return blogId;
  },
});

export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.string(),
    description: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
