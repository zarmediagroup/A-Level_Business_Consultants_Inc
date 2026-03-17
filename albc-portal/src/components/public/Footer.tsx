"use client";

import Link from "next/link";
import { Mail, Phone, Shield, ExternalLink } from "lucide-react";

const serviceLinks = [
  "Bookkeeping",
  "Tax Returns",
  "Payroll Services",
  "Business Registration",
  "Financial Statements",
  "VAT Returns",
  "Company Secretarial",
  "Business Consulting",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#060d1a] text-slate-400">
      {/* Top CTA bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">
              Ready to take your finances to the next level?
            </h3>
            <p className="text-slate-500 text-sm">
              Get in touch today for a free, no-obligation consultation.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#c9a84c] hover:bg-[#b8923c] text-[#0b1d3a] font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Contact Us
            </a>
            <Link
              href="/portal/login"
              className="border border-white/15 hover:border-[#c9a84c]/40 text-white hover:text-[#c9a84c] font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Client Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#a07830] flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">A-Level Business</div>
                <div className="text-[#c9a84c] text-xs tracking-widest uppercase">Consultants Inc</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Professional accounting, tax, payroll, and business advisory services for
              South African businesses of all sizes.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@albc.co.za"
                className="flex items-center gap-2 text-slate-500 hover:text-[#c9a84c] text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@albc.co.za
              </a>
              <a
                href="tel:+27000000000"
                className="flex items-center gap-2 text-slate-500 hover:text-[#c9a84c] text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                +27 (0)__ ___ ____
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6 tracking-wide">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-slate-500 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "#about" },
                { label: "Our Team", href: "#team" },
                { label: "Client Testimonials", href: "#testimonials" },
                { label: "Contact Us", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-slate-500 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Portal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6 tracking-wide">Client Portal</h4>
            <div className="bg-[#0b1d3a]/60 border border-white/5 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-white text-sm font-semibold">Secure Document Portal</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Upload documents, track their status, and communicate with our team — all
                in your private, secure portal.
              </p>
              <Link
                href="/portal/login"
                className="flex items-center gap-2 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 border border-[#c9a84c]/20 text-[#c9a84c] font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Access Client Portal
              </Link>
            </div>
            <ul className="space-y-2">
              {["Login to Portal", "Reset Password", "Upload Documents"].map((item) => (
                <li key={item}>
                  <Link
                    href="/portal/login"
                    className="text-slate-500 hover:text-[#c9a84c] text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {year} A-Level Business Consultants Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600 text-xs">SARS Registered Tax Practitioner</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600 text-xs">CIPC Registered</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600 text-xs">Fully Insured</span>
          </div>
          <p className="text-slate-700 text-xs">
            Website by{" "}
            <a
              href="https://zarmediagroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors"
            >
              ZarMediaGroup
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
