import { useState, useEffect, useCallback } from "react";

export interface Turf {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  features: string[];
}

export const TURFS: Turf[] = [
  {
    id: "turf-a",
    name: "Turf A",
    description: "Premium 5-a-side pitch with floodlights and synthetic grass.",
    pricePerHour: 1200,
    features: ["Floodlights", "Synthetic Grass", "Changing Room"],
  },
  {
    id: "turf-b",
    name: "Turf B",
    description: "Full-size 7-a-side arena with professional markings.",
    pricePerHour: 1800,
    features: ["7-a-side", "Scoreboard", "Dugout Seating"],
  },
  {
    id: "turf-c",
    name: "Turf C",
    description: "Indoor court for futsal and cricket nets. All-weather play.",
    pricePerHour: 1500,
    features: ["Indoor", "All-Weather", "Cricket Nets"],
  },
];

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

  const addBooking = useCallback((booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => {
      const updated = [...prev, newBooking];
      saveBookings(updated);
      return updated;
    });
    return newBooking;
  }, []);

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

  return { bookings, addBooking, removeBooking, getSlotStatus, getBookingsForDate, getTodayRevenue, getTotalBookings };
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