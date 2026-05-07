import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Check, User, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useBookings, formatDate, formatHour, useTurfs } from "@/lib/store";
import { SlotPicker } from "@/components/SlotPicker";
import { useRef } from "react";
import { domToCanvas } from "modern-screenshot";
import jsPDF from "jspdf";

// MUI Imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";

export const Route = createFileRoute("/book/$turfId")({
  component: BookPage,
});

// Create a dark theme for MUI components to match the app
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10b981", // Matching the Emerald primary color
    },
    background: {
      paper: "#09090b", // Matching the bg-card/bg-surface
      default: "#020617",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

function BookPage() {
  const { turfId } = Route.useParams();
  const navigate = useNavigate();
  const { turfs } = useTurfs();
  const turf = turfs.find((t) => t.id === turfId);
  const { addBooking, getSlotStatus } = useBookings();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [step, setStep] = useState<"slots" | "contact" | "done">("slots");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [bookingCode, setBookingCode] = useState("");
  const formattedDate = selectedDate?.format("YYYY-MM-DD") || "";
  const successRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    if (!selectedDate) return;
    
    const code = `TPH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setBookingCode(code);

    selectedSlots.forEach((hour) => {
      addBooking({
        turfId: turf.id,
        date: formattedDate,
        hour,
        name,
        phone,
        email,
        status: "booked",
        amount: turf.pricePerHour,
      }, code);
    });
    setStep("done");
  };

  const handleDownloadPDF = async () => {
    if (!successRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await domToCanvas(successRef.current, {
        scale: 2,
        backgroundColor: "#020617",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`TurfZone-Booking-${bookingCode}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Link to="/book" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Booking
          </Link>

          <AnimatePresence mode="wait">
            {step === "slots" && (
              <motion.div
                key="slots"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Gallery Section */}
                <section>
                  <div className="relative mb-4 h-64 w-full overflow-hidden rounded-2xl border border-border shadow-lg md:h-96">
                    <img
                      src={turf.imageUrl}
                      alt={turf.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <h1 className="text-3xl font-bold text-white">{turf.name}</h1>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {turf.galleryImages.slice(1).map((img, i) => (
                      <div key={i} className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                        <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Turf Information Section */}
                <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-foreground">Turf Information</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Address</p>
                        <p className="text-sm font-semibold text-foreground leading-snug">{turf.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Price</p>
                        <p className="text-sm font-semibold text-foreground">₹{turf.pricePerHour}/hour</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Type</p>
                        <p className="text-sm font-semibold text-foreground">{turf.features[1] || "Premium Turf"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Location</p>
                        <p className="text-sm font-semibold text-foreground">{turf.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground">{turf.description}</p>
                  </div>
                </section>

                {/* Calendar & Slots Section */}
                <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  <div className="grid md:grid-cols-2">
                    <div className="border-r border-border p-6 bg-card">
                      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        Select Date
                      </h2>
                      <div className="mui-calendar-wrapper rounded-xl overflow-hidden border border-border/50">
                        <StaticDatePicker
                          displayStaticWrapperAs="desktop"
                          value={selectedDate}
                          onChange={(newValue) => {
                            setSelectedDate(newValue);
                            setSelectedSlots([]);
                          }}
                          slotProps={{
                            actionBar: { actions: [] },
                            toolbar: { hidden: true },
                          }}
                          minDate={dayjs()}
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-surface">
                      <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">
                        Available Time Slots for {selectedDate?.format("MMM D, YYYY")}
                      </h3>
                      <SlotPicker
                        turfId={turf.id}
                        date={formattedDate}
                        selectedSlots={selectedSlots}
                        getSlotStatus={getSlotStatus}
                        onToggle={toggleSlot}
                      />

                      {selectedSlots.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 space-y-4"
                        >
                          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Amount</p>
                              <p className="text-2xl font-black text-primary">₹{total}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Slots</p>
                              <p className="text-sm font-bold text-foreground">{selectedSlots.length} Selected</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setStep("contact")}
                            className="w-full rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95 shadow-xl shadow-primary/20"
                          >
                            Continue to Finalize
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {step === "contact" && (
              <motion.div key="contact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-xl mx-auto mt-8">
                <h2 className="mb-6 text-2xl font-bold text-foreground text-center">Finalize Booking</h2>
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"><User className="h-3.5 w-3.5" /> Full Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter your full name" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"><Phone className="h-3.5 w-3.5" /> Phone Number</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="+91 98765 43210" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"><Mail className="h-3.5 w-3.5" /> Email Address</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="your@email.com" />
                  </label>
                </div>

                <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Booking Summary</p>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-foreground">{turf.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" /> {selectedDate?.format("MMMM D, YYYY")}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" /> {selectedSlots.map(formatHour).join(", ")}
                    </div>
                    <p className="mt-4 text-2xl font-black text-primary">₹{total}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button onClick={() => setStep("slots")} className="rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-secondary">
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!name || !phone}
                    className="flex-1 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                  >
                    Confirm & Book Now
                  </button>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" ref={successRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-16 text-center bg-background p-8 rounded-3xl border border-border">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 shadow-xl shadow-primary/10">
                   <Check className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Booking Confirmed!</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  You're all set for <span className="text-foreground font-bold">{turf.name}</span>
                </p>

                <div className="mt-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 max-w-sm mx-auto">
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Unique Booking Code</p>
                  <p className="text-4xl font-black text-foreground tracking-widest">{bookingCode}</p>
                  <p className="mt-4 text-xs text-muted-foreground">Save this code to view your booking details later on the "My Booking" page.</p>
                </div>

                <div className="mt-8 text-muted-foreground">
                  {selectedDate?.format("MMMM D, YYYY")} · {selectedSlots.map(formatHour).join(", ")}
                </div>
                <p className="mt-2 text-2xl font-black text-primary">₹{total}</p>
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center" data-html2canvas-ignore>
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="inline-block rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    {isDownloading ? "Generating PDF..." : "Download PDF Ticket"}
                  </button>
                  <Link to="/getourbook" className="inline-block rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-accent">
                    Track Booking
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </LocalizationProvider>
    </ThemeProvider>
  );
}