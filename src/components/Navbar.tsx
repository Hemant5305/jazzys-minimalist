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
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = (user as any)?.role === "admin";

  const handleSignOut = async () => {
    const { useAuthActions } = await import("@convex-dev/auth/react");
    const { signOut } = useAuthActions();
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[52px] max-w-[1360px] items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
            Jazzy's
          </span>
          <span className="text-[12px] font-light text-[#c96b8b]">
            Salon & Beauty
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-[13px] text-[#666] transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-[13px] text-[#666] transition-colors hover:text-foreground"
          >
            Shop
          </Link>
          <button
            onClick={() => {
              if (window.location.pathname === "/") {
                document
                  .getElementById("salon-booking")
                  ?.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/#salon-booking");
              }
            }}
            className="text-[13px] text-[#666] transition-colors hover:text-foreground"
          >
            Book Appointment
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[13px] text-[#666] transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative hidden h-8 w-8 md:inline-flex"
                onClick={onCartClick}
              >
                <ShoppingBag className="size-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-[16px] items-center justify-center rounded-full bg-[#c96b8b] text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 md:inline-flex"
                onClick={() => navigate("/account")}
              >
                <User className="size-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-7 rounded-full px-3 text-[11px] text-[#666] hover:text-foreground md:inline-flex"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="hidden h-7 rounded-full bg-[#c96b8b] px-4 text-[11px] text-white hover:bg-[#b85d7c] md:inline-flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}

          <button
            className="inline-flex items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-5 py-3">
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-[13px] text-[#666] hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="rounded-lg px-3 py-2 text-[13px] text-[#666] hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                Shop
              </Link>
              <button
                className="rounded-lg px-3 py-2 text-left text-[13px] text-[#666] hover:bg-muted"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("salon-booking")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Book Appointment
              </button>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-2 text-[13px] text-[#666] hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="my-1.5 border-t border-border/60" />
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-[13px]"
                    onClick={() => {
                      setMobileOpen(false);
                      onCartClick?.();
                    }}
                  >
                    <ShoppingBag className="size-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#c96b8b] text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-[13px]"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/account");
                    }}
                  >
                    <User className="size-4" />
                    My Account
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-[13px]"
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
                  className="w-full rounded-full bg-[#c96b8b] text-[13px] text-white hover:bg-[#b85d7c]"
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
