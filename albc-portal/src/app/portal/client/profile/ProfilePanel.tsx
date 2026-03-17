"use client";

import { useState } from "react";
import { User, Mail, Phone, Building2, Lock, Eye, EyeOff, CheckCircle, Save } from "lucide-react";
import { formatDate, getInitials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

interface ProfilePanelProps {
  profile: Profile;
}

export default function ProfilePanel({ profile }: ProfilePanelProps) {
  const [form, setForm] = useState({
    full_name: profile.full_name,
    phone: profile.phone ?? "",
    company: profile.company ?? "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      } else {
        setError("Failed to save changes.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    setError("");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwords.new }),
      });
      if (res.ok) {
        setPasswordSuccess(true);
        setPasswords({ current: "", new: "", confirm: "" });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setError("Failed to update password.");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1d3a]">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and security settings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
        {/* Avatar header */}
        <div className="bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e] px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c]/40 flex items-center justify-center">
            <span className="text-[#c9a84c] text-xl font-bold">{getInitials(profile.full_name)}</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg">{profile.full_name}</p>
            <p className="text-slate-400 text-sm">{profile.email}</p>
            <p className="text-slate-500 text-xs mt-1">
              Member since {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
          <h3 className="font-semibold text-[#0b1d3a] text-sm">Personal Information</h3>

          <div>
            <label className="block text-sm font-medium text-[#0b1d3a] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0b1d3a] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-400"
              />
            </div>
            <p className="text-slate-400 text-xs mt-1.5">Email cannot be changed. Contact your accountant.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1d3a] mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+27 82 000 0000"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0b1d3a] mb-2">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Business name"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 bg-[#0b1d3a] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              {savingProfile ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : profileSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-[#0b1d3a] mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#c9a84c]" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0b1d3a] mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                required
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full pl-10 pr-12 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0b1d3a] mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Repeat new password"
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8923c] disabled:opacity-60 text-[#0b1d3a] font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              {savingPassword ? (
                <div className="w-4 h-4 border-2 border-[#0b1d3a]/30 border-t-[#0b1d3a] rounded-full animate-spin" />
              ) : passwordSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Password Updated!
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
