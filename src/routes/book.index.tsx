import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TurfCard } from "@/components/TurfCard";
import { useTurfs } from "@/lib/store";

export const Route = createFileRoute("/book/")({
  component: BookPage,
});

function BookPage() {
  const { turfs } = useTurfs();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          <span className="text-primary">Book</span> Your Turf
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Find and reserve the best turfs in your area for your next game.
        </p>
      </motion.section>
      
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {turfs.map((turf, i) => (
          <TurfCard key={turf.id} turf={turf} index={i} />
        ))}
      </section>
    </main>
  );
}
