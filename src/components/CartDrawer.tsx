import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

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
  const total = items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-medium">
            Shopping Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-[#666]">Your bag is empty</p>
              <Button
                variant="link"
                className="mt-2 text-[#fb6900]"
                onClick={onClose}
              >
                Continue Shopping
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
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 border-b border-border py-4"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="size-20 rounded-[12px] object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-[#666]">
                            {item.product.category}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              className="flex size-6 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                              onClick={() =>
                                onUpdateQuantity(item._id, item.quantity - 1)
                              }
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              className="flex size-6 items-center justify-center rounded-full border border-border/50 transition-colors hover:bg-muted"
                              onClick={() =>
                                onUpdateQuantity(item._id, item.quantity + 1)
                              }
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              className="text-[#666] transition-colors hover:text-destructive"
                              onClick={() => onRemove(item._id)}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-border pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#666]">Subtotal</span>
                <span className="text-lg font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="mb-4 text-[11px] text-[#666]">
                Shipping & taxes calculated at checkout
              </p>
              <Button className="w-full rounded-[6px] bg-[#fb6900] text-white hover:bg-[#e55d00]">
                Checkout — ${total.toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
