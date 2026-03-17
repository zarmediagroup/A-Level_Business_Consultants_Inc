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
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Bookkeeping",
    description:
      "Accurate, up-to-date bookkeeping that keeps your finances organised and gives you a real-time view of your business performance. We manage your general ledger, reconciliations, and management accounts.",
    features: ["Monthly management accounts", "Bank reconciliations", "Creditors & debtors"],
    highlight: false,
  },
  {
    icon: FileText,
    title: "Tax Returns",
    description:
      "Comprehensive tax compliance and planning for individuals and companies. We ensure you're always compliant with SARS while maximising every legitimate tax-saving opportunity.",
    features: ["Income tax returns", "Provisional tax", "Tax planning & structuring"],
    highlight: true,
  },
  {
    icon: Users,
    title: "Payroll Services",
    description:
      "End-to-end payroll processing, EMP201 submissions, and IRP5 certificates. We handle the complexity of payroll so your employees are paid correctly and on time, every time.",
    features: ["Monthly payroll processing", "EMP201 submissions", "IRP5 / IT3(a) certificates"],
    highlight: false,
  },
  {
    icon: Building2,
    title: "Business Registration",
    description:
      "Full company registration, amendment, and secretarial services through CIPC. We handle all the paperwork so your business is legally constituted and compliant from day one.",
    features: ["Company registration", "Share register maintenance", "CIPC amendments"],
    highlight: false,
  },
  {
    icon: BarChart3,
    title: "Financial Statements",
    description:
      "Professionally prepared annual financial statements compiled in accordance with IFRS for SMEs. Suitable for bank submissions, investor presentations, and statutory requirements.",
    features: ["Annual financial statements", "Compilation reports", "IFRS for SMEs compliance"],
    highlight: false,
  },
  {
    icon: Receipt,
    title: "VAT Returns",
    description:
      "Accurate VAT registration, return preparation, and submission to SARS. We manage your VAT affairs to keep you compliant and avoid costly penalties.",
    features: ["VAT registration", "Monthly/bi-monthly returns", "VAT audits & disputes"],
    highlight: false,
  },
  {
    icon: Briefcase,
    title: "Company Secretarial",
    description:
      "Comprehensive company secretarial services to keep your entity compliant with the Companies Act. Resolutions, register maintenance, and statutory filings.",
    features: ["Director changes", "Share transfers", "Annual returns (CIPC)"],
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: "Business Consulting",
    description:
      "Strategic financial advisory for business owners looking to improve profitability, manage cash flow, secure funding, or plan for growth. Real advice, not just numbers.",
    features: ["Cash flow management", "Business plans & forecasts", "Growth strategy"],
    highlight: false,
  },
  {
    icon: Shield,
    title: "Audit Support",
    description:
      "Comprehensive support during SARS audits and verifications. We liaise with SARS on your behalf, prepare all required documentation, and protect your best interests throughout.",
    features: ["SARS audit representation", "Document preparation", "Dispute resolution"],
    highlight: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#0b1d3a]/5 border border-[#0b1d3a]/10 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1d3a] mb-6">
            Comprehensive Financial Services{" "}
            <span className="text-[#c9a84c]">Under One Roof</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From day-to-day bookkeeping to complex tax structuring, we provide the full
            spectrum of accounting and business advisory services your organisation needs
            to thrive.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  service.highlight
                    ? "bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e] text-white shadow-lg shadow-[#0b1d3a]/20"
                    : "bg-white border border-slate-100 hover:border-[#c9a84c]/20 hover:shadow-[#c9a84c]/5"
                }`}
              >
                {service.highlight && (
                  <div className="absolute top-4 right-4 bg-[#c9a84c] text-[#0b1d3a] text-xs font-bold px-2.5 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div
                  className={`w-13 h-13 rounded-xl flex items-center justify-center mb-5 ${
                    service.highlight
                      ? "bg-[#c9a84c]/20"
                      : "bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e]"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      service.highlight ? "text-[#c9a84c]" : "text-[#c9a84c]"
                    }`}
                  />
                </div>

                <h3
                  className={`text-lg font-bold mb-3 ${
                    service.highlight ? "text-white" : "text-[#0b1d3a]"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    service.highlight ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          service.highlight ? "bg-[#c9a84c]" : "bg-[#c9a84c]"
                        }`}
                      />
                      <span
                        className={service.highlight ? "text-slate-300" : "text-slate-500"}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:gap-2.5 ${
                    service.highlight
                      ? "text-[#c9a84c] hover:text-[#e0ce96]"
                      : "text-[#0b1d3a] hover:text-[#c9a84c]"
                  }`}
                >
                  Enquire about this service
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#0b1d3a] to-[#1a2f5e] rounded-2xl px-10 py-8">
            <div className="text-left">
              <p className="text-white font-semibold text-lg">Not sure which service you need?</p>
              <p className="text-slate-400 text-sm">Book a free 30-minute consultation and we'll guide you.</p>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-shrink-0 bg-[#c9a84c] hover:bg-[#b8923c] text-[#0b1d3a] font-bold px-7 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Book Free Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
