import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  Loader2,
  Lock,
  Truck,
} from "lucide-react";

type CheckoutStep = "shipping" | "payment" | "confirming" | "done";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<CheckoutStep>("shipping");

  const cartItems = useQuery(
    api.cart.getCart,
    user ? { userId: (user as any)._id } : "skip",
  );
  const createOrder = useMutation(api.orders.createFromCart);

  const [shipping, setShipping] = useState({
    fullName: (user as any)?.name ?? "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">(
    "upi",
  );
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = (cartItems ?? []).filter((item) => item.product);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      await createOrder({
        userId: (user as any)._id,
        shippingAddress: `${shipping.fullName}, ${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}`,
      });
      setStep("done");
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    navigate("/auth?returnTo=/checkout");
    return null;
  }

  if (items.length === 0 && step !== "done") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-lg font-medium">Your bag is empty</p>
          <p className="mt-1 text-sm text-[#666]">
            Add some products before checking out.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-[6px]"
            onClick={() => navigate("/shop")}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Order Placed!</h2>
            <p className="max-w-sm text-sm text-[#666]">
              Thank you for shopping with us. We'll send you a confirmation
              shortly with tracking details.
            </p>
            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                className="rounded-[6px]"
                onClick={() => navigate("/account")}
              >
                View Orders
              </Button>
              <Button
                className="rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={items.length} />

      <main className="mx-auto max-w-[1000px] px-6 py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#666] transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back
        </button>

        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Checkout
        </h1>

        {/* Progress steps */}
        <div className="mt-6 flex items-center gap-3 text-xs">
          <span
            className={`flex items-center gap-1.5 ${
              step === "shipping"
                ? "font-medium text-foreground"
                : "text-[#666]"
            }`}
          >
            <MapPin className="size-3.5" />
            Shipping
          </span>
          <span className="text-[#ccc]">—</span>
          <span
            className={`flex items-center gap-1.5 ${
              step === "payment"
                ? "font-medium text-foreground"
                : "text-[#666]"
            }`}
          >
            <CreditCard className="size-3.5" />
            Payment
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: form */}
          <div>
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-sm font-medium text-foreground">
                  Shipping Details
                </h2>
                <div className="mt-4 grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] text-[#666]">
                        Full Name
                      </label>
                      <Input
                        value={shipping.fullName}
                        onChange={(e) =>
                          setShipping({ ...shipping, fullName: e.target.value })
                        }
                        placeholder="Jane Doe"
                        className="rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-[#666]">
                        Phone
                      </label>
                      <Input
                        value={shipping.phone}
                        onChange={(e) =>
                          setShipping({ ...shipping, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="rounded-[6px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-[#666]">
                      Address
                    </label>
                    <Textarea
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping({ ...shipping, address: e.target.value })
                      }
                      placeholder="Flat / House No., Street, Landmark"
                      className="min-h-[70px] rounded-[6px]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] text-[#666]">
                        City
                      </label>
                      <Input
                        value={shipping.city}
                        onChange={(e) =>
                          setShipping({ ...shipping, city: e.target.value })
                        }
                        placeholder="Mumbai"
                        className="rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-[#666]">
                        State
                      </label>
                      <Input
                        value={shipping.state}
                        onChange={(e) =>
                          setShipping({ ...shipping, state: e.target.value })
                        }
                        placeholder="Maharashtra"
                        className="rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-[#666]">
                        Pincode
                      </label>
                      <Input
                        value={shipping.pincode}
                        onChange={(e) =>
                          setShipping({ ...shipping, pincode: e.target.value })
                        }
                        placeholder="400001"
                        className="rounded-[6px]"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="mt-6 rounded-[6px] bg-[#c96b8b] px-8 text-white hover:bg-[#b85d7c]"
                  disabled={
                    !shipping.fullName ||
                    !shipping.phone ||
                    !shipping.address ||
                    !shipping.city ||
                    !shipping.pincode ||
                    !shipping.state
                  }
                  onClick={() => setStep("payment")}
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-foreground">
                    Payment Method
                  </h2>
                  <button
                    className="text-[11px] text-[#c96b8b] hover:underline"
                    onClick={() => setStep("shipping")}
                  >
                    Edit Shipping
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  {/* UPI */}
                  <button
                    className={`flex items-center gap-3 rounded-[6px] border px-4 py-3 text-left transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#c96b8b] bg-[#c96b8b]/5"
                        : "border-border hover:border-border/80"
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <Smartphone className="size-4 text-[#c96b8b]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">UPI</p>
                      <p className="text-[11px] text-[#666]">
                        Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                    <span
                      className={`size-4 rounded-full border-2 ${
                        paymentMethod === "upi"
                          ? "border-[#c96b8b] bg-[#c96b8b]"
                          : "border-[#ccc]"
                      }`}
                    />
                  </button>

                  {paymentMethod === "upi" && (
                    <div className="ml-7 mt-1">
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="rounded-[6px] text-sm"
                      />
                    </div>
                  )}

                  {/* Card */}
                  <button
                    className={`flex items-center gap-3 rounded-[6px] border px-4 py-3 text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-[#c96b8b] bg-[#c96b8b]/5"
                        : "border-border hover:border-border/80"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="size-4 text-[#c96b8b]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Credit / Debit Card</p>
                      <p className="text-[11px] text-[#666]">
                        Visa, Mastercard, RuPay
                      </p>
                    </div>
                    <span
                      className={`size-4 rounded-full border-2 ${
                        paymentMethod === "card"
                          ? "border-[#c96b8b] bg-[#c96b8b]"
                          : "border-[#ccc]"
                      }`}
                    />
                  </button>

                  {/* COD */}
                  <button
                    className={`flex items-center gap-3 rounded-[6px] border px-4 py-3 text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#c96b8b] bg-[#c96b8b]/5"
                        : "border-border hover:border-border/80"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <Banknote className="size-4 text-[#c96b8b]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-[11px] text-[#666]">
                        Pay when your order arrives
                      </p>
                    </div>
                    <span
                      className={`size-4 rounded-full border-2 ${
                        paymentMethod === "cod"
                          ? "border-[#c96b8b] bg-[#c96b8b]"
                          : "border-[#ccc]"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-[6px]"
                    onClick={() => setStep("shipping")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
                    disabled={
                      paymentMethod === "upi" && !upiId.trim()
                    }
                    onClick={() => {
                      setStep("confirming");
                      handlePlaceOrder();
                    }}
                  >
                    <Lock className="mr-1.5 size-3.5" />
                    Pay {formatPrice(total)}
                  </Button>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#999]">
                  <Lock className="size-3" />
                  Payments are processed securely. We never store your card details.
                </div>
              </motion.div>
            )}

            {step === "confirming" && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Loader2 className="size-8 animate-spin text-[#c96b8b]" />
                <p className="text-sm text-[#666]">Processing your order...</p>
              </div>
            )}
          </div>

          {/* Right: order summary */}
          <div className="rounded-[12px] border border-border/50 bg-secondary/30 p-5">
            <h3 className="text-sm font-medium">Order Summary</h3>

            <div className="mt-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img
                    src={item.product!.imageUrl}
                    alt={item.product!.name}
                    className="size-12 shrink-0 rounded-[6px] object-cover"
                  />
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="text-xs font-medium leading-tight">
                        {item.product!.name}
                      </p>
                      <p className="text-[11px] text-[#666]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-medium">
                      {formatPrice(item.product!.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {subtotal < 999 && (
              <div className="mt-3 flex items-center gap-2 rounded-[6px] bg-[#fce4ec]/30 px-3 py-2 text-[11px] text-[#666]">
                <Truck className="size-3.5 shrink-0 text-[#c96b8b]" />
                Add {formatPrice(999 - subtotal)} more for free shipping
              </div>
            )}

            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#999]">
              <Lock className="size-3" />
              Secure checkout · 30-day returns
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
