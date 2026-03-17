"use client";

import { CheckCircle2, Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Every figure, every filing, every report — executed with meticulous attention to detail and zero tolerance for error.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear, honest communication. No hidden fees, no jargon — just straightforward advice you can trust.",
  },
  {
    icon: Heart,
    title: "Partnership",
    description:
      "We invest in understanding your business so we can provide proactive guidance, not just reactive compliance.",
  },
];

const highlights = [
  "Registered with SARS as Tax Practitioners",
  "CIPC accredited for company registrations",
  "Comprehensive professional indemnity insurance",
  "Dedicated account manager for every client",
  "Strict client confidentiality and data protection",
  "Rapid turnaround on all engagements",
];

export default function About() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#0b1d3a]/5 border border-[#0b1d3a]/10 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              About Our Practice
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0b1d3a] mb-6">
            Built on Trust.{" "}
            <span className="text-[#c9a84c]">Driven by Excellence.</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            A-Level Business Consultants Inc was founded with a singular purpose: to give
            South African businesses access to the same calibre of financial expertise
            previously reserved for large corporations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Story */}
          <div>
            <h3 className="text-2xl font-bold text-[#0b1d3a] mb-6">
              A Decade of Delivering Results
            </h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Founded in 2015, A-Level Business Consultants Inc has grown from a
                boutique practice into a trusted partner for entrepreneurs, SMEs, and
                established businesses across South Africa. Our team combines deep
                technical expertise with genuine care for our clients' financial wellbeing.
              </p>
              <p>
                We understand that behind every set of accounts is a business owner
                working hard to build something meaningful. Our role is to protect,
                optimise, and grow what you've built — ensuring your finances are always
                in order so you can focus on what you do best.
              </p>
              <p>
                From day-to-day bookkeeping to complex tax structuring, we provide
                end-to-end financial management that gives you clarity, compliance,
                and confidence.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e] rounded-2xl p-8 text-white">
              <div className="gold-divider mb-8" />
              <blockquote className="text-lg leading-relaxed text-slate-200 mb-8 italic">
                &ldquo;Our mission is simple: to be the most trusted financial partner for
                every business we serve — delivering expertise, integrity, and results
                that make a measurable difference to your bottom line.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c] flex items-center justify-center">
                  <span className="text-[#c9a84c] font-bold text-sm">AL</span>
                </div>
                <div>
                  <p className="font-semibold text-white">A-Level Business Consultants Inc</p>
                  <p className="text-slate-400 text-sm">Founding Principle</p>
                </div>
              </div>
              <div className="gold-divider mt-8" />

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  { n: "2015", l: "Established" },
                  { n: "30+", l: "Service Lines" },
                  { n: "100%", l: "Compliance Rate" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-2xl font-bold text-[#c9a84c]">{s.n}</div>
                    <div className="text-slate-400 text-xs mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-2xl font-bold text-[#0b1d3a] text-center mb-12">
            Our Core Values
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group p-8 rounded-2xl border border-slate-100 hover:border-[#c9a84c]/30 hover:shadow-lg hover:shadow-[#c9a84c]/5 transition-all duration-300 bg-white"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0b1d3a] to-[#1a2f5e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-[#c9a84c]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0b1d3a] mb-3">{value.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
