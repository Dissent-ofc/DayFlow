import { ArrowRight } from "lucide-react";
import { useAttendance } from "../context/AttendanceContext";

export default function CheckInWidget() {
  const { isCheckedIn, checkInTime, checkIn, checkOut } = useAttendance();

  return (
    <div className="fixed bottom-6 right-6 z-20 w-56 rounded-xl border border-border bg-surface-raised p-4 shadow-2xl">
      {!isCheckedIn ? (
        <button
          onClick={checkIn}
          className="check-in-primary flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-display text-sm font-semibold text-bg transition"
        >
          Check In <ArrowRight size={15} />
        </button>
      ) : (
        <div className="flex flex-col gap-2.5">
          <p className="font-mono text-xs text-faint">Since {checkInTime}</p>
          <button
            onClick={checkOut}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 font-display text-sm font-semibold text-text transition hover:border-accent-2 hover:text-accent-2"
          >
            Check Out <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
