import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Convex data
  const products = useQuery(api.products.list);
  const categories = useQuery(api.products.getCategories);
  const cartItems = useQuery(
    api.cart.getCart,
    user ? { userId: user._id } : "skip"
  );
  const cartCount = useQuery(
    api.cart.getCartCount,
    user ? { userId: user._id } : "skip"
  );
  const addToCart = useMutation(api.cart.addToCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  // Seed on first load
  const seedMutation = useMutation(api.seed.seedProducts);
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!seeded) {
      seedMutation().then(() => setSeeded(true)).catch(() => setSeeded(true));
    }
  }, [seeded, seedMutation]);

  const handleAddToCart = async (product: any) => {
    if (!user) return;
    await addToCart({ userId: user._id, productId: product._id as any });
  };

  const handleAddFromDetail = async (productId: string, quantity: number) => {
    if (!user) return;
    await addToCart({
      userId: user._id,
      productId: productId as any,
      quantity,
    });
  };

  // Filter products
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

      <main className="mx-auto max-w-[1360px] px-6 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#fb6900]">
            Our Collection
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Shop All Products
          </h1>
          <p className="mt-2 max-w-md text-sm text-[#666]">
            Browse our curated selection of premium beauty products, handpicked
            for quality and effectiveness.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#666]" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-[6px] border-border/50 pl-9"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "border-[#fb6900] bg-[#fb6900] text-white"
                    : "border-border/50 bg-white text-[#666] hover:border-border hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-[#666]">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Product Grid */}
        <div className="mt-4 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products === undefined
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-4 aspect-square rounded-[20px] bg-secondary" />
                  <div className="h-3 w-16 rounded bg-secondary" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-secondary" />
                </div>
              ))
            : filteredProducts.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product as any}
                  index={i}
                  onAddToCart={handleAddToCart}
                  onViewDetail={setSelectedProduct}
                />
              ))}
        </div>

        {products !== undefined && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              No products found
            </p>
            <p className="mt-1 text-sm text-[#666]">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-[6px]"
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

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-6">
          <p className="text-xs text-[#666]">
            © 2026 Jazzy's Salon & Beauty
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-[#666] transition-colors hover:text-[#fb6900]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={(cartItems ?? []) as any}
        onUpdateQuantity={(id, qty) =>
          updateQuantity({ cartItemId: id as any, quantity: qty })
        }
        onRemove={(id) => removeFromCart({ cartItemId: id as any })}
      />

      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddFromDetail}
      />
    </div>
  );
}
