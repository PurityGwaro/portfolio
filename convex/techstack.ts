import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("techstack").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const techId = await ctx.db.insert("techstack", args);
    return techId;
  },
});

export const update = mutation({
  args: {
    id: v.id("techstack"),
    name: v.string(),
    category: v.string(),
  },
  handler: async (ctx, { id, ...data }) => {
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("techstack") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
