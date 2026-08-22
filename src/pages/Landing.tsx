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

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

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

  // Seed on first load
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
          <div className="grid min-h-[80vh] items-center gap-12 py-16 md:grid-cols-2 md:py-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-1.5"
              >
                <Sparkles className="size-3.5 text-[#fb6900]" />
                <span className="text-[11px] font-medium tracking-wide text-[#666]">
                  Premium Beauty & Salon Services
                </span>
              </motion.div>

              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-foreground">
                Your Beauty,
                <br />
                <span className="text-[#fb6900]">Our Passion</span>
              </h1>

              <p className="max-w-md text-base leading-relaxed text-[#666]">
                Curated beauty products and expert salon services, all in one
                place. Discover what makes you feel your best.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-[6px] bg-[#fb6900] px-8 text-white hover:bg-[#e55d00]"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now
                  <ArrowRight className="ml-1 size-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-[6px] border-border/40 px-8"
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="mr-1.5 size-4" />
                  Book Appointment
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {["S", "M", "K", "J", "L"].map((l, i) => (
                      <div
                        key={i}
                        className="flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-medium ring-2 ring-white"
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-[#666]">
                    2,500+ happy clients
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3 fill-[#fb6900] text-[#fb6900]"
                    />
                  ))}
                  <span className="ml-0.5 text-xs text-[#666]">4.9</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1000&fit=crop"
                  alt="Jazzy's Salon interior"
                  className="h-full w-full object-cover"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 rounded-[16px] bg-white/90 p-4 shadow-lg backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#fb6900]/10">
                      <Scissors className="size-5 text-[#fb6900]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expert Stylists</p>
                      <p className="text-[11px] text-[#666]">
                        Over a decade of experience
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-semibold text-[#fb6900]">
                        50%
                      </p>
                      <p className="text-[11px] text-[#666]">
                        off your first visit
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES STRIP ═══ */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4 md:py-12">
          {[
            {
              icon: Truck,
              title: "Complimentary Shipping",
              desc: "On orders over $50",
            },
            {
              icon: Shield,
              title: "Secure Checkout",
              desc: "Encrypted payment processing",
            },
            {
              icon: Leaf,
              title: "Clean Beauty",
              desc: "Cruelty-free, ethically sourced",
            },
            {
              icon: Heart,
              title: "Expert Care",
              desc: "Professional salon services",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              {...staggerItem}
              className="flex items-center gap-3"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                <feature.icon className="size-4.5 text-[#fb6900]" />
              </div>
              <div>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-[11px] text-[#666]">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ BEST SELLERS ═══ */}
      <section className="mx-auto max-w-[1360px] px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="text-center">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#fb6900]">
            Our Best Sellers
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Customer Favorites
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#666]">
            Handpicked products our customers reach for time and again. Quality
            you can see and feel.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {bestSellers === undefined
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-4 aspect-square rounded-[20px] bg-secondary" />
                  <div className="h-3 w-16 rounded bg-secondary" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-secondary" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-secondary" />
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

        <motion.div {...fadeUp} className="mt-12 text-center">
          <Button
            variant="outline"
            className="rounded-[6px] border-border/40 px-8"
            onClick={() => navigate("/shop")}
          >
            View All Products
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </motion.div>
      </section>

      {/* ═══ SALON BOOKING ═══ */}
      <section
        id="salon-booking"
        className="border-y border-border bg-secondary/30"
      >
        <div className="mx-auto max-w-[1360px] px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="overflow-hidden rounded-[20px]">
                    <img
                      src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
                      alt="Hair styling"
                      className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-72"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[20px]">
                    <img
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop"
                      alt="Nail art"
                      className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-52"
                    />
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="overflow-hidden rounded-[20px]">
                    <img
                      src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop"
                      alt="Facial treatment"
                      className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-52"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[20px]">
                    <img
                      src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop"
                      alt="Makeup"
                      className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-72"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#fb6900]">
                  Salon Services
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Book Your
                  <br />
                  Perfect Look
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#666]">
                  From precision haircuts to rejuvenating facials, our
                  experienced stylists bring artistry and care to every
                  appointment. Reserve your spot in just a few clicks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Scissors, label: "Haircuts & Styling" },
                  { icon: Palette, label: "Color & Highlights" },
                  { icon: Sparkles, label: "Facials & Skincare" },
                  { icon: Heart, label: "Nail Services" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 rounded-[6px] border border-border/50 bg-white px-3 py-2.5"
                  >
                    <s.icon className="size-4 text-[#fb6900]" />
                    <span className="text-[13px] font-medium">{s.label}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-fit rounded-[6px] bg-[#fb6900] px-8 text-white hover:bg-[#e55d00]"
                onClick={() => setBookingOpen(true)}
              >
                <Calendar className="mr-1.5 size-4" />
                Book Appointment
              </Button>

              <p className="text-[11px] text-[#666]">
                Complimentary consultation on your first visit · No commitment
                required
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="mx-auto max-w-[1360px] px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="text-center">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#fb6900]">
            Testimonials
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            What Our Clients Say
          </h2>
        </motion.div>

        <motion.div
          initial={{}}
          whileInView={{ transition: { staggerChildren: 0.08 } }}
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              name: "Sarah M.",
              text: "The best salon experience I have ever had. The stylists are incredibly talented, and the products they carry are top-notch. My hair has never looked better.",
              rating: 5,
              service: "Hair Color",
            },
            {
              name: "Emily R.",
              text: "I have been a loyal customer for over a year. Online booking is effortless, and the facial treatments are absolutely divine. Truly a premium experience.",
              rating: 5,
              service: "Facial Treatment",
            },
            {
              name: "Jessica L.",
              text: "I love shopping their beauty products online. Fast shipping, beautiful packaging, and the Vitamin C Serum has been a game-changer for my skin.",
              rating: 5,
              service: "Online Shopping",
            },
          ].map((testimonial) => (
            <motion.div
              key={testimonial.name}
              {...staggerItem}
              className="rounded-[20px] border border-border/50 bg-white p-6 transition-shadow hover:shadow-[rgba(28,29,33,0.06)_0px_6px_6px_0px]"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3 fill-[#fb6900] text-[#fb6900]"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#666]">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-medium">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-[11px] text-[#666]">
                    {testimonial.service}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="border-y border-border">
        <div className="mx-auto max-w-[1360px] px-6 py-20 text-center md:py-24">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Ready to Glow?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[#666]">
              Join thousands of satisfied customers. Explore our curated
              collection or book your next salon visit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                className="rounded-[6px] bg-[#fb6900] px-8 text-white hover:bg-[#e55d00]"
                onClick={() => navigate("/shop")}
              >
                Shop Collection
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-[6px] border-border/40 px-8"
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
        <div className="mx-auto max-w-[1360px] px-6 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold text-white">Jazzy's</h3>
              <p className="mt-1 text-sm font-light text-[#fb6900]">
                Salon & Beauty
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#999]">
                Premium beauty products and expert salon services, all under one
                roof.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2.5">
                {["Shop All", "Best Sellers", "New Arrivals"].map((link) => (
                  <li key={link}>
                    <a
                      href="/shop"
                      className="text-sm text-[#999] transition-colors hover:text-[#fb6900]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Salon
              </h4>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Hair Services",
                  "Nail Services",
                  "Facial Treatments",
                  "Book Appointment",
                ].map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm text-[#999] transition-colors hover:text-[#fb6900]"
                      onClick={() => setBookingOpen(true)}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
                Contact
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-[#999]">
                <li>123 Beauty Avenue, Suite 100</li>
                <li>New York, NY 10001</li>
                <li className="text-[#fb6900]">+1 (555) 123-4567</li>
                <li>hello@jazzyssalon.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-xs text-[#666]">
              &copy; 2026 Jazzy's Salon & Beauty. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-[#666] transition-colors hover:text-[#fb6900]"
                  >
                    {link}
                  </a>
                ),
              )}
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
