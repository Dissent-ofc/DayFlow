import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import AppShell from "./layouts/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<ComingSoon title="Attendance" />} />
          <Route path="/timeoff" element={<ComingSoon title="Time Off" />} />
          <Route path="/profile" element={<ComingSoon title="My Profile" />} />
          <Route path="/employees/:id" element={<ComingSoon title="Employee Profile (view-only)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
