import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ReviewSection } from "@/components/ReviewSection";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = useQuery(api.products.get, id ? { id: id as any } : "skip");
  const allProducts = useQuery(api.products.list);
  const cartItems = useQuery(
    api.cart.getCart,
    user ? { userId: user._id } : "skip",
  );
  const cartCount = useQuery(
    api.cart.getCartCount,
    user ? { userId: user._id } : "skip",
  );
  const addToCart = useMutation(api.cart.addToCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  const handleAddToCart = async () => {
    if (!isAuthenticated || !user || !product) {
      navigate("/auth?returnTo=" + encodeURIComponent(`/product/${id}`));
      return;
    }
    await addToCart({
      userId: user._id,
      productId: product._id,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const related = (allProducts ?? [])
    .filter((p) => p._id !== product?._id && p.category === product?.category)
    .slice(0, 4);

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="mx-auto max-w-[1000px] px-6 py-10">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-secondary" />
            <div className="mt-6 grid gap-10 md:grid-cols-2">
              <div className="aspect-square rounded-[18px] bg-secondary" />
              <div className="flex flex-col gap-3 py-2">
                <div className="h-3 w-14 rounded bg-secondary" />
                <div className="h-6 w-3/4 rounded bg-secondary" />
                <div className="h-4 w-1/3 rounded bg-secondary" />
                <div className="h-16 rounded bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="mx-auto max-w-[1000px] px-6 py-20 text-center">
          <h2 className="text-lg font-medium">Product Not Found</h2>
          <p className="mt-1 text-[13px] text-[#666]">
            This product might have been removed or is no longer available.
          </p>
          <Button
            className="mt-4 rounded-full"
            variant="outline"
            size="sm"
            onClick={() => navigate("/shop")}
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount ?? 0}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="mx-auto max-w-[1000px] px-6 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1.5 text-[11px] text-[#888] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Back
          </button>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-square overflow-hidden rounded-[18px] bg-secondary">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
                  {product.badge}
                </span>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#999]">
              {product.category}
            </p>
            <h1 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {product.name}
            </h1>

            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3 ${
                      i < Math.round(product.rating)
                        ? "fill-[#c96b8b] text-[#c96b8b]"
                        : "fill-border text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#888]">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <p className="mt-3 text-lg font-semibold text-foreground">
              {formatPrice(product.price)}
            </p>

            <p className="mt-2.5 text-[13px] leading-relaxed text-[#666]">
              {product.description}
            </p>

            <div className="mt-3">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
                  <span className="size-1 rounded-full bg-green-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-medium text-red-600">
                  <span className="size-1 rounded-full bg-red-400" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-[13px] text-[#666]">Qty</span>
              <div className="flex items-center gap-2.5 rounded-full border border-border px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-foreground/50 transition-colors hover:text-foreground"
                >
                  <Minus className="size-3" />
                </button>
                <span className="w-5 text-center text-[13px] font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-foreground/50 transition-colors hover:text-foreground"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>

            {/* Add to bag */}
            <Button
              className="mt-5 w-full rounded-full bg-[#c96b8b] py-5 text-[13px] text-white hover:bg-[#b85d7c]"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-1.5 size-3.5" />
              {addedToCart
                ? "Added!"
                : `Add to Bag — ${formatPrice(product.price * quantity)}`}
            </Button>

            {/* Trust */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Free shipping over ₹999" },
                { icon: Shield, label: "Secure checkout" },
                { icon: RotateCcw, label: "30-day returns" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1 rounded-[8px] border border-border/40 px-1.5 py-2.5 text-center"
                >
                  <item.icon className="size-3.5 text-[#c96b8b]" />
                  <span className="text-[9px] leading-tight text-[#888]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={id!} />

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-border/50 pt-8">
            <h3 className="font-display text-[17px] font-medium">
              You might also like
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard
                  key={p._id}
                  product={p as any}
                  index={i}
                  onAddToCart={async () => {
                    if (!isAuthenticated || !user) {
                      navigate("/auth");
                      return;
                    }
                    await addToCart({
                      userId: user._id,
                      productId: p._id,
                    });
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={(cartItems ?? []) as any}
        onUpdateQuantity={(itemId, qty) =>
          updateQuantity({ cartItemId: itemId as any, quantity: qty })
        }
        onRemove={(itemId) =>
          removeFromCart({ cartItemId: itemId as any })
        }
      />
    </div>
  );
}
