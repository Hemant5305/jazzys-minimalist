import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { SalonBookingModal } from "@/components/SalonBookingModal";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  Sparkles,
  Star,
  Shield,
  Truck,
  Heart,
  ArrowRight,
  Scissors,
  Palette,
  Leaf,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const bestSellers = useQuery(api.products.getBestSellers);
  const cartItems = useQuery(
    api.cart.getCart,
    isAuthenticated && user ? { userId: (user as any)._id } : "skip",
  );
  const cartCount = useQuery(
    api.cart.getCartCount,
    isAuthenticated && user ? { userId: (user as any)._id } : "skip",
  );
  const addToCart = useMutation(api.cart.addToCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  const handleAddToCart = async (product: any) => {
    if (!isAuthenticated || !user) {
      navigate("/auth?returnTo=/");
      return;
    }
    await addToCart({ userId: (user as any)._id, productId: product._id });
  };

  const seedMutation = useMutation(api.seed.seedProducts);
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (!seeded) {
      seedMutation()
        .then(() => setSeeded(true))
        .catch(() => setSeeded(true));
    }
  }, [seeded, seedMutation]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartCount={cartCount ?? 0}
        onCartClick={() => setCartOpen(true)}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="grid min-h-[65vh] items-center gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c96b8b]/15 bg-[#fce4ec]/30 px-3.5 py-1">
                <Sparkles className="size-3 text-[#c96b8b]" />
                <span className="text-[11px] font-medium tracking-wide text-[#666]">
                  Beauty & Salon, Together
                </span>
              </div>

              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
                Look good.
                <br />
                <span className="text-[#c96b8b]">Feel even better.</span>
              </h1>

              <p className="max-w-[420px] text-[15px] leading-relaxed text-[#666]">
                We hand-pick every product on our shelves and train every
                stylist behind our chairs. Come for the products, stay for the
                experience.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  className="rounded-full bg-[#c96b8b] px-7 text-[13px] text-white hover:bg-[#b85d7c]"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now
                  <ArrowRight className="ml-1 size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-[#c96b8b]/25 px-7 text-[13px] hover:border-[#c96b8b]/50"
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="mr-1.5 size-3.5" />
                  Book a Visit
                </Button>
              </div>

              <div className="flex items-center gap-5 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {["S", "M", "K", "J", "P"].map((l, i) => (
                      <div
                        key={i}
                        className="flex size-[26px] items-center justify-center rounded-full bg-[#fce4ec] text-[10px] font-medium text-[#c96b8b] ring-2 ring-white"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-[#888]">
                    2,500+ clients
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3 fill-[#c96b8b] text-[#c96b8b]"
                    />
                  ))}
                  <span className="ml-0.5 text-xs font-medium text-[#888]">
                    4.9
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden md:block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1000&fit=crop"
                  alt="Jazzy's Salon interior"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating card — offset, not centered */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-4 -left-6 right-8 rounded-[14px] bg-white p-4 shadow-[rgba(0,0,0,0.08)_0px_4px_20px]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#c96b8b]/8">
                    <Scissors className="size-4.5 text-[#c96b8b]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">
                      First-time clients
                    </p>
                    <p className="text-[11px] text-[#888]">
                      Enjoy 50% off any salon service
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-[#c96b8b]">
                    50%
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="border-y border-border/60">
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-x-6 gap-y-5 px-6 py-8 md:grid-cols-4">
          {[
            { icon: Truck, label: "Free shipping over ₹999" },
            { icon: Shield, label: "Secure payment processing" },
            { icon: Leaf, label: "Cruelty-free, clean beauty" },
            { icon: Heart, label: "Expert stylists on call" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <f.icon className="size-4 shrink-0 text-[#c96b8b]" />
              <span className="text-[13px] text-[#555]">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BEST SELLERS ═══ */}
      <section className="mx-auto max-w-[1360px] px-6 py-14 md:py-18">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
              Best Sellers
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              What everyone's reaching for
            </h2>
          </div>
          <Button
            variant="link"
            className="hidden text-sm text-[#c96b8b] hover:text-[#b85d7c] md:inline-flex"
            onClick={() => navigate("/shop")}
          >
            View all
            <ArrowRight className="ml-1 size-3.5" />
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {bestSellers === undefined
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-3 aspect-square rounded-[14px] bg-secondary" />
                  <div className="h-3 w-14 rounded bg-secondary" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
                  <div className="mt-1.5 h-3 w-1/2 rounded bg-secondary" />
                </div>
              ))
            : bestSellers?.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product as any}
                  index={i}
                  onAddToCart={handleAddToCart}
                />
              ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            className="rounded-full border-[#c96b8b]/25 px-6 text-[13px]"
            onClick={() => navigate("/shop")}
          >
            View All Products
            <ArrowRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </section>

      {/* ═══ SALON BOOKING ═══ */}
      <section id="salon-booking" className="bg-[#faf8f7]">
        <div className="mx-auto max-w-[1360px] px-6 py-14 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Images — asymmetric grid, not a perfect 2-col */}
            <div className="relative">
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-3">
                <div className="flex flex-col gap-3">
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=480&fit=crop"
                      alt="Hair styling"
                      className="h-52 w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-64"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=280&fit=crop"
                      alt="Nail art"
                      className="h-36 w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-44"
                    />
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=280&fit=crop"
                      alt="Facial treatment"
                      className="h-36 w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-44"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=480&fit=crop"
                      alt="Makeup"
                      className="h-52 w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Text + services */}
            <div className="flex flex-col gap-5 md:pl-6">
              <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
                  Salon Services
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Walk in. Walk out stunning.
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#666]">
                  Precision cuts, relaxing facials, flawless nails — our team
                  does it all. Pick a service and book a slot in seconds.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Scissors, label: "Haircuts & Styling" },
                  { icon: Palette, label: "Colour & Highlights" },
                  { icon: Sparkles, label: "Facials & Skincare" },
                  { icon: Heart, label: "Nail Services" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 rounded-[8px] border border-[#c96b8b]/10 bg-white px-3 py-2.5"
                  >
                    <s.icon className="size-3.5 text-[#c96b8b]" />
                    <span className="text-[12px] font-medium text-[#444]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <Button
                  className="rounded-full bg-[#c96b8b] px-7 text-[13px] text-white hover:bg-[#b85d7c]"
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="mr-1.5 size-3.5" />
                  Book Your Visit
                </Button>
                <p className="mt-2 text-[11px] text-[#999]">
                  Free consultation on your first visit · No strings attached
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="mx-auto max-w-[1360px] px-6 py-14 md:py-18">
        <div className="mb-8">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
            From our clients
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Real people, real results
          </h2>
        </div>

        {/* Varied card sizes instead of uniform 3-col */}
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_1fr]">
          {[
            {
              name: "Priya K.",
              text: "I've tried dozens of salons in Mumbai, and nothing comes close. The attention to detail is unreal — my colourist actually listened to what I wanted instead of doing her own thing.",
              rating: 5,
              service: "Hair Colour",
              featured: true,
            },
            {
              name: "Meera S.",
              text: "Their Vitamin C Serum cleared up my skin in two weeks. I've already ordered two more bottles.",
              rating: 5,
              service: "Online Order",
              featured: false,
            },
            {
              name: "Ananya R.",
              text: "Booked a bridal package for my sister's wedding. Every single treatment was thoughtful and precise. The whole team made us feel so welcome.",
              rating: 5,
              service: "Bridal Package",
              featured: false,
            },
          ].map((t) => (
            <div
              key={t.name}
              className={`rounded-[14px] border border-[#c96b8b]/8 p-5 transition-shadow hover:shadow-[0_4px_24px_rgba(201,107,139,0.06)] ${
                t.featured ? "bg-[#faf8f7]" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3 fill-[#c96b8b] text-[#c96b8b]"
                  />
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#555]">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-border/40 pt-3">
                <div className="flex size-7 items-center justify-center rounded-full bg-[#fce4ec] text-[10px] font-medium text-[#c96b8b]">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[12px] font-medium">{t.name}</p>
                  <p className="text-[10px] text-[#999]">{t.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-y border-border/60 bg-[#faf8f7]">
        <div className="mx-auto max-w-[1360px] px-6 py-14 text-center md:py-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Your next favourite thing is one click away
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-[#666]">
              Browse our full collection or book a salon appointment — either
              way, you're in good hands.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button
                className="rounded-full bg-[#c96b8b] px-7 text-[13px] text-white hover:bg-[#b85d7c]"
                onClick={() => navigate("/shop")}
              >
                Shop Collection
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[#c96b8b]/25 px-7 text-[13px]"
                onClick={() => setBookingOpen(true)}
              >
                Book Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#1b1a1a] text-[#d9d8d7]">
        <div className="mx-auto max-w-[1360px] px-6 py-12">
          <div className="grid gap-8 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Jazzy's
              </h3>
              <p className="mt-0.5 text-[13px] text-[#c96b8b]">
                Salon & Beauty
              </p>
              <p className="mt-3 max-w-[280px] text-[13px] leading-relaxed text-[#888]">
                Premium beauty products and expert salon services, all under one
                roof.
              </p>
            </div>

            <div>
              <h4 className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-[#999]">
                Shop
              </h4>
              <ul className="flex flex-col gap-1.5">
                {["All Products", "Best Sellers", "New Arrivals"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="/shop"
                        className="text-[13px] text-[#888] transition-colors hover:text-[#c96b8b]"
                      >
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-[#999]">
                Salon
              </h4>
              <ul className="flex flex-col gap-1.5">
                {[
                  "Hair Services",
                  "Nail Services",
                  "Facial Treatments",
                  "Book Appointment",
                ].map((link) => (
                  <li key={link}>
                    <button
                      className="text-[13px] text-[#888] transition-colors hover:text-[#c96b8b]"
                      onClick={() => setBookingOpen(true)}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2.5 text-[11px] font-medium uppercase tracking-wider text-[#999]">
                Get in Touch
              </h4>
              <ul className="flex flex-col gap-1.5 text-[13px] text-[#888]">
                <li>123 Beauty Avenue, Suite 100</li>
                <li>Mumbai, MH 400001</li>
                <li className="text-[#c96b8b]">+91 98765 43210</li>
                <li>hello@jazzyssalon.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-5 md:flex-row">
            <p className="text-[11px] text-[#555]">
              © 2026 Jazzy's Salon & Beauty. All rights reserved.
            </p>
            <div className="flex gap-5">
              {["Privacy", "Terms", "Refunds"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[11px] text-[#555] transition-colors hover:text-[#c96b8b]"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ MODALS ═══ */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={(cartItems ?? []) as any}
        onUpdateQuantity={(id, qty) =>
          updateQuantity({ cartItemId: id as any, quantity: qty })
        }
        onRemove={(id) => removeFromCart({ cartItemId: id as any })}
      />
      <SalonBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
