import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { api, setAuthToken } from "../lib/api";
import toast from "react-hot-toast";
import {
  Film,
  Mail,
  Lock,
  UserPlus,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation states
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!allRequirementsMet) {
      toast.error("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", { email, password });
      const { user, token } = response.data;

      setAuth(user, token);
      setAuthToken(token);
      toast.success("Welcome to MediaSync! 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
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
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform hover:scale-105 transition-transform duration-200">
                <Film className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Join thousands of users downloading media
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Password
                </label>
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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Password Requirements - Show when typing */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div
                      className={`flex items-center gap-2 transition-colors ${passwordRequirements.minLength ? "text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {passwordRequirements.minLength ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasUpperCase ? "text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {passwordRequirements.hasUpperCase ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasLowerCase ? "text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {passwordRequirements.hasLowerCase ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasNumber ? "text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {passwordRequirements.hasNumber ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>One number</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 transition-colors ${passwordRequirements.hasSpecialChar ? "text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {passwordRequirements.hasSpecialChar ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>One special character</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className={`block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900/50 border rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? "border-green-500 focus:ring-green-500"
                          : "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    }`}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword.length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {passwordsMatch ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="mt-2 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !allRequirementsMet || !passwordsMatch}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </span>
              )}
            </button>

            <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
