import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Turf } from "@/lib/store";

export function TurfCard({ turf, index }: { turf: Turf; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/20"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-primary/20">{turf.name.split(" ")[1]}</span>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
          <Star className="h-3 w-3" /> Premium
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground">{turf.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{turf.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {turf.features.map((f) => (
            <span key={f} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary">
            <Clock className="h-4 w-4" />
            <span className="text-lg font-bold">₹{turf.pricePerHour}</span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
          <Link
            to="/book/$turfId"
            params={{ turfId: turf.id }}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}