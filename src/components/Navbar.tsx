import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Calendar, User } from "lucide-react";

export function Navbar({
  cartCount = 0,
  onCartClick,
}: {
  cartCount?: number;
  onCartClick?: () => void;
}) {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Jazzy's
          </span>
          <span className="text-xl font-light text-[#fb6900]">
            Salon & Beauty
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Shop
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("salon-booking");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/#salon-booking");
              }
            }}
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Book Appointment
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden md:inline-flex"
                onClick={onCartClick}
              >
                <ShoppingBag className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#fb6900] text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => navigate("/dashboard")}
              >
                <User className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex rounded-full border-border/50 text-xs"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden rounded-full bg-[#fb6900] text-white hover:bg-[#e55d00] md:inline-flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                Shop
              </Link>
              <button
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground/70 transition-colors hover:bg-muted"
                onClick={() => {
                  setMobileOpen(false);
                  const el = document.getElementById("salon-booking");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Book Appointment
              </button>
              <div className="my-2 border-t border-border" />
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setMobileOpen(false);
                      onCartClick?.();
                    }}
                  >
                    <ShoppingBag className="size-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#fb6900] text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full rounded-full bg-[#fb6900] text-white hover:bg-[#e55d00]"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/auth");
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
