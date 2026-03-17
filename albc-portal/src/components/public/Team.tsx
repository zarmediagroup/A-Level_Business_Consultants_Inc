"use client";

import { Linkedin, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";

const team = [
  {
    name: "Principal Accountant",
    title: "Managing Director & Lead Accountant",
    bio: "A seasoned accounting professional with over 10 years of experience in tax, compliance, and financial advisory. Holds a BCom in Accounting and is a registered SARS Tax Practitioner.",
    specialisations: ["Tax Planning", "Financial Statements", "Business Advisory"],
    color: "from-[#0b1d3a] to-[#1a2f5e]",
  },
  {
    name: "Senior Bookkeeper",
    title: "Head of Bookkeeping & Payroll",
    bio: "Specialist in bookkeeping, payroll administration, and management accounts. Brings 7+ years of hands-on experience with businesses across retail, construction, and professional services sectors.",
    specialisations: ["Bookkeeping", "Payroll Processing", "Reconciliations"],
    color: "from-[#1a2f5e] to-[#2a3f6f]",
  },
  {
    name: "Tax Consultant",
    title: "Tax & Compliance Specialist",
    bio: "Dedicated tax consultant handling individual and corporate tax returns, provisional tax, and SARS correspondence. Specialises in VAT compliance and audit support.",
    specialisations: ["VAT Returns", "Income Tax", "SARS Audits"],
    color: "from-[#0b1d3a] to-[#1a2f5e]",
  },
  {
    name: "Business Analyst",
    title: "Business Registration & Secretarial",
    bio: "CIPC accredited specialist managing company registrations, amendments, and company secretarial services. Ensures clients remain fully compliant with the Companies Act.",
    specialisations: ["CIPC Registrations", "Company Secretarial", "Compliance"],
    color: "from-[#1a2f5e] to-[#2a3f6f]",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#0b1d3a]/5 border border-[#0b1d3a]/10 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1d3a] mb-6">
            The Professionals{" "}
            <span className="text-[#c9a84c]">Behind Your Success</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Our team of qualified accounting professionals brings decades of combined
            experience across tax, bookkeeping, payroll, and business advisory services.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-2xl overflow-hidden border border-slate-100 hover:border-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/5 transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              {/* Avatar area */}
              <div className={`bg-gradient-to-br ${member.color} p-8 flex flex-col items-center`}>
                <div className="w-20 h-20 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-[#c9a84c] font-bold text-xl">
                    {getInitials(member.name)}
                  </span>
                </div>
                <h3 className="text-white font-bold text-center text-sm leading-tight">
                  {member.name}
                </h3>
                <p className="text-[#c9a84c] text-xs text-center mt-1 font-medium">
                  {member.title}
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-500 text-xs leading-relaxed mb-5">{member.bio}</p>

                <div className="space-y-2 mb-6">
                  {member.specialisations.map((spec) => (
                    <div
                      key={spec}
                      className="inline-flex items-center gap-1.5 bg-[#0b1d3a]/5 rounded-full px-3 py-1 mr-1.5 mb-1"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#c9a84c]" />
                      <span className="text-[#0b1d3a] text-xs font-medium">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#c9a84c] transition-colors font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Contact
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#c9a84c] transition-colors font-medium"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#f8f9fc] rounded-2xl p-10 text-center border border-slate-100">
          <h3 className="text-2xl font-bold text-[#0b1d3a] mb-3">
            Ready to work with our team?
          </h3>
          <p className="text-slate-500 mb-6 text-sm">
            Get in touch today and let us show you what A-Level service really means.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-[#0b1d3a] hover:bg-[#1a2f5e] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
