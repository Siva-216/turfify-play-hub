import { useState, useEffect, useCallback } from "react";

export interface Turf {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  features: string[];
  imageUrl: string;
  galleryImages: string[];
  location: string;
  address: string;
}

const INITIAL_TURFS: Turf[] = [
  {
    id: "turf-a",
    name: "Elite Turf A",
    description: "Premium 5-a-side pitch with floodlights and synthetic grass.",
    pricePerHour: 1200,
    features: ["Floodlights", "Synthetic Grass", "Changing Room"],
    imageUrl: "/images/turf-a.png",
    galleryImages: ["/images/turf-a.png", "/images/turf-a-1.png", "/images/turf-a-2.png"],
    location: "12.9716, 77.5946",
    address: "MG Road, Bangalore, Karnataka",
  },
  {
    id: "turf-b",
    name: "Champions Arena B",
    description: "Full-size 7-a-side arena with professional markings.",
    pricePerHour: 1800,
    features: ["7-a-side", "Scoreboard", "Dugout Seating"],
    imageUrl: "/images/turf-b.png",
    galleryImages: ["/images/turf-b.png"],
    location: "12.9279, 77.6271",
    address: "Koramangala 4th Block, Bangalore",
  },
  {
    id: "turf-c",
    name: "Victory Court C",
    description: "Indoor court for futsal and cricket nets. All-weather play.",
    pricePerHour: 1500,
    features: ["Indoor", "All-Weather", "Cricket Nets"],
    imageUrl: "/images/turf-c.png",
    galleryImages: ["/images/turf-c.png"],
    location: "12.9063, 77.5857",
    address: "JP Nagar 2nd Phase, Bangalore",
  },
];

const TURFS_STORAGE_KEY = "turf-data";

export function useTurfs() {
  const [turfs, setTurfs] = useState<Turf[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(TURFS_STORAGE_KEY);
    if (raw) {
      setTurfs(JSON.parse(raw));
    } else {
      setTurfs(INITIAL_TURFS);
      localStorage.setItem(TURFS_STORAGE_KEY, JSON.stringify(INITIAL_TURFS));
    }
  }, []);

  const saveTurfs = (updated: Turf[]) => {
    setTurfs(updated);
    localStorage.setItem(TURFS_STORAGE_KEY, JSON.stringify(updated));
  };

  const addTurf = (turf: Omit<Turf, "id">) => {
    const newTurf = { ...turf, id: crypto.randomUUID() };
    saveTurfs([...turfs, newTurf]);
    return newTurf;
  };

  const updateTurf = (id: string, updates: Partial<Turf>) => {
    saveTurfs(turfs.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTurf = (id: string) => {
    saveTurfs(turfs.filter(t => t.id !== id));
  };

  return { turfs, addTurf, updateTurf, deleteTurf };
}

// Keep a static export for initial load or as fallback if needed, but components should use useTurfs()
export const TURFS = INITIAL_TURFS;

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  type: "upcoming" | "passed";
  entryFee: number;
  prizePool: string;
  imageUrl: string;
  winners?: {
    first: string;
    second: string;
    third: string;
  };
  registeredTeams?: {
    id: string;
    name: string;
    captain: string;
    phone: string;
    registeredAt: string;
  }[];
}

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: "tourney-1",
    name: "Summer Sizzler 5v5",
    description: "The ultimate 5v5 showdown under the summer sun. Winner takes all!",
    date: "2026-06-15",
    type: "upcoming",
    entryFee: 1500,
    prizePool: "₹25,000",
    imageUrl: "/images/tourney-1.png",
  },
  {
    id: "tourney-2",
    name: "Midnight Futsal League",
    description: "Late night action for the true ballers. Fast-paced and intense.",
    date: "2026-07-02",
    type: "upcoming",
    entryFee: 1000,
    prizePool: "₹15,000",
    imageUrl: "/images/tourney-2.png",
  },
  {
    id: "tourney-3",
    name: "Spring Cup 2026",
    description: "Annual spring tournament featuring teams from all over Bangalore.",
    date: "2026-04-10",
    type: "passed",
    entryFee: 1200,
    prizePool: "₹20,000",
    imageUrl: "/images/tourney-1.png",
    winners: {
      first: "Shadow Strikers",
      second: "Blue Blazers",
      third: "Greene Warriors",
    },
  },
  {
    id: "tourney-4",
    name: "Pro Turf Championship",
    description: "Professional level tournament for experienced teams.",
    date: "2026-03-20",
    type: "passed",
    entryFee: 2000,
    prizePool: "₹50,000",
    imageUrl: "/images/tourney-2.png",
    winners: {
      first: "Titan Football Club",
      second: "Eagle Eyes",
      third: "Apex Predators",
    },
  },
];

const TOURNAMENTS_STORAGE_KEY = "tournament-data";

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(TOURNAMENTS_STORAGE_KEY);
    if (raw) {
      setTournaments(JSON.parse(raw));
    } else {
      setTournaments(INITIAL_TOURNAMENTS);
      localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(INITIAL_TOURNAMENTS));
    }
  }, []);

  const saveTournaments = (updated: Tournament[]) => {
    setTournaments(updated);
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(updated));
  };

  const addTournament = (tournament: Omit<Tournament, "id">) => {
    const newTournament = { ...tournament, id: crypto.randomUUID() };
    saveTournaments([...tournaments, newTournament]);
    return newTournament;
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    saveTournaments(tournaments.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTournament = (id: string) => {
    saveTournaments(tournaments.filter(t => t.id !== id));
  };

  const registerTeam = (tournamentId: string, teamData: { name: string; captain: string; phone: string }) => {
    const updatedTournaments = tournaments.map(t => {
      if (t.id === tournamentId) {
        const newTeam = {
          ...teamData,
          id: crypto.randomUUID(),
          registeredAt: new Date().toISOString()
        };
        return {
          ...t,
          registeredTeams: [...(t.registeredTeams || []), newTeam]
        };
      }
      return t;
    });
    saveTournaments(updatedTournaments);
  };

  return { tournaments, addTournament, updateTournament, deleteTournament, registerTeam };
}

export const TOURNAMENTS = INITIAL_TOURNAMENTS;

export type SlotStatus = "available" | "selected" | "booked" | "maintenance" | "phone-booking";

export interface Booking {
  id: string;
  turfId: string;
  date: string; // YYYY-MM-DD
  hour: number; // 6-23
  name: string;
  phone: string;
  email: string;
  status: "booked" | "maintenance" | "phone-booking";
  amount: number;
  bookingCode: string;
  createdAt: string;
}

const STORAGE_KEY = "turf-bookings";

function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const addBooking = useCallback((booking: Omit<Booking, "id" | "createdAt" | "bookingCode">, code?: string) => {
    const bookingCode = code || `TPH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      bookingCode,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const updated = [...prev, newBooking];
      saveBookings(updated);
      return updated;
    });
    return newBooking;
  }, []);

  const getBookingByCode = useCallback((code: string) => {
    return bookings.filter((b) => b.bookingCode === code.toUpperCase());
  }, [bookings]);

  const removeBooking = useCallback((id: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveBookings(updated);
      return updated;
    });
  }, []);

  const getSlotStatus = useCallback(
    (turfId: string, date: string, hour: number): SlotStatus => {
      const booking = bookings.find(
        (b) => b.turfId === turfId && b.date === date && b.hour === hour
      );
      if (!booking) return "available";
      return booking.status;
    },
    [bookings]
  );

  const getBookingsForDate = useCallback(
    (date: string) => bookings.filter((b) => b.date === date),
    [bookings]
  );

  const getTodayRevenue = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings
      .filter((b) => b.date === today && b.status === "booked")
      .reduce((sum, b) => sum + b.amount, 0);
  }, [bookings]);

  const getTotalBookings = useCallback(() => {
    return bookings.filter((b) => b.status === "booked").length;
  }, [bookings]);

  const getTotalRevenue = useCallback(() => {
    return bookings
      .filter((b) => b.status === "booked")
      .reduce((sum, b) => sum + b.amount, 0);
  }, [bookings]);

  const getMonthlyRevenueData = useCallback(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    const data = months.map((month, index) => {
      const monthRevenue = bookings
        .filter((b) => {
          const bookingDate = new Date(b.date);
          return (
            b.status === "booked" &&
            bookingDate.getMonth() === index &&
            bookingDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, b) => sum + b.amount, 0);
      
      return { name: month, revenue: monthRevenue };
    });
    
    return data;
  }, [bookings]);

  return { 
    bookings, 
    addBooking, 
    removeBooking, 
    getSlotStatus, 
    getBookingsForDate, 
    getTodayRevenue, 
    getTotalBookings, 
    getTotalRevenue,
    getMonthlyRevenueData,
    getBookingByCode 
  };
}

export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export function formatHour(hour: number): string {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}