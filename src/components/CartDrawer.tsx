import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  } | null;
}

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}) {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:w-[380px]">
        <SheetHeader>
          <SheetTitle className="text-[15px] font-medium">
            Your Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-[13px] text-[#888]">Nothing in here yet</p>
              <Button
                variant="link"
                className="mt-1.5 text-[12px] text-[#c96b8b]"
                onClick={onClose}
              >
                Keep browsing
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {items.map((item) => {
                  if (!item.product) return null;
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="flex gap-3 border-b border-border/50 py-3.5"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="size-[72px] shrink-0 rounded-[10px] object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-[13px] font-medium leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="mt-0.5 text-[10px] text-[#999]">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex size-[22px] items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                              onClick={() =>
                                onUpdateQuantity(item._id, item.quantity - 1)
                              }
                            >
                              <Minus className="size-2.5" />
                            </button>
                            <span className="w-5 text-center text-[12px]">
                              {item.quantity}
                            </span>
                            <button
                              className="flex size-[22px] items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                              onClick={() =>
                                onUpdateQuantity(item._id, item.quantity + 1)
                              }
                            >
                              <Plus className="size-2.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              className="text-[#999] transition-colors hover:text-red-500"
                              onClick={() => onRemove(item._id)}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-border/50 pt-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] text-[#666]">Subtotal</span>
                <span className="text-[15px] font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mb-3 text-[10px] text-[#999]">
                Shipping & taxes calculated at checkout
              </p>
              <Button
                className="w-full rounded-full bg-[#c96b8b] text-[13px] text-white hover:bg-[#b85d7c]"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
