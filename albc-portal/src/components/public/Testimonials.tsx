"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah M.",
    company: "SM Retail Solutions",
    role: "Owner & Director",
    rating: 5,
    text: "A-Level Business Consultants transformed the way I manage my finances. Before them, I was drowning in receipts and had no idea where my business stood. Now I have monthly management accounts, my tax is always on time, and I feel completely in control. Best decision I've made for my business.",
    service: "Bookkeeping & Tax",
  },
  {
    name: "David K.",
    company: "DK Construction Group",
    role: "Managing Director",
    rating: 5,
    text: "We've been with A-Level for 6 years now. Their attention to detail is exceptional — they picked up a VAT error from a previous accountant that saved us over R80,000. I wouldn't trust anyone else with our accounts. The client portal makes submitting documents incredibly easy.",
    service: "Tax & VAT Services",
  },
  {
    name: "Priya N.",
    company: "Naidoo Professional Services",
    role: "Managing Partner",
    rating: 5,
    text: "As a professional practice ourselves, we needed accountants who understood our specific needs. A-Level not only handles our bookkeeping and tax with precision but also advises us on business structuring. They're a true partner, not just a service provider.",
    service: "Business Advisory",
  },
  {
    name: "James O.",
    company: "JO Tech Innovations",
    role: "CEO & Co-Founder",
    rating: 5,
    text: "We came to A-Level when we needed to register our company and set up proper financial systems from scratch. They walked us through everything, got us SARS compliant, and set up payroll for our first 5 employees. Two years later, they're still our go-to for everything financial.",
    service: "Business Registration & Payroll",
  },
  {
    name: "Fatima A.",
    company: "Al-Baraka Trading",
    role: "Operations Director",
    rating: 5,
    text: "SARS came knocking with an audit and I was terrified. The team at A-Level handled everything — they communicated with SARS on our behalf, prepared all documentation, and resolved the audit without a single penalty. Their calmness and expertise under pressure is something I'll never forget.",
    service: "Audit Support",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-[#c9a84c] text-[#c9a84c]" : "text-slate-300"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-28 bg-gradient-to-br from-[#060d1a] to-[#0b1d3a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Clients{" "}
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Don't take our word for it — hear from the business owners who trust us
            with their most important financial decisions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="glass-card rounded-2xl p-10 md:p-14 relative">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-16 h-16 text-[#c9a84c]" />
            </div>

            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 border-2 border-[#c9a84c]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[#c9a84c] font-bold text-lg">
                  {getInitials(t.name)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <span className="text-[#c9a84c] text-xs font-medium bg-[#c9a84c]/10 px-2.5 py-1 rounded-full">
                    {t.service}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  {t.role} — {t.company}
                </p>
                <div className="mt-2">
                  <StarRating rating={t.rating} />
                </div>
              </div>
            </div>

            <p className="text-slate-200 text-lg leading-relaxed italic">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all duration-200 rounded-full ${
                      i === current
                        ? "w-8 h-2 bg-[#c9a84c]"
                        : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-[#c9a84c]/50 flex items-center justify-center text-slate-400 hover:text-[#c9a84c] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-[#c9a84c]/50 flex items-center justify-center text-slate-400 hover:text-[#c9a84c] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { value: "200+", label: "Happy Clients" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "98%", label: "Would Recommend" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl py-6 px-4">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
