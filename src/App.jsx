import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";
import AppShell from "./layouts/AppShell";
import AdminProfile from "./pages/AdminProfile";
import EmployeeProfile from "./pages/EmployeeProfile";
import NewEmployee from "./pages/NewEmployee";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="font-mono text-sm text-muted">Loading…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmployeeProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance" element={<ComingSoon title="Attendance" />} />
              <Route path="/timeoff" element={<ComingSoon title="Time Off" />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/employees/new" element={<NewEmployee />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
            </Route>
          </Routes>
        </EmployeeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
