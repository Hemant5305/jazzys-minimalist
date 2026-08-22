import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createFromCart = mutation({
  args: {
    userId: v.string(),
    shippingAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get cart items with product info
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty.");
    }

    const items = [];
    let total = 0;

    for (const cartItem of cartItems) {
      const product = await ctx.db.get(cartItem.productId);
      if (!product) continue;
      items.push({
        productId: cartItem.productId,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        imageUrl: product.imageUrl,
      });
      total += product.price * cartItem.quantity;
    }

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items,
      total: Math.round(total * 100) / 100,
      status: "pending",
      shippingAddress: args.shippingAddress,
      createdAt: Date.now(),
    });

    // Clear cart
    for (const cartItem of cartItems) {
      await ctx.db.delete(cartItem._id);
    }

    return orderId;
  },
});

export const getUserOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
