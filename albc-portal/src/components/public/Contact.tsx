"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "info@albc.co.za",
    sub: "We respond within 1 business day",
    href: "mailto:info@albc.co.za",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+27 (0)__ ___ ____",
    sub: "Monday–Friday, 8:00–17:00",
    href: "tel:+27000000000",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "South Africa",
    sub: "Serving clients nationally and remotely",
    href: null,
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri: 08:00–17:00",
    sub: "Sat: 09:00–13:00 by appointment",
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
    <section id="contact" className="py-28 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#0b1d3a]/5 border border-[#0b1d3a]/10 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1d3a] mb-6">
            Let&apos;s Start a{" "}
            <span className="text-[#c9a84c]">Conversation</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Whether you&apos;re looking to switch accountants, register a new business, or
            need urgent tax advice — we&apos;re here to help. Contact us today for a
            free, no-obligation consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Contact Information</h3>
              <div className="gold-divider mb-6" />

              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a84c]/25 transition-colors">
                        <Icon className="w-5 h-5 text-[#c9a84c]" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">{info.label}</p>
                        <p className="text-white font-semibold text-sm">{info.value}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{info.sub}</p>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a key={info.label} href={info.href} className="block hover:opacity-80 transition-opacity">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              <div className="gold-divider mt-8 mb-6" />

              <div>
                <p className="text-white font-semibold text-sm mb-2">Existing Client?</p>
                <p className="text-slate-400 text-xs mb-4">
                  Log in to your secure client portal to upload documents and manage your account.
                </p>
                <a
                  href="/portal/login"
                  className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8923c] text-[#0b1d3a] font-bold text-sm px-5 py-2.5 rounded-lg transition-colors w-full justify-center"
                >
                  Access Client Portal
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b1d3a] mb-3">Message Received!</h3>
                  <p className="text-slate-500 max-w-sm leading-relaxed">
                    Thank you for reaching out. A member of our team will contact you within 1 business day.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-[#c9a84c] hover:text-[#b8923c] font-semibold text-sm transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-[#0b1d3a] mb-6">
                    Send us a message
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.co.za"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+27 82 000 0000"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Your Business Pty Ltd"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                      Service of Interest
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors bg-white"
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0b1d3a] mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your business and what you need help with..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-[#0b1d3a] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-slate-400 text-xs text-center">
                    Your information is confidential and will never be shared with third parties.
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
