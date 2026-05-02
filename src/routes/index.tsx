import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TurfCard } from "@/components/TurfCard";
import { TURFS } from "@/lib/store";
import { MapPin, Trophy, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Book Your <span className="text-primary">Game</span> Today
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Premium turfs with floodlights, synthetic grass, and instant online booking. Pick your slot, show up, and play.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> 3 Premium Turfs
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> 6 AM – 12 AM
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> Instant Booking
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TURFS.map((turf, i) => (
          <TurfCard key={turf.id} turf={turf} index={i} />
        ))}
      </section>
    </main>
  );
}
