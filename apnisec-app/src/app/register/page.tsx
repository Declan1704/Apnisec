"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030712] px-6">
      {/* Dynamic Background Elements for "Standout" look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 mb-6 shadow-xl shadow-blue-500/20"
          >
            <Lock className="text-white w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 font-medium">
            Register to access your dashboard and manage your security services.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl border border-slate-800 shadow-2xl"
        >
          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                role="alert"
              >
                <AlertCircle className="w-4 h-4" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-300 ml-1"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-300 ml-1"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className={cn(
              "relative w-full py-4 rounded-xl font-bold text-white overflow-hidden transition-all",
              "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500",
              "shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register <ArrowRight className="w-5 h-5" />
                </>
              )}
            </span>
          </motion.button>

          {/* Footer Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-slate-400 text-sm mt-4"
          >
            Don't have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Already have an account?
            </Link>
          </motion.p>
        </form>

        {/* SEO/Accessibility hidden description */}
        <p className="sr-only">
          Login page for ApniSec security dashboard services.
        </p>
      </motion.div>
    </main>
  );
}
