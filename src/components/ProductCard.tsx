import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isBestSeller: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onViewDetail,
  index = 0,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col"
    >
      {/* Image */}
      <div
        className="relative mb-4 aspect-square cursor-pointer overflow-hidden rounded-[20px] bg-secondary"
        onClick={() => onViewDetail?.(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-foreground shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#666]">
          {product.category}
        </p>
        <h3
          className="text-sm font-medium leading-snug text-foreground cursor-pointer transition-colors hover:text-[#fb6900]"
          onClick={() => onViewDetail?.(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${
                  i < Math.round(product.rating)
                    ? "fill-[#fb6900] text-[#fb6900]"
                    : "fill-border text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#666]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price + Add to cart */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="size-8 rounded-full border-border/50"
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingBag className="size-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
