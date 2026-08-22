import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AttendanceProvider } from "../context/AttendanceContext";
import TopNav from "../components/TopNav";

export default function AppShell() {
  const [pointer, setPointer] = useState({ x: 50, y: 18 });

  function handlePointerMove(event) {
    const { clientX, clientY } = event;
    setPointer({
      x: (clientX / window.innerWidth) * 100,
      y: (clientY / window.innerHeight) * 100,
    });
  }

  return (
    <AttendanceProvider>
      <div
        className="app-background min-h-screen text-text"
        onMouseMove={handlePointerMove}
        style={{ "--pointer-x": `${pointer.x}%`, "--pointer-y": `${pointer.y}%` }}
      >
        <TopNav />
        <main className="mx-auto max-w-[1180px] px-6 py-8">
          <Outlet />
        </main>
      </div>
    </AttendanceProvider>
  );
}
