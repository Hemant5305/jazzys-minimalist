import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Convex Auth stores users with _id = identity.subject
    const user = await ctx.db.get(identity.subject as any);
    if (!user) return null;

    return {
      _id: user._id,
      name: "name" in user ? (user as any).name : undefined,
      email: "email" in user ? (user as any).email : undefined,
      image: "image" in user ? (user as any).image : undefined,
      role: "role" in user ? (user as any).role : undefined,
      isAnonymous: "isAnonymous" in user ? (user as any).isAnonymous : undefined,
    };
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const setAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: "admin" });
  },
});

export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

    return {
      orderCount: orders.length,
      bookingCount: bookings.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
    };
  },
});
