import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ReviewSection } from "@/components/ReviewSection";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
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

  // Related products (same category, excluding current)
  const related = (allProducts ?? [])
    .filter((p) => p._id !== product?._id && p.category === product?.category)
    .slice(0, 4);

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="mx-auto max-w-[1360px] px-6 py-20">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-secondary" />
            <div className="mt-6 grid gap-12 md:grid-cols-2">
              <div className="aspect-square rounded-[20px] bg-secondary" />
              <div className="flex flex-col gap-4 py-4">
                <div className="h-3 w-16 rounded bg-secondary" />
                <div className="h-8 w-3/4 rounded bg-secondary" />
                <div className="h-4 w-1/2 rounded bg-secondary" />
                <div className="h-20 rounded bg-secondary" />
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
        <div className="mx-auto max-w-[1360px] px-6 py-20 text-center">
          <h2 className="text-xl font-semibold">Product Not Found</h2>
          <p className="mt-2 text-sm text-[#666]">
            The product you are looking for may have been removed.
          </p>
          <Button
            className="mt-4 rounded-[6px]"
            variant="outline"
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

      <main className="mx-auto max-w-[1360px] px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#666] transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" />
            Back
          </button>
        </motion.div>

        {/* Product */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-secondary">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-medium shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#666]">
              {product.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
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
            <p className="mt-4 text-2xl font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-[#666]">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-4">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11px] font-medium text-green-700">
                  <span className="size-1.5 rounded-full bg-green-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-600">
                  <span className="size-1.5 rounded-full bg-red-400" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
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
              className="mt-6 w-full rounded-[6px] bg-[#fb6900] py-6 text-white hover:bg-[#e55d00]"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 size-4" />
              {addedToCart
                ? "Added to Bag!"
                : `Add to Bag — $${(product.price * quantity).toFixed(2)}`}
            </Button>

            {/* Trust signals */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free shipping over $50" },
                { icon: Shield, label: "Secure payment" },
                { icon: RotateCcw, label: "30-day returns" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 rounded-[6px] border border-border/50 bg-secondary/30 px-2 py-3 text-center"
                >
                  <item.icon className="size-4 text-[#fb6900]" />
                  <span className="text-[10px] leading-tight text-[#666]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={id!} />

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="text-lg font-semibold">You May Also Like</h3>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
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
