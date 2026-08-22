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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${config.color}`}
    >
      <Icon className="size-3" />
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

      <main className="mx-auto max-w-[1360px] px-6 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c96b8b]">
            My Account
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Welcome{(user as any)?.name ? `, ${(user as any).name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-[#666]">
            Manage your orders, bookings, and account details.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            {
              label: "Total Orders",
              value: stats?.orderCount ?? 0,
              icon: Package,
            },
            {
              label: "Total Spent",
              value: formatPrice(stats?.totalSpent ?? 0),
              icon: CreditCard,
            },
            {
              label: "Appointments",
              value: stats?.bookingCount ?? 0,
              icon: Calendar,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-[12px] border border-[#c96b8b]/10 bg-[#fce4ec]/20 p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-white">
                <stat.icon className="size-4.5 text-[#c96b8b]" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#666]">
                  {stat.label}
                </p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Orders */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="font-display text-lg font-semibold">Order History</h2>
            {orders === undefined ? (
              <div className="mt-4 py-8 text-center text-sm text-[#666]">
                Loading...
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-4 rounded-[12px] border border-border/50 bg-secondary/30 py-12 text-center">
                <Package className="mx-auto size-8 text-[#666]/30" />
                <p className="mt-3 text-sm text-[#666]">No orders yet</p>
                <p className="mt-1 text-xs text-[#999]">
                  Your order history will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-[12px] border border-border/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#666]">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                        <p className="mt-0.5 text-sm font-medium">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(order.total)}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {order.items.map((item, i) => (
                        <img
                          key={i}
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-10 shrink-0 rounded-[6px] object-cover"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="font-display text-lg font-semibold">Salon Appointments</h2>
            {bookings === undefined ? (
              <div className="mt-4 py-8 text-center text-sm text-[#666]">
                Loading...
              </div>
            ) : bookings.length === 0 ? (
              <div className="mt-4 rounded-[12px] border border-border/50 bg-secondary/30 py-12 text-center">
                <Calendar className="mx-auto size-8 text-[#666]/30" />
                <p className="mt-3 text-sm text-[#666]">No appointments yet</p>
                <p className="mt-1 text-xs text-[#999]">
                  Book your first salon appointment to get started.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-[12px] border border-border/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {booking.service}
                        </p>
                        <p className="mt-0.5 text-xs text-[#666]">
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
