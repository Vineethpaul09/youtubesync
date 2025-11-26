import { Link } from "react-router-dom";
import {
  Film,
  Download,
  Zap,
  Shield,
  Globe,
  Clock,
  CheckCircle2,
  Star,
  Users,
  ArrowRight,
  Play,
  Music,
  Video,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                MediaSync
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-300">
                  Free • No Registration Required
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Download YouTube Videos & Music
                <span className="text-blue-500"> in Seconds</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Fast, reliable, and easy-to-use media converter. Support for
                900+ websites. Download in HD, 4K, or extract audio to MP3.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 group"
                >
                  Start Converting Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <button className="border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              {/* Trust Signals */}
              <div className="mt-12 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      50K+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Active Users
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      4.8/5
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      User Rating
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      1M+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Downloads
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-slate-300 dark:border-slate-700">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3 bg-slate-200 dark:bg-slate-700/50 rounded-lg p-4">
                    <Video className="w-6 h-6 text-blue-400" />
                    <div className="flex-1">
                      <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                      <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded-full w-1/2 mt-2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-200 dark:bg-slate-700/30 rounded-lg p-4 text-center">
                      <Music className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        MP3
                      </div>
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-700/30 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        MP4
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <span className="text-green-400 text-sm font-medium">
                      Ready to download
                    </span>
                    <Download className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-slate-100 dark:bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Everyone
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to download and convert media from your
              favorite platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Lightning Fast
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Download videos at maximum speed. Our optimized servers ensure
                quick conversions without quality loss.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                900+ Websites
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Support for YouTube, TikTok, Instagram, Facebook, Twitter, and
                900+ other platforms.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-green-500/50 transition">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                100% Secure
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your privacy matters. No data collection, no registration
                required. Completely safe and secure.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-yellow-500/50 transition">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                HD & 4K Quality
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Download videos in original quality. Support for 720p, 1080p,
                4K, and even 8K resolution.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Audio Extraction
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Convert videos to MP3, WAV, AAC, or FLAC. Perfect for music
                lovers and podcast listeners.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 hover:border-cyan-500/50 transition">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Batch Downloads
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Download multiple videos at once. Queue up your favorites and
                let our system handle the rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Start downloading in seconds. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Paste URL
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Copy the video link from YouTube or any supported platform and
                  paste it into our converter.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-full"></div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Choose Format
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Select your desired format (MP4, MP3, etc.) and quality. We
                  handle the conversion automatically.
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 transform translate-x-full"></div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Download
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Click download and enjoy your media! Files are ready in seconds,
                saved directly to your device.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              Try It Now - It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Free
              </h3>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                $0
                <span className="text-lg text-slate-600 dark:text-slate-400 font-normal">
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    5 downloads per day
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Up to 1080p quality
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Basic formats
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Standard support
                  </span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block text-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl p-8 relative transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $9.99
                <span className="text-lg text-blue-100 font-normal">
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Unlimited downloads</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Up to 4K quality</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">All formats</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Batch downloads</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">No ads</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block text-center bg-white hover:bg-slate-100 text-blue-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Enterprise
              </h3>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Custom
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Everything in Pro
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    API access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Custom integration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Dedicated support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    SLA guarantee
                  </span>
                </li>
              </ul>
              <button className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need to know about our service
            </p>
          </div>

          <div className="space-y-6">
            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                Is this service really free?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! Our basic service is completely free with no hidden fees.
                You can download up to 5 videos per day in 1080p quality without
                creating an account. For unlimited downloads and higher quality,
                check out our Pro plan.
              </p>
            </details>

            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                What websites are supported?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                We support 900+ websites including YouTube, TikTok, Instagram,
                Facebook, Twitter, Vimeo, Dailymotion, and many more. If you
                have a specific site you'd like us to support, let us know!
              </p>
            </details>

            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                Is it legal to download videos?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                Our tool is designed for personal use and backup purposes. It's
                your responsibility to respect copyright laws and terms of
                service of the platforms you download from. We recommend only
                downloading content you own or have permission to download.
              </p>
            </details>

            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                What formats and quality options are available?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                We support video formats including MP4, WebM, and MKV in
                qualities up to 4K (8K for Pro users). For audio, you can
                convert to MP3, WAV, AAC, FLAC, and OGG. Quality options range
                from 144p to 8K depending on the source video.
              </p>
            </details>

            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                Do I need to install any software?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                No! Our service is completely web-based. Just visit our website,
                paste the URL, and download. No software installation, browser
                extensions, or apps required. Works on any device with a web
                browser.
              </p>
            </details>

            <details className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 group">
              <summary className="text-lg font-semibold text-slate-900 dark:text-white cursor-pointer flex justify-between items-center">
                Is my data safe and private?
                <span className="text-slate-600 dark:text-slate-400 group-open:rotate-180 transition">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                Absolutely. We don't store your downloads, don't track your
                activity, and don't require registration for basic use. All
                conversions happen on our secure servers and files are
                automatically deleted after processing. Your privacy is our
                priority.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Downloading?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust MediaSync for their media
            downloads
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-blue-100 mt-4 text-sm">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  MediaSync
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Fast, reliable, and secure media downloader for all your
                favorite platforms.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition"
                  >
                    DMCA
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
            <p>&copy; 2025 MediaSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
