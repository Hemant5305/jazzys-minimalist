import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getBestSellers = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    return all.filter((p) => p.isBestSeller);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    badge: v.optional(v.string()),
    inStock: v.boolean(),
    isBestSeller: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      rating: 0,
      reviewCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    badge: v.optional(v.string()),
    inStock: v.boolean(),
    isBestSeller: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { productId, ...fields } = args;
    await ctx.db.patch(productId, fields);
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
  },
});
