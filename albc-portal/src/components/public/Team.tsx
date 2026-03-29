"use client";

import { Linkedin, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const team = [
  {
    name: "Principal Accountant",
    title: "Managing Director & Lead Accountant",
    bio: "Seasoned professional with 10+ years in tax, compliance, and advisory. BCom Accounting; registered SARS Tax Practitioner.",
    specialisations: ["Tax planning", "Financial statements", "Business advisory"],
  },
  {
    name: "Senior Bookkeeper",
    title: "Head of Bookkeeping & Payroll",
    bio: "Specialist in bookkeeping, payroll, and management accounts across retail, construction, and professional services.",
    specialisations: ["Bookkeeping", "Payroll", "Reconciliations"],
  },
  {
    name: "Tax Consultant",
    title: "Tax & Compliance Specialist",
    bio: "Individual and corporate tax, provisional tax, and SARS correspondence — with strong VAT and audit-support experience.",
    specialisations: ["VAT returns", "Income tax", "SARS audits"],
  },
  {
    name: "Business Analyst",
    title: "Business Registration & Secretarial",
    bio: "CIPC-accredited specialist for registrations, amendments, and company secretarial compliance.",
    specialisations: ["CIPC", "Company secretarial", "Compliance"],
  },
];

export default function Team() {
  return (
    <section id="team" className="border-t border-slate-200/80 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <MarketingSectionHeader
          kicker="People"
          title={
            <>
              Who you work with <span className="text-slate-600">on the file</span>
            </>
          }
          description="Every engagement is led by qualified staff. You are not routed through a call centre — you have named contacts and defined responsibilities."
        />

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="flex flex-col bg-white p-7 transition-colors md:p-8 md:hover:bg-slate-50/80"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800">
                {getInitials(member.name)}
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{member.title}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{member.bio}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {member.specialisations.map((spec) => (
                  <li
                    key={spec}
                    className="border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-slate-600"
                  >
                    {spec}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-5 border-t border-slate-100 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Contact
                </a>
                <a href="#" className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900">
                  <Linkedin className="h-3.5 w-3.5" strokeWidth={1.75} />
                  LinkedIn
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-slate-200 bg-slate-50/50 px-8 py-10 text-center md:px-12">
          <h3 className="font-display text-xl font-normal text-slate-900 md:text-2xl">
            Next step
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Send a short note about your business. We reply with who would own your file and what we need to quote.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 inline-flex h-11 items-center justify-center border border-slate-900 bg-slate-900 px-8 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-slate-800"
          >
            Start an enquiry
          </a>
        </div>
      </div>
    </section>
  );
}
