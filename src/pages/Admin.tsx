import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

type Tab = "overview" | "products" | "bookings" | "orders";

const statusConfig: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50",
  processing: "text-blue-600 bg-blue-50",
  shipped: "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
  confirmed: "text-green-600 bg-green-50",
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [showProductForm, setShowProductForm] = useState(false);

  const isAdmin = (user as any)?.role === "admin";

  const products = useQuery(api.products.list);
  const bookings = useQuery(api.bookings.getAll);
  const orders = useQuery(api.orders.getAll);
  const users = useQuery(api.users.getAll);

  const updateBookingStatus = useMutation(api.bookings.updateStatus);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const deleteProduct = useMutation(api.products.remove);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartCount={0} />
        <div className="flex flex-col items-center justify-center py-32">
          <XCircle className="size-12 text-[#666]/30" />
          <h2 className="mt-4 text-lg font-semibold">Access Restricted</h2>
          <p className="mt-1 text-sm text-[#666]">
            You do not have administrator privileges.
          </p>
          <Button
            variant="outline"
            className="mt-4 rounded-[6px]"
            onClick={() => navigate("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Package },
    { id: "products", label: "Products", icon: Package },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={0} />

      <main className="mx-auto max-w-[1360px] px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c96b8b]">
            Administration
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#666]">
            Manage your products, appointments, and orders.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-[#c96b8b] text-foreground"
                  : "border-transparent text-[#666] hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "overview" && (
            <OverviewTab
              products={products}
              bookings={bookings}
              orders={orders}
              users={users}
            />
          )}
          {tab === "products" && (
            <ProductsTab
              products={products}
              onDelete={deleteProduct}
              onAdd={() => setShowProductForm(true)}
            />
          )}
          {tab === "bookings" && (
            <BookingsTab
              bookings={bookings}
              onUpdateStatus={updateBookingStatus}
            />
          )}
          {tab === "orders" && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={updateOrderStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({
  products,
  bookings,
  orders,
  users,
}: {
  products: any[] | undefined;
  bookings: any[] | undefined;
  orders: any[] | undefined;
  users: any[] | undefined;
}) {
  const stats = [
    {
      label: "Products",
      value: products?.length ?? 0,
      icon: Package,
    },
    {
      label: "Orders",
      value: orders?.length ?? 0,
      icon: ShoppingCart,
    },
    {
      label: "Bookings",
      value: bookings?.length ?? 0,
      icon: Calendar,
    },
    {
      label: "Users",
      value: users?.length ?? 0,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-[12px] border border-[#c96b8b]/10 bg-[#fce4ec]/20 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-white">
              <s.icon className="size-4 text-[#c96b8b]" />
            </div>
            <div>
              <p className="text-[11px] text-[#666]">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab({
  products,
  onDelete,
  onAdd,
}: {
  products: any[] | undefined;
  onDelete: any;
  onAdd: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await onDelete({ productId: id });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#666]">
          {products?.length ?? 0} products
        </p>
        <Button
          size="sm"
          className="rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
          onClick={onAdd}
        >
          <Plus className="mr-1 size-3.5" />
          Add Product
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 pr-4 font-medium text-[#666]">Product</th>
              <th className="pb-3 pr-4 font-medium text-[#666]">Category</th>
              <th className="pb-3 pr-4 font-medium text-[#666]">Price</th>
              <th className="pb-3 pr-4 font-medium text-[#666]">Rating</th>
              <th className="pb-3 font-medium text-[#666]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products === undefined
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="h-4 w-16 animate-pulse rounded bg-secondary" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 w-8 animate-pulse rounded bg-secondary" />
                    </td>
                  </tr>
                ))
              : products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-border/50 transition-colors hover:bg-[#fce4ec]/10"
                  >
                    <td className="flex items-center gap-3 py-3 pr-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="size-9 shrink-0 rounded-[6px] object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </td>
                    <td className="py-3 pr-4 text-[#666]">
                      {product.category}
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 pr-4 text-[#666]">
                      {product.rating} ({product.reviewCount})
                    </td>
                    <td className="py-3">
                      <button
                        className="text-[#666] transition-colors hover:text-red-500"
                        disabled={deleting === product._id}
                        onClick={() => handleDelete(product._id)}
                      >
                        {deleting === product._id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Bookings Tab ─── */
function BookingsTab({
  bookings,
  onUpdateStatus,
}: {
  bookings: any[] | undefined;
  onUpdateStatus: any;
}) {
  return (
    <div>
      <p className="text-sm text-[#666]">
        {bookings?.length ?? 0} total bookings
      </p>

      {bookings === undefined ? (
        <div className="mt-4 py-8 text-center text-sm text-[#666]">
          Loading...
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-4 rounded-[12px] border border-border/50 bg-secondary/30 py-12 text-center">
          <Calendar className="mx-auto size-8 text-[#666]/30" />
          <p className="mt-3 text-sm text-[#666]">No bookings yet</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="flex flex-col gap-3 rounded-[12px] border border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-[#fce4ec] text-[11px] font-medium text-[#c96b8b]">
                  {booking.userName?.[0]?.toUpperCase() ?? "G"}
                </div>
                <div>
                  <p className="text-sm font-medium">{booking.service}</p>
                  <p className="text-xs text-[#666]">
                    {booking.userName} · {booking.userEmail}
                  </p>
                  <p className="text-xs text-[#666]">
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {booking.time} · {booking.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${statusConfig[booking.status] ?? ""}`}
                >
                  {booking.status}
                </span>
                {booking.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-[4px] text-[10px]"
                      onClick={() =>
                        onUpdateStatus({
                          bookingId: booking._id,
                          status: "confirmed",
                        })
                      }
                    >
                      <CheckCircle2 className="mr-1 size-3" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-[4px] text-[10px] text-red-500 hover:bg-red-50"
                      onClick={() =>
                        onUpdateStatus({
                          bookingId: booking._id,
                          status: "cancelled",
                        })
                      }
                    >
                      <XCircle className="mr-1 size-3" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab({
  orders,
  onUpdateStatus,
}: {
  orders: any[] | undefined;
  onUpdateStatus: any;
}) {
  return (
    <div>
      <p className="text-sm text-[#666]">
        {orders?.length ?? 0} total orders
      </p>

      {orders === undefined ? (
        <div className="mt-4 py-8 text-center text-sm text-[#666]">
          Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-4 rounded-[12px] border border-border/50 bg-secondary/30 py-12 text-center">
          <ShoppingCart className="mx-auto size-8 text-[#666]/30" />
          <p className="mt-3 text-sm text-[#666]">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="rounded-[12px] border border-border/50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusConfig[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#666]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {order.items.map((item: any, i: number) => (
                      <img
                        key={i}
                        src={item.imageUrl}
                        alt={item.name}
                        className="size-8 rounded-[4px] object-cover"
                        title={`${item.name} × ${item.quantity}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold">
                    {formatPrice(order.total)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onUpdateStatus({
                        orderId: order._id,
                        status: e.target.value,
                      })
                    }
                    className="rounded-[4px] border border-border bg-white px-2 py-1 text-xs"
                  >
                    {[
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
