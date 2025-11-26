import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { api, setAuthToken } from "../lib/api";
import toast from "react-hot-toast";
import { Film, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      setAuth(user, token);
      setAuthToken(token);
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
        <span>Back to Home</span>
      </Link>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                <Film className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Sign in to continue downloading
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </span>
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
