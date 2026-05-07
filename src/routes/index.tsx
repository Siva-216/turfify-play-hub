import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TurfCard } from "@/components/TurfCard";
import { useTurfs } from "@/lib/store";
import { MapPin, Trophy, Clock, Zap, Shield, Users, ArrowRight, Play, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { turfs } = useTurfs();
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/turf-a.png" // Using one of our high-quality turf images as background
            className="h-full w-full object-cover brightness-[0.35] scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-32 pb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 fill-current" /> Next Gen Booking
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              PLAY <span className="text-primary italic">HARDER.</span> <br />
              BOOK <span className="text-primary italic">SMARTER.</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
              Experience football and cricket like never before. Premium venues, professional floodlights, and the fastest booking system in the city.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-black text-primary-foreground transition-all hover:scale-105 hover:brightness-110 shadow-xl shadow-primary/20"
              >
                BOOK YOUR SLOT <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10">
                <Play className="h-4 w-4 fill-current" /> WATCH TOUR
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-10 w-6 rounded-full border-2 border-white/30 flex justify-center p-1"
          >
            <div className="h-2 w-1 rounded-full bg-white/50" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto -mt-20 relative z-20 max-w-5xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Active Players", value: "10k+" },
            { icon: MapPin, label: "Premium Venues", value: "3+" },
            { icon: Trophy, label: "Tournaments", value: "50+" },
            { icon: Clock, label: "Booking Speed", value: "30s" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl shadow-xl"
            >
              <stat.icon className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Turfs Section */}
      <section className="mx-auto max-w-6xl px-4 py-32">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            TOP RATED <span className="text-primary">VENUES</span>
          </h2>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-primary" />
          <p className="mt-6 max-w-xl text-muted-foreground">
            Hand-picked arenas with the best synthetic grass, professional lighting, and world-class amenities.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf, i) => (
            <TurfCard key={turf.id} turf={turf} index={i} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            View all available venues <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary/30 py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                WHY PLAY AT <br />
                <span className="text-primary underline decoration-primary/30 underline-offset-8">TURFZONE?</span>
              </h2>
              <div className="mt-12 space-y-8">
                {[
                  {
                    icon: Shield,
                    title: "Professional Grade Grass",
                    desc: "All our turfs use FIFA-approved synthetic grass for maximum performance and injury prevention.",
                  },
                  {
                    icon: Clock,
                    title: "24/7 Availability",
                    desc: "Whether it's a 6 AM workout or a midnight showdown, we are open whenever you want to play.",
                  },
                  {
                    icon: Users,
                    title: "Community & Events",
                    desc: "Join our weekend tournaments and meet other passionate players in your community.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-5"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square overflow-hidden rounded-3xl border-8 border-border/50 shadow-2xl"
              >
                <img
                  src="/images/turf-a-2.png"
                  alt="Action Shot"
                  className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-primary/20 backdrop-blur-xl -z-10" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-2xl border-2 border-primary/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-black text-foreground">PLAYER <span className="text-primary">REVIEWS</span></h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Suresh Kumar", role: "Captain, FC Titans", review: "The booking process is seamless. Turf A is easily the best synthetic grass in the city!" },
            { name: "Rahul Verma", role: "Weekend Warrior", review: "Great floodlights and very well maintained. The app makes it so easy to split bills." },
            { name: "Ananya Singh", role: "Futsal Pro", review: "Love the atmosphere here. The changing rooms are clean and the staff is very professional." },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-8 shadow-lg">
              <div className="flex gap-1 mb-4 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-sm italic text-muted-foreground leading-relaxed">"{t.review}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-32 mb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center text-primary-foreground md:p-24 shadow-2xl shadow-primary/40">
          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight sm:text-6xl">
              READY TO CLAIM <br />
              YOUR VICTORY?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-primary-foreground/80">
              Join thousands of players who book their slots every day. Your perfect match is just one click away.
            </p>
            <Link
              to="/book"
              className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-black text-primary shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              BOOK NOW <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
          {/* Abstract patterns */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-primary fill-current" />
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">TurfZone</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Providing premium sports venues and seamless booking experiences since 2024. Play anytime, anywhere.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link to="/" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">HOME</Link>
            <Link to="/book" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">BOOK</Link>
            <Link to="/tournaments" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">TOURNAMENTS</Link>
            <Link to="/tickets" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">TICKETS</Link>
          </div>
          <div className="mt-12 text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
            © 2026 TURFZONE MEDIA GROUP. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </main>
  );
}
