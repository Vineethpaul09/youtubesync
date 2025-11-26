import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import {
  Upload,
  FileText,
  LogOut,
  Film,
  Sparkles,
  TrendingUp,
  Zap,
  Home,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:scale-105 transition-transform"
            >
              <Film className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                MediaSync
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Welcome, {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Start converting your media files in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Upload Card */}
          <Link
            to="/upload"
            className="group block p-8 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-500 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  Upload Files
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Upload and convert your media files
                </p>
              </div>
              <Sparkles className="w-6 h-6 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
              Get started{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          {/* Jobs Card */}
          <Link
            to="/jobs"
            className="group block p-8 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  View Jobs
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Track your conversion progress
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-400 font-medium">
              View progress{" "}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Getting Started
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                1
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Upload Files
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select media files to convert
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                2
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Choose Format
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pick output format and quality
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400 font-bold border border-pink-500/30">
                3
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Track Progress
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor in View Jobs section
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold border border-green-500/30">
                4
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Download
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get your converted files
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
