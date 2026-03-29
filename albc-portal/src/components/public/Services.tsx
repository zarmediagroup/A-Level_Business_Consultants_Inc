"use client";

import {
  BookOpen,
  FileText,
  Users,
  Building2,
  BarChart3,
  Receipt,
  Briefcase,
  TrendingUp,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const services = [
  {
    icon: BookOpen,
    title: "Bookkeeping",
    description:
      "Timely reconciliations, management accounts, and a ledger you can rely on for decisions.",
    features: ["Management accounts", "Bank reconciliations", "Creditors & debtors"],
    highlight: false,
  },
  {
    icon: FileText,
    title: "Tax returns",
    description:
      "Corporate and personal filings, provisional tax, and planning aligned to SARS requirements.",
    features: ["Income tax", "Provisional tax", "Structuring advice"],
    highlight: true,
  },
  {
    icon: Users,
    title: "Payroll",
    description:
      "Pay runs, EMP201, and year-end certificates — executed on schedule with audit-friendly records.",
    features: ["Monthly payroll", "EMP201", "IRP5 / IT3(a)"],
    highlight: false,
  },
  {
    icon: Building2,
    title: "Business registration",
    description:
      "CIPC registrations, amendments, and secretarial records maintained to statute.",
    features: ["New companies", "Share register", "CIPC changes"],
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Financial statements",
    description:
      "Annual financial statements prepared for IFRS for SMEs — suitable for funders and filing.",
    features: ["AFS compilation", "Compilation reports", "IFRS for SMEs"],
    highlight: false,
  },
  {
    icon: Receipt,
    title: "VAT",
    description:
      "Registration, returns, and dispute support — structured to reduce exposure and delay.",
    features: ["VAT registration", "Returns", "SARS correspondence"],
    highlight: false,
  },
  {
    icon: Briefcase,
    title: "Company secretarial",
    description:
      "Resolutions, statutory registers, and annual returns filed on time.",
    features: ["Director changes", "Share movements", "CIPC annual returns"],
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Advisory",
    description:
      "Cash flow, forecasts, and growth planning grounded in your actual numbers.",
    features: ["Cash flow", "Forecasts", "Funding packs"],
    highlight: false,
  },
  {
    icon: Shield,
    title: "Audit & verification support",
    description:
      "Document packs, SARS liaison, and measured responses during reviews or audits.",
    features: ["Audit prep", "SARS liaison", "Disputes"],
    highlight: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <MarketingSectionHeader
          kicker="Services"
          title={
            <>
              End-to-end finance support <span className="text-slate-600">in one relationship</span>
            </>
          }
          description="Engagements are scoped in writing. You know who owns the file, what we deliver each month, and how we charge — before work begins."
        />

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className={`group relative flex flex-col bg-white p-7 transition-colors md:p-8 ${
                  service.highlight
                    ? "ring-1 ring-inset ring-slate-900 sm:ring-2"
                    : "hover:bg-slate-50/90"
                }`}
              >
                {service.highlight ? (
                  <span className="absolute right-6 top-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Frequently engaged
                  </span>
                ) : null}

                <div className="mb-4 flex h-9 w-9 items-center justify-center border border-slate-200">
                  <Icon className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                </div>

                <h3 className="pr-16 text-[15px] font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>

                <ul className="mt-5 space-y-1.5 text-xs text-slate-600">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-1.5 h-px w-2 shrink-0 bg-slate-300" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-6 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-900 underline-offset-4 hover:underline"
                >
                  Discuss this
                  <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col justify-between gap-6 border border-slate-200 bg-white px-8 py-8 md:flex-row md:items-center md:px-10">
          <div>
            <p className="text-[15px] font-medium text-slate-900">Not sure where to start?</p>
            <p className="mt-1 text-sm text-slate-600">
              A short call is usually enough to map services, timelines, and fees.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex h-11 shrink-0 items-center justify-center border border-slate-900 bg-slate-900 px-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Book an intro call
          </a>
        </div>
      </div>
    </section>
  );
}
