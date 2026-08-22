import { mutation } from "./_generated/server";

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "already_seeded";

    const products = [
      {
        name: "Radiance Vitamin C Serum",
        description:
          "A potent brightening serum with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Visibly reduces dark spots and evens skin tone for a luminous complexion.",
        price: 2999,
        category: "Skincare",
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
        badge: "Best Seller",
        rating: 4.8,
        reviewCount: 342,
        inStock: true,
        isBestSeller: true,
      },
      {
        name: "Silk Touch Hair Oil",
        description:
          "Luxurious argan and jojoba-infused hair oil that tames frizz, adds brilliant shine, and protects against heat damage. Suitable for all hair types.",
        price: 2499,
        category: "Hair Care",
        imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
        badge: "Best Seller",
        rating: 4.9,
        reviewCount: 518,
        inStock: true,
        isBestSeller: true,
      },
      {
        name: "Velvet Matte Lipstick",
        description:
          "Long-lasting matte lipstick with a velvety smooth texture. Enriched with shea butter for comfortable all-day wear without drying.",
        price: 1899,
        category: "Makeup",
        imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
        badge: "New",
        rating: 4.7,
        reviewCount: 203,
        inStock: true,
        isBestSeller: true,
      },
      {
        name: "Hydra Boost Moisturizer",
        description:
          "Lightweight gel-cream moisturizer that delivers 72-hour hydration. Niacinamide and ceramides strengthen the skin barrier while plumping fine lines.",
        price: 3499,
        category: "Skincare",
        imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.6,
        reviewCount: 289,
        inStock: true,
        isBestSeller: true,
      },
      {
        name: "Rose Petal Body Lotion",
        description:
          "Deeply nourishing body lotion infused with rose extract and cocoa butter. Absorbs quickly leaving skin silky soft with a delicate floral scent.",
        price: 2199,
        category: "Body Care",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.5,
        reviewCount: 176,
        inStock: true,
        isBestSeller: true,
      },
      {
        name: "Precision Eye Pencil",
        description:
          "Ultra-fine tip eye pencil for precise, smudge-proof definition. Waterproof formula that glides on smoothly and lasts up to 16 hours.",
        price: 1299,
        category: "Makeup",
        imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.4,
        reviewCount: 134,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Keratin Repair Mask",
        description:
          "Intensive hair repair mask with hydrolyzed keratin and argan oil. Restores damaged hair from within, improving elasticity and reducing breakage by 80%.",
        price: 2799,
        category: "Hair Care",
        imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.7,
        reviewCount: 221,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Glow Serum Foundation",
        description:
          "Buildable serum foundation with SPF 30 and hyaluronic acid. Delivers medium-to-full coverage with a natural, dewy finish that lasts all day.",
        price: 3599,
        category: "Makeup",
        imageUrl: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop",
        badge: "New",
        rating: 4.8,
        reviewCount: 167,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Purifying Clay Cleanser",
        description:
          "Gentle daily cleanser with French green clay and tea tree extract. Effectively removes impurities without stripping natural oils.",
        price: 1699,
        category: "Skincare",
        imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.3,
        reviewCount: 98,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Silk Hair Scrunchies Set",
        description:
          "Set of 5 mulberry silk scrunchies in neutral tones. Gentle on hair, prevents creasing and breakage while adding an elegant touch.",
        price: 1199,
        category: "Accessories",
        imageUrl: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.6,
        reviewCount: 245,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Luminous Highlighting Palette",
        description:
          "Four-shade highlighting palette with micro-fine shimmer particles. Blendable formula for a customizable, lit-from-within glow.",
        price: 2699,
        category: "Makeup",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.5,
        reviewCount: 152,
        inStock: true,
        isBestSeller: false,
      },
      {
        name: "Botanical Body Scrub",
        description:
          "Invigorating sugar scrub blended with coconut oil and essential oils. Gently exfoliates while moisturizing for irresistibly smooth skin.",
        price: 1999,
        category: "Body Care",
        imageUrl: "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=600&fit=crop",
        badge: undefined,
        rating: 4.4,
        reviewCount: 119,
        inStock: true,
        isBestSeller: false,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }

    return "seeded";
  },
});
