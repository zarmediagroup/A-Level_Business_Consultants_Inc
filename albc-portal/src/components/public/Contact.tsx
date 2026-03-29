"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@albc.co.za",
    sub: "Response within one business day",
    href: "mailto:info@albc.co.za",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+27 (0)__ ___ ____",
    sub: "Monday–Friday, 08:00–17:00",
    href: "tel:+27000000000",
  },
  {
    icon: MapPin,
    label: "Coverage",
    value: "South Africa",
    sub: "National and remote engagements",
    href: null,
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri: 08:00–17:00",
    sub: "Saturday by appointment",
    href: null,
  },
];

const services = [
  "Bookkeeping",
  "Tax Returns",
  "Payroll",
  "Business Registration",
  "Financial Statements",
  "VAT Returns",
  "Company Secretarial",
  "Business Consulting",
  "Audit Support",
  "Other",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", company: "", service: "", message: "" });
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="border-t border-slate-200/80 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <MarketingSectionHeader
          kicker="Contact"
          title={
            <>
              Tell us what you need <span className="text-slate-600">in a few lines</span>
            </>
          }
          description="New mandate, changing accountants, or a deadline — we confirm receipt the same day where possible and reply with who will handle your file."
        />

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-14">
          <div className="space-y-6 lg:col-span-2">
            <div className="border border-slate-900 bg-slate-900 p-8 text-white">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Direct lines
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                        <Icon className="w-4 h-4 text-slate-200" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                          {info.label}
                        </p>
                        <p className="text-white font-medium text-sm">{info.value}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{info.sub}</p>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a key={info.label} href={info.href} className="block hover:opacity-90 transition-opacity">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-white/15 pt-8">
                <p className="text-sm font-medium text-white">Existing client</p>
                <p className="mb-4 mt-1 text-xs text-slate-400">Documents and secure messages</p>
                <a
                  href="/portal/login"
                  className="inline-flex h-10 w-full items-center justify-center border border-white/40 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-slate-900"
                >
                  Open portal
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="border border-slate-200 bg-slate-50/80 p-8 md:p-10">
              {success ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Message received</h3>
                  <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                    Thank you. A member of our team will contact you within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-sm font-medium text-slate-900 underline underline-offset-4 hover:no-underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Enquiry form
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@company.co.za"
                        className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+27 82 000 0000"
                        className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Your Business (Pty) Ltd"
                        className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Service interest</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                    >
                      <option value="">Select…</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Brief context and what you need help with…"
                      className="w-full resize-none border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/15"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 border border-slate-900 bg-slate-900 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit enquiry
                      </>
                    )}
                  </button>

                  <p className="text-slate-500 text-xs text-center">
                    Your information is treated as confidential and is not shared with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
