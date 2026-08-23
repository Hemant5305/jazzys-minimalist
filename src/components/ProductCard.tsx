import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Minus, Plus, Check } from "lucide-react";
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
  onAddToCart?: (product: Product, quantity: number) => void;
  index?: number;
}) {
  const navigate = useNavigate();
  const [showQty, setShowQty] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const corners = [
    "rounded-[14px]",
    "rounded-[10px]",
    "rounded-[18px]",
    "rounded-[12px]",
    "rounded-[16px]",
  ];
  const cornerClass = corners[index % corners.length];

  const handleAdd = () => {
    if (!onAddToCart) return;
    onAddToCart(product, qty);
    setAdded(true);
    setShowQty(false);
    setQty(1);
    setTimeout(() => setAdded(false), 1800);
  };

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

          {showQty ? (
            <div className="flex items-center gap-1">
              <button
                className="flex size-6 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(Math.max(1, qty - 1));
                }}
              >
                <Minus className="size-2.5" />
              </button>
              <span className="w-5 text-center text-[12px] font-medium">
                {qty}
              </span>
              <button
                className="flex size-6 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(qty + 1);
                }}
              >
                <Plus className="size-2.5" />
              </button>
              <button
                className="ml-0.5 flex size-6 items-center justify-center rounded-full bg-[#c96b8b] text-white transition-colors hover:bg-[#b85d7c]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd();
                }}
              >
                <Check className="size-3" />
              </button>
            </div>
          ) : (
            <button
              className={`flex size-7 items-center justify-center rounded-full border transition-all ${
                added
                  ? "border-[#c96b8b] bg-[#c96b8b] text-white"
                  : "border-border/50 hover:border-[#c96b8b]/30 hover:bg-[#c96b8b]/5"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (added) return;
                setShowQty(true);
              }}
            >
              {added ? (
                <Check className="size-3" />
              ) : (
                <ShoppingBag className="size-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
