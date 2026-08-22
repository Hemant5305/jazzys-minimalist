import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createBooking = mutation({
  args: {
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    service: v.string(),
    date: v.string(),
    time: v.string(),
    phone: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
    });
  },
});

export const getUserBookings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBooking = query({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
