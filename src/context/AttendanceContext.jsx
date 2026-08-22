import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api";

const AttendanceContext = createContext(null);

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AttendanceProvider({ children }) {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToday = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const records = await api.attendance({ employeeId: user.id, from: today, to: today });
    const record = records[0];
    setIsCheckedIn(Boolean(record?.checkIn && !record?.checkOut));
    setCheckInTime(record?.checkIn ? formatTime(new Date(record.checkIn)) : null);
  }, [user]);

  useEffect(() => {
    refreshToday().catch(() => {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }).finally(() => setLoading(false));
  }, [refreshToday]);

  const checkIn = useCallback(async () => {
    const record = await api.checkIn();
    setIsCheckedIn(true);
    setCheckInTime(formatTime(new Date(record.checkIn)));
  }, []);

  const checkOut = useCallback(async () => {
    await api.checkOut();
    setIsCheckedIn(false);
    setCheckInTime(null);
  }, []);

  return (
    <AttendanceContext.Provider value={{ isCheckedIn, checkInTime, checkIn, checkOut, loading, refreshToday }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance must be used inside AttendanceProvider");
  return ctx;
}
