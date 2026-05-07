import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, BarChart3, TrendingUp, Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, MapPin, Info, Tag, X, Trophy, Users, Calendar, Medal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useBookings, formatHour, formatDate, useTurfs, Turf, useTournaments, Tournament } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { bookings, getTodayRevenue, getTotalBookings, getTotalRevenue, getMonthlyRevenueData } = useBookings();
  const { turfs, addTurf, updateTurf, deleteTurf } = useTurfs();
  
  // Turf Management State
  const [editingTurf, setEditingTurf] = useState<Partial<Turf> | null>(null);
  const [isTurfModalOpen, setIsTurfModalOpen] = useState(false);

  // Tournament Management State
  const { tournaments, addTournament, updateTournament, deleteTournament } = useTournaments();
  const [editingTourney, setEditingTourney] = useState<Partial<Tournament> | null>(null);
  const [isTourneyModalOpen, setIsTourneyModalOpen] = useState(false);
  const [viewingTeams, setViewingTeams] = useState<Tournament | null>(null);
  
  // All Bookings Table State
  const [bookingFilterTurf, setBookingFilterTurf] = useState("all");
  const [bookingFilterDate, setBookingFilterDate] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => b.status === "booked")
      .filter((b) => bookingFilterTurf === "all" || b.turfId === bookingFilterTurf)
      .filter((b) => !bookingFilterDate || b.date === bookingFilterDate)
      .filter((b) => 
        !bookingSearch || 
        b.name.toLowerCase().includes(bookingSearch.toLowerCase()) || 
        b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.phone.includes(bookingSearch)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.hour - a.hour);
  }, [bookings, bookingFilterTurf, bookingFilterDate, bookingSearch]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage bookings and view business analytics.</p>

      {/* Analytics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary" /> Today's Revenue
          </div>
          <p className="mt-2 text-3xl font-bold text-primary">₹{getTodayRevenue()}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" /> Total Income
          </div>
          <p className="mt-2 text-3xl font-bold text-primary">₹{getTotalRevenue()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" /> Total Bookings
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{getTotalBookings()}</p>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="mt-8 rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
          <BarChart3 className="h-5 w-5 text-primary" /> Monthly Revenue
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMonthlyRevenueData()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                cursor={{ fill: "var(--primary)", fillOpacity: 0.1 }}
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
                itemStyle={{ color: "var(--primary)" }}
                formatter={(value: number) => [`₹${value}`, "Revenue"]}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {getMonthlyRevenueData().map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue > 0 ? "var(--primary)" : "var(--muted)"}
                    fillOpacity={entry.revenue > 0 ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* All Bookings Table */}
      <div className="mt-12 mb-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">All Bookings</h2>
            <p className="text-sm text-muted-foreground">Detailed list of all customer bookings.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search name, code..."
                value={bookingSearch}
                onChange={(e) => { setBookingSearch(e.target.value); setCurrentPage(1); }}
                className="h-10 rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <select
              value={bookingFilterTurf}
              onChange={(e) => { setBookingFilterTurf(e.target.value); setCurrentPage(1); }}
              className="h-10 rounded-xl border border-border bg-card px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Turfs</option>
              {turfs.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={bookingFilterDate}
              onChange={(e) => { setBookingFilterDate(e.target.value); setCurrentPage(1); }}
              className="h-10 rounded-xl border border-border bg-card px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Booking Code</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Turf</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedBookings.length > 0 ? (
                  paginatedBookings.map((booking) => (
                    <motion.tr 
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono font-medium text-primary">
                        {booking.bookingCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{booking.name}</span>
                          <span className="text-xs text-muted-foreground">{booking.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {turfs.find(t => t.id === booking.turfId)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-foreground">{formatDate(booking.date)}</span>
                          <span className="text-xs text-muted-foreground">{formatHour(booking.hour)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        ₹{booking.amount}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No bookings found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="font-medium text-foreground">{filteredBookings.length}</span> bookings
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === page 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Turf Management Section */}
      <div className="mt-12 mb-20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Manage Turfs</h2>
            <p className="text-sm text-muted-foreground">Add, edit or remove turf locations.</p>
          </div>
          <button
            onClick={() => { setEditingTurf({}); setIsTurfModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add New Turf
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => (
            <motion.div
              key={turf.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={turf.imageUrl} alt={turf.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{turf.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {turf.address.split(',')[0]}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">₹{turf.pricePerHour}/hr</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setEditingTurf(turf); setIsTurfModalOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-xs font-medium text-foreground transition-all hover:bg-accent"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => { if(confirm("Are you sure you want to delete this turf?")) deleteTurf(turf.id); }}
                    className="flex items-center justify-center rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create/Update Turf Modal */}
      {isTurfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 overflow-y-auto" onClick={() => setIsTurfModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {editingTurf?.id ? "Update Turf" : "Create New Turf"}
              </h3>
              <button onClick={() => setIsTurfModalOpen(false)} className="rounded-full p-2 hover:bg-secondary">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                pricePerHour: Number(formData.get("pricePerHour")),
                address: formData.get("address") as string,
                imageUrl: formData.get("imageUrl") as string,
                location: formData.get("location") as string,
                features: (formData.get("features") as string).split(",").map(f => f.trim()),
                galleryImages: [formData.get("imageUrl") as string],
              };

              if (editingTurf?.id) {
                updateTurf(editingTurf.id, data);
              } else {
                addTurf(data);
              }
              setIsTurfModalOpen(false);
            }} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Turf Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editingTurf?.name}
                  placeholder="e.g. Dream Arena"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Price Per Hour (₹)
                </label>
                <input
                  name="pricePerHour"
                  type="number"
                  required
                  defaultValue={editingTurf?.pricePerHour}
                  placeholder="e.g. 1500"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Info className="h-3 w-3" /> Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingTurf?.description}
                  placeholder="Describe your turf..."
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Address
                </label>
                <input
                  name="address"
                  required
                  defaultValue={editingTurf?.address}
                  placeholder="Complete address..."
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                   Image URL
                </label>
                <input
                  name="imageUrl"
                  required
                  defaultValue={editingTurf?.imageUrl}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                   Coordinates
                </label>
                <input
                  name="location"
                  required
                  defaultValue={editingTurf?.location}
                  placeholder="12.9716, 77.5946"
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                   Features (comma separated)
                </label>
                <input
                  name="features"
                  required
                  defaultValue={editingTurf?.features?.join(", ")}
                  placeholder="Floodlights, Changing Room, etc."
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="pt-4 flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
                >
                  {editingTurf?.id ? "Save Changes" : "Create Turf"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTurfModalOpen(false)}
                  className="flex-1 rounded-xl bg-secondary py-3 text-sm font-bold text-foreground transition-all hover:bg-accent"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Tournament Management Section */}
      <div className="mt-12 mb-20">
        <div className="mb-6 flex items-center justify-between border-t border-border pt-12">
          <div>
            <h2 className="text-xl font-bold text-foreground">Manage Tournaments</h2>
            <p className="text-sm text-muted-foreground">Organize upcoming events and update past winners.</p>
          </div>
          <button
            onClick={() => { setEditingTourney({ type: 'upcoming', registeredTeams: [] }); setIsTourneyModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Tournament
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tourney) => (
            <motion.div
              key={tourney.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img src={tourney.imageUrl} alt={tourney.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${tourney.type === 'upcoming' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                    {tourney.type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{tourney.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" /> {tourney.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{tourney.prizePool}</p>
                    <p className="text-[10px] text-muted-foreground">Prize Pool</p>
                  </div>
                </div>

                {tourney.type === 'passed' && tourney.winners && (
                  <div className="mt-4 rounded-xl bg-secondary/50 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Medal className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="font-bold">{tourney.winners.first}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setEditingTourney(tourney); setIsTourneyModalOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-xs font-medium text-foreground transition-all hover:bg-accent"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => setViewingTeams(tourney)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/20"
                  >
                    <Users className="h-3.5 w-3.5" /> Teams ({tourney.registeredTeams?.length || 0})
                  </button>
                  <button
                    onClick={() => { if(confirm("Delete tournament?")) deleteTournament(tourney.id); }}
                    className="flex items-center justify-center rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tournament Modal */}
      {isTourneyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 overflow-y-auto" onClick={() => setIsTourneyModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">
                {editingTourney?.id ? "Update Tournament" : "New Tournament"}
              </h3>
              <button onClick={() => setIsTourneyModalOpen(false)} className="rounded-full p-2 hover:bg-secondary">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data: any = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                date: formData.get("date") as string,
                type: formData.get("type") as "upcoming" | "passed",
                entryFee: Number(formData.get("entryFee")),
                prizePool: formData.get("prizePool") as string,
                imageUrl: formData.get("imageUrl") as string,
                registeredTeams: editingTourney?.registeredTeams || [],
              };

              if (data.type === 'passed') {
                data.winners = {
                  first: formData.get("winner1") as string,
                  second: formData.get("winner2") as string,
                  third: formData.get("winner3") as string,
                };
              }

              if (editingTourney?.id) {
                updateTournament(editingTourney.id, data);
              } else {
                addTournament(data);
              }
              setIsTourneyModalOpen(false);
            }} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Tournament Name</label>
                <input name="name" required defaultValue={editingTourney?.name} placeholder="e.g. Summer Cup" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Type</label>
                <select name="type" required defaultValue={editingTourney?.type} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option value="upcoming">Upcoming</option>
                  <option value="passed">Passed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Date</label>
                <input name="date" type="date" required defaultValue={editingTourney?.date} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Prize Pool</label>
                <input name="prizePool" required defaultValue={editingTourney?.prizePool} placeholder="₹25,000" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea name="description" required rows={2} defaultValue={editingTourney?.description} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
                <input name="imageUrl" required defaultValue={editingTourney?.imageUrl} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Entry Fee (₹)</label>
                <input name="entryFee" type="number" required defaultValue={editingTourney?.entryFee} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>

              {/* Champions Section - only if passed */}
              <div className="sm:col-span-2 border-t border-border pt-4 mt-2">
                <h4 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Trophy className="h-4 w-4 text-yellow-500" /> Champions (For Passed Tournaments)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">1st Place</label>
                    <input name="winner1" defaultValue={editingTourney?.winners?.first} placeholder="Team Name" className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">2nd Place</label>
                    <input name="winner2" defaultValue={editingTourney?.winners?.second} placeholder="Team Name" className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">3rd Place</label>
                    <input name="winner3" defaultValue={editingTourney?.winners?.third} placeholder="Team Name" className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 sm:col-span-2">
                <button type="submit" className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95">
                  Save Tournament
                </button>
                <button type="button" onClick={() => setIsTourneyModalOpen(false)} className="flex-1 rounded-xl bg-secondary py-3 text-sm font-bold text-foreground transition-all hover:bg-accent">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Registered Teams Viewer */}
      {viewingTeams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4" onClick={() => setViewingTeams(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{viewingTeams.name}</h3>
                <p className="text-xs text-muted-foreground">Registered Teams List</p>
              </div>
              <button onClick={() => setViewingTeams(null)} className="rounded-full p-2 hover:bg-secondary">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {viewingTeams.registeredTeams && viewingTeams.registeredTeams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {viewingTeams.registeredTeams.map((team) => (
                    <div key={team.id} className="p-4 rounded-2xl border border-border bg-secondary/30">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-primary">{team.name}</h4>
                        <span className="text-[10px] text-muted-foreground">{new Date(team.registeredAt).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /> {team.captain}</p>
                        <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {team.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No teams registered yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}