import { createContext, useContext, useState, useCallback } from "react";

const AttendanceContext = createContext(null);

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AttendanceProvider({ children }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const checkIn = useCallback(() => {
    setIsCheckedIn(true);
    setCheckInTime(formatTime(new Date()));
  }, []);

  const checkOut = useCallback(() => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  }, []);

  return (
    <AttendanceContext.Provider value={{ isCheckedIn, checkInTime, checkIn, checkOut }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used inside AttendanceProvider");
  return ctx;
}
