"use client";

import { CheckCircle2, Target, Eye, Heart } from "lucide-react";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Figures, filings, and reports handled with consistent rigour and documented review.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Agreed scope, predictable fees, and plain-language explanations — before you commit.",
  },
  {
    icon: Heart,
    title: "Partnership",
    description:
      "We learn how your business works so guidance is forward-looking, not only reactive.",
  },
];

const highlights = [
  "Registered with SARS as Tax Practitioners",
  "CIPC accredited for company registrations",
  "Comprehensive professional indemnity insurance",
  "Dedicated account manager for every client",
  "Strict confidentiality and data protection",
  "Predictable turnaround on engagements",
];

export default function About() {
  return (
    <section id="about" className="border-t border-slate-200/80 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <MarketingSectionHeader
          kicker="About"
          title={
            <>
              A practice built on <span className="text-slate-600">trust and discipline</span>
            </>
          }
          description="South African businesses engage us for the same technical standard you would expect from a larger firm — with direct partner access and a single point of accountability."
        />

        <div className="mb-20 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-display text-xl font-normal text-slate-900 md:text-2xl">
              Ten years of consistent delivery
            </h3>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.65] text-slate-600">
              <p>
                Since 2015 we have supported entrepreneurs, SMEs, and established companies
                nationwide. Technical depth matters, but so does judgment under deadlines —
                we staff engagements accordingly.
              </p>
              <p>
                Your accounts represent more than compliance: they reflect years of work. We
                treat that seriously, from bookkeeping through to tax and structuring.
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="border border-slate-200 bg-slate-50/50 p-8 md:p-9">
            <blockquote className="border-l-2 border-slate-900 pl-5 text-[15px] leading-[1.65] text-slate-700">
              To be the financial partner our clients call first — for compliance, for
              planning, and when something unexpected lands on their desk.
            </blockquote>
            <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-8">
              <div className="flex h-10 w-10 items-center justify-center border border-slate-300 bg-white text-xs font-semibold text-slate-800">
                AL
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">A-Level Business Consultants Inc</p>
                <p className="text-xs text-slate-500">Practice standard</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8 text-center">
              {[
                { n: "2015", l: "Founded" },
                { n: "30+", l: "Services" },
                { n: "100%", l: "Compliance" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-lg font-normal tabular-nums text-slate-900">{s.n}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div>
          <h3 className="font-display mb-10 text-center text-xl font-normal text-slate-900 md:text-2xl">
            How we work with clients
          </h3>
          <div className="grid gap-px bg-slate-200 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white p-8 transition-colors md:p-9 md:hover:bg-slate-50/80"
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center border border-slate-200 bg-white">
                    <Icon className="h-4 w-4 text-slate-700" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-[15px] font-semibold text-slate-900">{value.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
