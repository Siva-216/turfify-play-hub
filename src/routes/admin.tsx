import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, BarChart3, Wrench, PhoneCall, X } from "lucide-react";
import { TURFS, HOURS, useBookings, formatHour, formatDate } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { bookings, addBooking, removeBooking, getSlotStatus, getTodayRevenue, getTotalBookings } = useBookings();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [blockModal, setBlockModal] = useState<{ turfId: string; hour: number } | null>(null);

  const dates = useMemo(() => {
    const arr: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  }, []);

  const handleBlock = (status: "maintenance" | "phone-booking") => {
    if (!blockModal) return;
    const turf = TURFS.find((t) => t.id === blockModal.turfId);
    addBooking({
      turfId: blockModal.turfId,
      date: selectedDate,
      hour: blockModal.hour,
      name: status === "maintenance" ? "Maintenance" : "Phone Booking",
      phone: "",
      email: "",
      status,
      amount: turf?.pricePerHour ?? 0,
    });
    setBlockModal(null);
  };

  const handleUnblock = (turfId: string, hour: number) => {
    const booking = bookings.find(
      (b) => b.turfId === turfId && b.date === selectedDate && b.hour === hour && (b.status === "maintenance" || b.status === "phone-booking")
    );
    if (booking) removeBooking(booking.id);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage slots, block times, and view analytics.</p>

      {/* Analytics */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" /> Today's Revenue
          </div>
          <p className="mt-2 text-3xl font-bold text-primary">₹{getTodayRevenue()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" /> Total Bookings
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{getTotalBookings()}</p>
        </motion.div>
      </div>

      {/* Date selector */}
      <div className="mt-8 mb-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Calendar className="h-4 w-4 text-primary" /> Daily Grid
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                d === selectedDate
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {formatDate(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
              {TURFS.map((t) => (
                <th key={t.id} className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">{t.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => (
              <tr key={hour} className="border-b border-border/50 last:border-0">
                <td className="px-3 py-2 text-xs font-medium text-muted-foreground">{formatHour(hour)}</td>
                {TURFS.map((turf) => {
                  const status = getSlotStatus(turf.id, selectedDate, hour);
                  let cellClass = "px-3 py-2 text-center ";
                  let label = "";
                  let clickable = true;

                  if (status === "booked") {
                    cellClass += "text-xs font-medium";
                    label = "Booked";
                    clickable = false;
                  } else if (status === "maintenance") {
                    label = "🔧 Maint.";
                  } else if (status === "phone-booking") {
                    label = "📞 Phone";
                  } else {
                    label = "—";
                  }

                  const isAdminBlocked = status === "maintenance" || status === "phone-booking";

                  return (
                    <td key={turf.id} className={cellClass}>
                      {status === "booked" ? (
                        <span className="inline-block rounded-md bg-primary/20 px-2 py-1 text-xs font-semibold text-primary">Booked</span>
                      ) : isAdminBlocked ? (
                        <button
                          onClick={() => handleUnblock(turf.id, hour)}
                          className="inline-flex items-center gap-1 rounded-md bg-maintenance/20 px-2 py-1 text-xs font-medium text-maintenance hover:bg-destructive/20 hover:text-destructive"
                          title="Click to unblock"
                        >
                          {label} <X className="h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setBlockModal({ turfId: turf.id, hour })}
                          className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {label}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Block Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setBlockModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-foreground">Block Slot</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {TURFS.find((t) => t.id === blockModal.turfId)?.name} · {formatDate(selectedDate)} · {formatHour(blockModal.hour)}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => handleBlock("maintenance")}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-maintenance hover:bg-maintenance/10"
              >
                <Wrench className="h-4 w-4 text-maintenance" /> Maintenance
              </button>
              <button
                onClick={() => handleBlock("phone-booking")}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/10"
              >
                <PhoneCall className="h-4 w-4 text-primary" /> Phone Booking
              </button>
            </div>
            <button onClick={() => setBlockModal(null)} className="mt-4 w-full rounded-xl bg-secondary py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}