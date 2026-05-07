import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, Users, Medal, X, Check, ArrowRight, Wallet } from "lucide-react";
import { useTournaments, Tournament } from "@/lib/store";

export const Route = createFileRoute("/tournaments")({
  component: TournamentsPage,
});

function TournamentsPage() {
  const { tournaments, registerTeam } = useTournaments();
  const [selectedTourney, setSelectedTourney] = useState<Tournament | null>(null);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const upcoming = tournaments.filter(t => t.type === "upcoming");
  const passed = tournaments.filter(t => t.type === "passed");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTourney) return;

    const formData = new FormData(e.currentTarget);
    const teamData = {
      name: formData.get("teamName") as string,
      captain: formData.get("captain") as string,
      phone: formData.get("phone") as string,
    };

    registerTeam(selectedTourney.id, teamData);
    
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegForm(false);
      setSelectedTourney(null);
    }, 2500);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          TurfZone <span className="text-primary">Tournaments</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Compete with the best teams in the city. Register for upcoming events or check out past champions.
        </p>
      </motion.section>

      {/* Upcoming Tournaments */}
      <section className="mb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Upcoming Events
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={t.imageUrl} alt={t.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                  ₹{t.entryFee} Entry
                </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="mb-2 text-2xl font-bold text-foreground">{t.name}</h3>
                <p className="mb-6 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="flex items-center justify-between border-t border-border pt-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Prize Pool</p>
                    <p className="text-xl font-black text-primary">{t.prizePool}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTourney(t);
                      setShowRegForm(true);
                    }}
                    className="relative z-20 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
                  >
                    Register Team <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Passed Tournaments */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Medal className="h-6 w-6 text-primary" /> Past Champions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Celebrating the winners of our previous leagues.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {passed.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card/50 p-6 transition-all hover:bg-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-foreground text-lg">{t.name}</h3>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.date}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-3 border border-primary/20">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">1</div>
                  <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Winner</p>
                    <p className="font-bold text-foreground">{t.winners?.first}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3 border border-border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground font-black">2</div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Runner Up</p>
                    <p className="font-bold text-foreground">{t.winners?.second}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3 border border-border/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground font-black">3</div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Third Place</p>
                    <p className="font-bold text-foreground">{t.winners?.third}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegForm && selectedTourney && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !regSuccess && setShowRegForm(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[110] w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              {regSuccess ? (
                <div className="p-12 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Registration Successful!</h3>
                  <p className="mt-2 text-muted-foreground">Your team has been registered for {selectedTourney.name}. See you on the field!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-border p-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Team Registration</h3>
                      <p className="text-xs text-muted-foreground">{selectedTourney.name}</p>
                    </div>
                    <button onClick={() => setShowRegForm(false)} className="rounded-lg p-2 hover:bg-secondary">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleRegister} className="p-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-widest">Team Name</span>
                        <input name="teamName" required className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:border-primary outline-none" placeholder="Enter team name" />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-widest">Captain Name</span>
                        <input name="captain" required className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:border-primary outline-none" placeholder="Full name" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone Number</span>
                      <input name="phone" required className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:border-primary outline-none" placeholder="+91 98765 43210" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</span>
                      <input name="email" required type="email" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:border-primary outline-none" placeholder="team@example.com" />
                    </label>
                    
                    <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20 mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-foreground flex items-center gap-2"><Wallet className="h-4 w-4" /> Entry Fee</span>
                        <span className="text-lg font-black text-primary">₹{selectedTourney.entryFee}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">By clicking register, you agree to our tournament rules and regulations. Payment will be collected at the venue or via link.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/20 mt-4"
                    >
                      Complete Registration
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
