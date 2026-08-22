import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const products = useQuery(api.products.list);
  const categories = useQuery(api.products.getCategories);
  const cartItems = useQuery(
    api.cart.getCart,
    user ? { userId: (user as any)._id } : "skip",
  );
  const cartCount = useQuery(
    api.cart.getCartCount,
    user ? { userId: (user as any)._id } : "skip",
  );
  const addToCart = useMutation(api.cart.addToCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  const seedMutation = useMutation(api.seed.seedProducts);
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!seeded) {
      seedMutation()
        .then(() => setSeeded(true))
        .catch(() => setSeeded(true));
    }
  }, [seeded, seedMutation]);

  const handleAddToCart = async (product: any) => {
    if (!user) {
      navigate("/auth?returnTo=/shop");
      return;
    }
    await addToCart({ userId: (user as any)._id, productId: product._id });
  };

  const filteredProducts = (products ?? []).filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = ["All", ...(categories ?? [])];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount ?? 0}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="mx-auto max-w-[1360px] px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
            Our Collection
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Everything you need, in one place
          </h1>
          <p className="mt-1.5 max-w-md text-[14px] text-[#666]">
            Browse our full range of products — skincare, haircare, tools, and
            more. Every item is tried and tested by our team.
          </p>
        </motion.div>

        {/* Search + filters */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#999]" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border-border/50 pl-8 text-[13px]"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "border-[#c96b8b] bg-[#c96b8b] text-white"
                    : "border-border/50 bg-white text-[#666] hover:border-[#c96b8b]/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11px] text-[#999]">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Product grid */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products === undefined
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-3 aspect-square rounded-[14px] bg-secondary" />
                  <div className="h-3 w-14 rounded bg-secondary" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
                  <div className="mt-1.5 h-3 w-1/2 rounded bg-secondary" />
                </div>
              ))
            : filteredProducts.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product as any}
                  index={i}
                  onAddToCart={handleAddToCart}
                />
              ))}
        </div>

        {products !== undefined && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-base font-medium text-foreground">
              No products found
            </p>
            <p className="mt-1 text-[13px] text-[#666]">
              Try adjusting your search or filters.
            </p>
            <Button
              variant="outline"
              className="mt-3 rounded-full text-[12px]"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={(cartItems ?? []) as any}
        onUpdateQuantity={(id, qty) =>
          updateQuantity({ cartItemId: id as any, quantity: qty })
        }
        onRemove={(id) => removeFromCart({ cartItemId: id as any })}
      />
    </div>
  );
}
