import { motion } from "framer-motion";
import { HOURS, formatHour, type SlotStatus } from "@/lib/store";

interface SlotPickerProps {
  turfId: string;
  date: string;
  selectedSlots: number[];
  getSlotStatus: (turfId: string, date: string, hour: number) => SlotStatus;
  onToggle: (hour: number) => void;
}

export function SlotPicker({ turfId, date, selectedSlots, getSlotStatus, onToggle }: SlotPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {HOURS.map((hour) => {
        const status = getSlotStatus(turfId, date, hour);
        const isSelected = selectedSlots.includes(hour);
        const isBlocked = status === "booked" || status === "maintenance" || status === "phone-booking";

        let classes = "rounded-xl border px-3 py-3 text-center text-sm font-medium transition-all cursor-pointer ";
        if (isBlocked) {
          classes += "border-booked bg-booked/30 text-booked-foreground cursor-not-allowed opacity-60";
        } else if (isSelected) {
          classes += "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25";
        } else {
          classes += "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/10";
        }

        const label = status === "maintenance" ? "🔧" : status === "phone-booking" ? "📞" : status === "booked" ? "Booked" : "";

        return (
          <motion.button
            key={hour}
            whileTap={!isBlocked ? { scale: 0.95 } : undefined}
            disabled={isBlocked}
            onClick={() => !isBlocked && onToggle(hour)}
            className={classes}
          >
            <div className="text-xs">{formatHour(hour)}</div>
            {label && <div className="mt-0.5 text-[10px]">{label}</div>}
          </motion.button>
        );
      })}
    </div>
  );
}