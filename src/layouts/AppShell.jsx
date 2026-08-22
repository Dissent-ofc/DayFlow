import { Outlet } from "react-router-dom";
import { AttendanceProvider } from "../context/AttendanceContext";
import TopNav from "../components/TopNav";
import CheckInWidget from "../components/CheckInWidget";

export default function AppShell() {
  return (
    <AttendanceProvider>
      <div className="min-h-screen bg-bg text-text">
        <TopNav />
        <main className="mx-auto max-w-[1180px] px-6 py-8">
          <Outlet />
        </main>
        <CheckInWidget />
      </div>
    </AttendanceProvider>
  );
}
