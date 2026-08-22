import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    products: defineTable({
      name: v.string(),
      description: v.string(),
      price: v.number(),
      category: v.string(),
      imageUrl: v.string(),
      badge: v.optional(v.string()),
      rating: v.number(),
      reviewCount: v.number(),
      inStock: v.boolean(),
      isBestSeller: v.boolean(),
    })
      .index("by_category", ["category"])
      .index("by_best_seller", ["isBestSeller"]),

    cartItems: defineTable({
      userId: v.string(),
      productId: v.id("products"),
      quantity: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_product", ["userId", "productId"]),

    bookings: defineTable({
      userId: v.string(),
      userName: v.string(),
      userEmail: v.string(),
      service: v.string(),
      date: v.string(),
      time: v.string(),
      phone: v.string(),
      notes: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("cancelled"),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    reviews: defineTable({
      userId: v.string(),
      userName: v.string(),
      productId: v.id("products"),
      rating: v.number(),
      comment: v.string(),
      createdAt: v.number(),
    })
      .index("by_product", ["productId"])
      .index("by_user", ["userId"]),

    orders: defineTable({
      userId: v.string(),
      items: v.array(
        v.object({
          productId: v.id("products"),
          name: v.string(),
          price: v.number(),
          quantity: v.number(),
          imageUrl: v.string(),
        }),
      ),
      total: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
      ),
      shippingAddress: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
