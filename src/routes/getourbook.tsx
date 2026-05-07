import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, Calendar, Clock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import { useBookings, formatHour, formatDate, useTurfs } from "@/lib/store";
import { useRef } from "react";
import { domToCanvas } from "modern-screenshot";
import jsPDF from "jspdf";

export const Route = createFileRoute("/getourbook")({
  component: TicketsPage,
});

function TicketsPage() {
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const { getBookingByCode } = useBookings();
  const { turfs } = useTurfs();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const bookings = getBookingByCode(searchCode);
  const turf = bookings.length > 0 ? turfs.find(t => t.id === bookings[0].turfId) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCode(code.trim().toUpperCase());
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await domToCanvas(ticketRef.current, {
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
      pdf.save(`TurfZone-Booking-${searchCode}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Ticket className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Track Your <span className="text-primary">Booking</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Enter your unique booking code below to view your reservation details and ticket information.
        </p>
      </motion.section>

      <section className="mb-12 max-w-lg mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code (e.g. TPH-ABCD12)"
            className="w-full rounded-xl border-2 border-border bg-card px-5 py-2.5 pr-14 text-base font-normal tracking-widest text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 group-hover:border-primary/50 font-sans"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </section>

      <AnimatePresence mode="wait">
        {searchCode && bookings.length === 0 && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center p-12 rounded-3xl border-2 border-dashed border-border bg-card/50"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground">No Booking Found</h3>
            <p className="text-muted-foreground mt-2">We couldn't find any booking with code <span className="font-mono font-bold text-foreground">{searchCode}</span>. Please double-check your code.</p>
          </motion.div>
        )}

        {bookings.length > 0 && turf && (
          <motion.div
            key="found"
            ref={ticketRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/50"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img src={turf.imageUrl} alt={turf.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmed Booking</span>
                </div>
                <h2 className="text-3xl font-black text-white">{turf.name}</h2>
              </div>
              <div className="absolute top-6 right-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-3 text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-xl font-black text-white">₹{bookings.reduce((sum, b) => sum + b.amount, 0)}</p>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Booking Details
                  </h4>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-foreground">{formatDate(bookings[0].date)}</p>
                    <div className="flex flex-wrap gap-2">
                      {bookings.map((b) => (
                        <span key={b.id} className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-semibold text-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3 text-primary" /> {formatHour(b.hour)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Location
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">{turf.address}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-primary" /> Customer Info
                  </h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">{bookings[0].name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" /> {bookings[0].phone}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Transaction ID</p>
                  <p className="text-sm font-mono font-bold text-foreground truncate">{bookings[0].id}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Booking Code</p>
                <p className="text-2xl font-black text-foreground tracking-widest">{searchCode}</p>
              </div>
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                data-html2canvas-ignore
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-bold text-foreground transition-all disabled:opacity-50"
              >
                {isDownloading ? "Generating..." : "Download Ticket"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
