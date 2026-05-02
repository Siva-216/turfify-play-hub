import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Check, User, Phone, Mail } from "lucide-react";
import { TURFS, useBookings, formatDate, formatHour } from "@/lib/store";
import { SlotPicker } from "@/components/SlotPicker";

export const Route = createFileRoute("/book/$turfId")({
  component: BookPage,
});

function BookPage() {
  const { turfId } = Route.useParams();
  const navigate = useNavigate();
  const turf = TURFS.find((t) => t.id === turfId);
  const { addBooking, getSlotStatus } = useBookings();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [step, setStep] = useState<"slots" | "contact" | "done">("slots");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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

  if (!turf) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Turf not found.</p>
      </div>
    );
  }

  const total = selectedSlots.length * turf.pricePerHour;

  const toggleSlot = (hour: number) => {
    setSelectedSlots((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  const handleConfirm = () => {
    selectedSlots.forEach((hour) => {
      addBooking({
        turfId: turf.id,
        date: selectedDate,
        hour,
        name,
        phone,
        email,
        status: "booked",
        amount: turf.pricePerHour,
      });
    });
    setStep("done");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Turfs
      </Link>

      <h1 className="text-2xl font-bold text-foreground">{turf.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">₹{turf.pricePerHour}/hr · {turf.features.join(" · ")}</p>

      <AnimatePresence mode="wait">
        {step === "slots" && (
          <motion.div key="slots" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="mt-8">
            <div className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-primary" /> Select Date
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlots([]); }}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
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

            <h2 className="mb-3 text-sm font-semibold text-foreground">Select Time Slots</h2>
            <SlotPicker
              turfId={turf.id}
              date={selectedDate}
              selectedSlots={selectedSlots}
              getSlotStatus={getSlotStatus}
              onToggle={toggleSlot}
            />

            {selectedSlots.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{selectedSlots.length} slot(s) selected</p>
                  <p className="text-xl font-bold text-primary">₹{total}</p>
                </div>
                <button onClick={() => setStep("contact")} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95">
                  Continue
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="mt-8">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Contact Details</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground"><User className="h-3 w-3" /> Full Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="John Doe" />
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> Phone</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="+91 98765 43210" />
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="john@email.com" />
              </label>
            </div>

            <div className="mt-6 rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted-foreground">Summary</p>
              <p className="font-semibold text-foreground">{turf.name} · {formatDate(selectedDate)}</p>
              <p className="text-sm text-muted-foreground">{selectedSlots.map(formatHour).join(", ")}</p>
              <p className="mt-1 text-lg font-bold text-primary">₹{total}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep("slots")} className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary">
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={!name || !phone}
                className="flex-1 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Booking Confirmed!</h2>
            <p className="mt-2 text-muted-foreground">
              {turf.name} · {formatDate(selectedDate)} · {selectedSlots.map(formatHour).join(", ")}
            </p>
            <p className="mt-1 text-xl font-bold text-primary">₹{total}</p>
            <Link to="/" className="mt-8 inline-block rounded-xl bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent">
              Back to Home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}