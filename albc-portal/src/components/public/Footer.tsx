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
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Engagements
            </h3>
            <p className="text-base font-normal text-white">Introductory calls are confidential and without obligation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-10 items-center justify-center border border-white bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-900 transition-colors hover:bg-slate-100"
            >
              Contact
            </a>
            <Link
              href="/portal/login"
              className="inline-flex h-10 items-center justify-center gap-2 border border-slate-600 px-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-slate-500"
            >
              <Shield className="h-3.5 w-3.5" strokeWidth={1.75} />
              Client login
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
                <span className="text-slate-900 font-semibold text-xs">AL</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm leading-tight">A-Level Business</div>
                <div className="text-slate-500 text-[10px] tracking-[0.15em] uppercase">Consultants Inc</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Accounting, tax, payroll, and advisory for South African businesses — delivered
              with professional standards and clear communication.
            </p>
            <div className="space-y-2.5">
              <a
                href="mailto:info@albc.co.za"
                className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@albc.co.za
              </a>
              <a
                href="tel:+27000000000"
                className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                +27 (0)__ ___ ____
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-5">Services</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-slate-500 hover:text-white text-sm transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-5">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "#about" },
                { label: "Team", href: "#team" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-slate-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-5">Client portal</h4>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-300" />
                <span className="text-white text-sm font-medium">Secure document exchange</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Upload files, track status, and correspond with our team in one place.
              </p>
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open portal
              </Link>
            </div>
            <ul className="space-y-2">
              {["Login", "Reset password", "Upload documents"].map((item) => (
                <li key={item}>
                  <Link href="/portal/login" className="text-slate-500 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-5 text-xs text-slate-600 sm:flex-row lg:px-8">
          <p>© {year} A-Level Business Consultants Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>SARS registered tax practitioner</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>CIPC registered</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>Fully insured</span>
          </div>
          <p>
            Website by{" "}
            <a
              href="https://zarmediagroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              ZarMediaGroup
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
