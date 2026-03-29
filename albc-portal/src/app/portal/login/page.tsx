"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle, Zap, Users, User } from "lucide-react";
import { createClient } from "@/lib/supabase";

const IS_DEMO =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url" ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "inactive") {
      setError("Your account has been deactivated. Please contact your accountant.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    if (data.user) {
      // Update last login
      await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);

      // Log the login action
      await supabase.from("audit_logs").insert({
        user_id: data.user.id,
        action: "login",
        entity_type: "auth",
        details: { method: "email_password" },
      });

      // Fetch role and redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/portal/admin/dashboard");
      } else {
        router.push("/portal/client/dashboard");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });

    if (resetError) {
      setError("Could not send reset email. Please check your email address.");
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-950/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-800/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to website */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-slate-500 hover:text-blue-800 text-sm transition-colors inline-flex items-center gap-1"
          >
            ← Back to website
          </Link>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl text-center">
              {resetMode ? "Reset Password" : "Client Portal"}
            </h1>
            <p className="text-slate-400 text-sm text-center mt-1">
              {resetMode
                ? "Enter your email to receive a reset link"
                : "A-Level Business Consultants Inc"}
            </p>
          </div>

          {/* Demo Mode Banner */}
          {IS_DEMO && !resetMode && (
            <div className="mb-6 rounded-xl overflow-hidden border border-blue-600/40">
              <div className="bg-blue-950/50 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <Zap className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-[11px] font-semibold tracking-wide uppercase">Demo mode — no login required</span>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => router.push("/portal/admin/dashboard")}
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl px-4 py-3 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-700/15 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-200" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Admin Portal</p>
                    <p className="text-slate-400 text-xs">Full practice management dashboard</p>
                  </div>
                  <span className="text-blue-200 text-xs font-medium group-hover:translate-x-0.5 transition-transform">Enter →</span>
                </button>

                <button
                  onClick={() => router.push("/portal/client/dashboard")}
                  className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-600/40 text-white rounded-xl px-4 py-3 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">Client Portal</p>
                    <p className="text-slate-500 text-xs">Document vault & account view</p>
                  </div>
                  <span className="text-slate-500 text-xs font-medium group-hover:translate-x-0.5 transition-transform group-hover:text-slate-300">Enter →</span>
                </button>
              </div>
              <div className="px-4 pb-3">
                <div className="h-px bg-white/5 mb-3" />
                <p className="text-slate-600 text-xs text-center">
                  Connect Supabase in <code className="text-slate-500 font-mono">.env.local</code> to enable real authentication
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Reset sent success */}
          {resetSent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Check your inbox</h3>
              <p className="text-slate-400 text-sm mb-6">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <button
                onClick={() => { setResetMode(false); setResetSent(false); }}
                className="text-blue-800 hover:text-blue-200 text-sm font-medium transition-colors"
              >
                Back to login
              </button>
            </div>
          ) : resetMode ? (
            /* Reset form */
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.za"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
              <button
                type="button"
                onClick={() => { setResetMode(false); setError(""); }}
                className="w-full text-slate-400 hover:text-white text-sm transition-colors py-2"
              >
                Back to login
              </button>
            </form>
          ) : (
            /* Login form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.za"
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-blue-800 hover:text-blue-200 text-xs font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Sign In to Portal
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <p className="text-slate-600 text-xs">
              256-bit encrypted · Sessions expire after inactivity
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Don&apos;t have a portal account?{" "}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              router.push("/#contact");
            }}
            className="text-blue-800 hover:text-blue-200 transition-colors font-medium"
          >
            Contact us to get access
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
