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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/20"
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        <img
          src={turf.imageUrl}
          alt={turf.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
          <Star className="h-3 w-3" /> Premium
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
            {turf.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {turf.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {turf.features.map((f) => (
              <span key={f} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {f}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1 text-primary mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-lg font-bold">₹{turf.pricePerHour}</span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
          <Link
            to="/book/$turfId"
            params={{ turfId: turf.id }}
            className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}