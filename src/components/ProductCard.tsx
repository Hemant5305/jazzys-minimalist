import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

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
  index = 0,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  index?: number;
}) {
  const navigate = useNavigate();

  // Mix up rounded corners per card so it doesn't look templated
  const corners = [
    "rounded-[14px]",
    "rounded-[10px]",
    "rounded-[18px]",
    "rounded-[12px]",
    "rounded-[16px]",
  ];
  const cornerClass = corners[index % corners.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group relative flex flex-col"
    >
      <div
        className={`relative mb-3 aspect-square cursor-pointer overflow-hidden bg-secondary ${cornerClass}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#999]">
          {product.category}
        </p>
        <h3
          className="text-[13px] font-medium leading-snug text-foreground cursor-pointer transition-colors hover:text-[#c96b8b]"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-2.5 ${
                  i < Math.round(product.rating)
                    ? "fill-[#c96b8b] text-[#c96b8b]"
                    : "fill-border text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#999]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[14px] font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="size-7 rounded-full border-border/50"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            <ShoppingBag className="size-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
