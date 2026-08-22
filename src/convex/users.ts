import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      _id: user._id,
      name: "name" in user ? (user as { name?: string }).name : undefined,
      email: "email" in user ? (user as { email?: string }).email : undefined,
      image: "image" in user ? (user as { image?: string }).image : undefined,
      role: "role" in user ? (user as { role?: string }).role : undefined,
      isAnonymous: "isAnonymous" in user ? (user as { isAnonymous?: boolean }).isAnonymous : undefined,
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
