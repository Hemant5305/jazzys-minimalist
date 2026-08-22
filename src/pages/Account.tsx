import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: "text-amber-600 bg-amber-50", icon: Clock },
  processing: { color: "text-blue-600 bg-blue-50", icon: Package },
  shipped: { color: "text-purple-600 bg-purple-50", icon: Truck },
  delivered: { color: "text-green-600 bg-green-50", icon: CheckCircle2 },
  cancelled: { color: "text-red-600 bg-red-50", icon: XCircle },
  confirmed: { color: "text-green-600 bg-green-50", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${config.color}`}
    >
      <Icon className="size-2.5" />
      {status}
    </span>
  );
}

export default function Account() {
  const { user } = useAuth();
  const userId = (user as any)?._id;

  const orders = useQuery(
    api.orders.getUserOrders,
    userId ? { userId } : "skip",
  );
  const bookings = useQuery(
    api.bookings.getUserBookings,
    userId ? { userId } : "skip",
  );
  const stats = useQuery(
    api.users.getUserStats,
    userId ? { userId } : "skip",
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={0} />

      <main className="mx-auto max-w-[900px] px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c96b8b]">
            My Account
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Welcome{(user as any)?.name ? `, ${(user as any).name}` : ""}
          </h1>
          <p className="mt-1 text-[13px] text-[#666]">
            Your orders, appointments, and spending — all in one view.
          </p>
        </motion.div>

        {/* Stats — horizontal row, not a uniform grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mt-5 flex gap-3 overflow-x-auto"
        >
          {[
            { label: "Orders", value: stats?.orderCount ?? 0, icon: Package },
            { label: "Spent", value: formatPrice(stats?.totalSpent ?? 0), icon: CreditCard },
            { label: "Bookings", value: stats?.bookingCount ?? 0, icon: Calendar },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-[140px] items-center gap-3 rounded-[12px] border border-border/50 p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fce4ec]/50">
                <stat.icon className="size-3.5 text-[#c96b8b]" />
              </div>
              <div>
                <p className="text-[10px] text-[#999]">{stat.label}</p>
                <p className="text-[15px] font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          {/* Orders */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <h2 className="text-[15px] font-medium">Order History</h2>
            {orders === undefined ? (
              <div className="mt-3 py-6 text-center text-[12px] text-[#999]">
                Loading...
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-3 rounded-[12px] border border-border/50 bg-secondary/30 py-10 text-center">
                <Package className="mx-auto size-7 text-[#666]/20" />
                <p className="mt-2 text-[13px] text-[#666]">No orders yet</p>
                <p className="mt-0.5 text-[11px] text-[#999]">
                  Your purchase history will show up here.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-[10px] border border-border/50 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#999]">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </p>
                        <p className="mt-0.5 text-[13px] font-medium">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold">
                          {formatPrice(order.total)}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1.5 overflow-x-auto">
                      {order.items.map((item, i) => (
                        <img
                          key={i}
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-8 shrink-0 rounded-[4px] object-cover"
                          title={`${item.name} × ${item.quantity}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <h2 className="text-[15px] font-medium">Salon Appointments</h2>
            {bookings === undefined ? (
              <div className="mt-3 py-6 text-center text-[12px] text-[#999]">
                Loading...
              </div>
            ) : bookings.length === 0 ? (
              <div className="mt-3 rounded-[12px] border border-border/50 bg-secondary/30 py-10 text-center">
                <Calendar className="mx-auto size-7 text-[#666]/20" />
                <p className="mt-2 text-[13px] text-[#666]">No appointments yet</p>
                <p className="mt-0.5 text-[11px] text-[#999]">
                  Book your first salon visit to get started.
                </p>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2.5">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-[10px] border border-border/50 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium">
                          {booking.service}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#888]">
                          {new Date(booking.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {booking.time}
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
