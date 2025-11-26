import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/auth.store";
import { setAuthToken } from "./lib/api";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import JobsPage from "./pages/JobsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  const { token, logout } = useAuthStore();

  useEffect(() => {
    // Set auth token on app load
    if (token) {
      setAuthToken(token);
    } else {
      // If no token found, ensure user is logged out
      logout();
    }
  }, [token, logout]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: "dark:bg-slate-800 dark:text-white",
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
