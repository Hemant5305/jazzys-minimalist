import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

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

export function ProductDetail({
  product,
  open,
  onClose,
  onAddToCart,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart?.(product._id, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[800px] gap-0 rounded-[20px] p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors hover:bg-white"
        >
          <X className="size-4" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square bg-secondary">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#666]">
                {product.category}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                {product.name}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${
                      i < Math.round(product.rating)
                        ? "fill-[#fb6900] text-[#fb6900]"
                        : "fill-border text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#666]">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-2xl font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[#666]">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#666]">Quantity</span>
              <div className="flex items-center gap-3 rounded-[6px] border border-border px-3 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-foreground/60 transition-colors hover:text-foreground"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Add to bag */}
            <Button
              className="mt-auto w-full rounded-[6px] bg-[#fb6900] text-white hover:bg-[#e55d00]"
              onClick={handleAdd}
            >
              <ShoppingBag className="mr-2 size-4" />
              Add to Bag — ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
