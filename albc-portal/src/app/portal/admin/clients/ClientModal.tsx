"use client";

import { useState } from "react";
import { X, User, Mail, Phone, Building2, Briefcase, Lock, Eye, EyeOff } from "lucide-react";
import type { Profile } from "@/lib/types";
import { SERVICE_CATEGORIES } from "@/lib/utils";

interface ClientModalProps {
  client: Profile | null;
  adminId: string;
  onClose: () => void;
  onSaved: (client: Profile & { document_count?: number }) => void;
}

export default function ClientModal({ client, onClose, onSaved }: ClientModalProps) {
  const isEdit = !!client;
  const [form, setForm] = useState({
    full_name: client?.full_name ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    company: client?.company ?? "",
    service_category: client?.service_category ?? "",
    password: "",
    is_active: client?.is_active ?? true,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        isEdit ? `/api/clients/${client.id}` : "/api/clients",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        onSaved(data.client);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Edit Client" : "Add New Client"}
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {isEdit ? "Update client account details" : "Create a new client portal account"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Client Full Name"
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="client@company.co.za"
                disabled={isEdit}
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            {isEdit && (
              <p className="text-slate-400 text-xs mt-1.5">Email cannot be changed after account creation.</p>
            )}
          </div>

          {/* Password (only on create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-1.5">
                Share this with the client. They can reset it from the login page.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+27 82 000 0000"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Company / Business
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Business name"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Service Category
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={form.service_category}
                onChange={(e) => setForm({ ...form, service_category: e.target.value })}
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800 bg-white"
              >
                <option value="">Select a service...</option>
                {SERVICE_CATEGORIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle (edit only) */}
          {isEdit && (
            <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-900">Account Status</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inactive clients cannot log in to the portal
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                  form.is_active ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.is_active ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isEdit ? "Save Changes" : "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
