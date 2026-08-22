import { ArrowRight } from "lucide-react";
import { useAttendance } from "../context/AttendanceContext";

export default function CheckInWidget() {
  const { isCheckedIn, checkInTime, checkIn, checkOut } = useAttendance();

  return (
    <div className="shrink-0">
      {!isCheckedIn ? (
        <button
          onClick={checkIn}
          className="check-in-primary flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-semibold text-bg transition"
        >
          Check In <ArrowRight size={13} />
        </button>
      ) : (
        <button
          onClick={checkOut}
          title={`Checked in since ${checkInTime}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-display text-xs font-semibold text-text transition hover:border-accent-2 hover:text-accent-2"
        >
          Check Out <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}
