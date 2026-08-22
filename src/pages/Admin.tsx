import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Calendar,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
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
        <div className="flex flex-col items-center justify-center py-28">
          <XCircle className="size-10 text-[#666]/20" />
          <h2 className="mt-3 text-[15px] font-medium">Access Restricted</h2>
          <p className="mt-1 text-[12px] text-[#888]">
            You don't have administrator privileges.
          </p>
          <Button
            variant="outline"
            className="mt-3 rounded-full text-[12px]"
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

      <main className="mx-auto max-w-[1100px] px-6 py-8 md:py-12">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
            Administration
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-[#666]">
            Manage products, bookings, and orders.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-0.5 overflow-x-auto border-b border-border/50">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2 text-[13px] transition-colors ${
                tab === t.id
                  ? "border-[#c96b8b] font-medium text-foreground"
                  : "border-transparent text-[#888] hover:text-foreground"
              }`}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
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

/* ─── Overview ─── */
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
    { label: "Products", value: products?.length ?? 0, icon: Package },
    { label: "Orders", value: orders?.length ?? 0, icon: ShoppingCart },
    { label: "Bookings", value: bookings?.length ?? 0, icon: Calendar },
    { label: "Users", value: users?.length ?? 0, icon: Users },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-[10px] border border-border/50 p-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#fce4ec]/50">
              <s.icon className="size-3.5 text-[#c96b8b]" />
            </div>
            <div>
              <p className="text-[10px] text-[#999]">{s.label}</p>
              <p className="text-[17px] font-semibold">{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Products ─── */
function ProductsTab({
  products,
  onDelete,
}: {
  products: any[] | undefined;
  onDelete: any;
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
      <p className="text-[12px] text-[#888]">
        {products?.length ?? 0} products
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-2 pr-3 font-medium text-[#888]">Product</th>
              <th className="pb-2 pr-3 font-medium text-[#888]">Category</th>
              <th className="pb-2 pr-3 font-medium text-[#888]">Price</th>
              <th className="pb-2 pr-3 font-medium text-[#888]">Rating</th>
              <th className="pb-2 font-medium text-[#888]"></th>
            </tr>
          </thead>
          <tbody>
            {products === undefined
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-2.5 pr-3">
                        <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
                      </td>
                    ))}
                  </tr>
                ))
              : products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-border/30 transition-colors hover:bg-[#faf8f7]"
                  >
                    <td className="flex items-center gap-2.5 py-2.5 pr-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="size-8 shrink-0 rounded-[6px] object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#888]">
                      {product.category}
                    </td>
                    <td className="py-2.5 pr-3 font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-2.5 pr-3 text-[#888]">
                      {product.rating} ({product.reviewCount})
                    </td>
                    <td className="py-2.5">
                      <button
                        className="text-[#888] transition-colors hover:text-red-500"
                        disabled={deleting === product._id}
                        onClick={() => handleDelete(product._id)}
                      >
                        {deleting === product._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
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

/* ─── Bookings ─── */
function BookingsTab({
  bookings,
  onUpdateStatus,
}: {
  bookings: any[] | undefined;
  onUpdateStatus: any;
}) {
  return (
    <div>
      <p className="text-[12px] text-[#888]">
        {bookings?.length ?? 0} total bookings
      </p>

      {bookings === undefined ? (
        <div className="mt-3 py-6 text-center text-[12px] text-[#999]">
          Loading...
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-3 rounded-[12px] border border-border/50 bg-secondary/30 py-10 text-center">
          <Calendar className="mx-auto size-7 text-[#666]/20" />
          <p className="mt-2 text-[12px] text-[#888]">No bookings yet</p>
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="flex flex-col gap-2.5 rounded-[10px] border border-border/50 p-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#fce4ec]/50 text-[10px] font-medium text-[#c96b8b]">
                  {booking.userName?.[0]?.toUpperCase() ?? "G"}
                </div>
                <div>
                  <p className="text-[13px] font-medium">
                    {booking.service}
                  </p>
                  <p className="text-[11px] text-[#888]">
                    {booking.userName} · {booking.userEmail}
                  </p>
                  <p className="text-[11px] text-[#888]">
                    {new Date(booking.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {booking.time} · {booking.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusConfig[booking.status] ?? ""}`}
                >
                  {booking.status}
                </span>
                {booking.status === "pending" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 rounded-full text-[10px]"
                      onClick={() =>
                        onUpdateStatus({
                          bookingId: booking._id,
                          status: "confirmed",
                        })
                      }
                    >
                      <CheckCircle2 className="mr-0.5 size-2.5" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 rounded-full text-[10px] text-red-500 hover:bg-red-50"
                      onClick={() =>
                        onUpdateStatus({
                          bookingId: booking._id,
                          status: "cancelled",
                        })
                      }
                    >
                      <XCircle className="mr-0.5 size-2.5" />
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

/* ─── Orders ─── */
function OrdersTab({
  orders,
  onUpdateStatus,
}: {
  orders: any[] | undefined;
  onUpdateStatus: any;
}) {
  return (
    <div>
      <p className="text-[12px] text-[#888]">
        {orders?.length ?? 0} total orders
      </p>

      {orders === undefined ? (
        <div className="mt-3 py-6 text-center text-[12px] text-[#999]">
          Loading...
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-3 rounded-[12px] border border-border/50 bg-secondary/30 py-10 text-center">
          <ShoppingCart className="mx-auto size-7 text-[#666]/20" />
          <p className="mt-2 text-[12px] text-[#888]">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="rounded-[10px] border border-border/50 p-3.5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusConfig[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#888]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-1.5 flex gap-1">
                    {order.items.map((item: any, i: number) => (
                      <img
                        key={i}
                        src={item.imageUrl}
                        alt={item.name}
                        className="size-7 rounded-[4px] object-cover"
                        title={`${item.name} × ${item.quantity}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <p className="text-[14px] font-semibold">
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
                    className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px]"
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
