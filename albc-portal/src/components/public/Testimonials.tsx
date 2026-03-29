"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { MarketingSectionHeader } from "./MarketingSectionHeader";

const testimonials = [
  {
    name: "Sarah M.",
    company: "SM Retail Solutions",
    role: "Owner & Director",
    rating: 5,
    text: "A-Level transformed how I manage my finances. I now have monthly management accounts, tax filed on time, and real visibility — the best decision for my business.",
    service: "Bookkeeping & tax",
  },
  {
    name: "David K.",
    company: "DK Construction Group",
    role: "Managing Director",
    rating: 5,
    text: "Six years with A-Level. Their attention to detail caught a VAT issue that saved us over R80,000. The client portal makes document submission straightforward.",
    service: "Tax & VAT",
  },
  {
    name: "Priya N.",
    company: "Naidoo Professional Services",
    role: "Managing Partner",
    rating: 5,
    text: "As a practice ourselves, we needed accountants who understood our context. A-Level delivers precision and structuring advice — not generic compliance-only work.",
    service: "Business advisory",
  },
  {
    name: "James O.",
    company: "JO Tech Innovations",
    role: "CEO & Co-Founder",
    rating: 5,
    text: "They registered our company, set up financial systems, and payroll for our first hires. Two years on, they remain our financial partner.",
    service: "Registration & payroll",
  },
  {
    name: "Fatima A.",
    company: "Al-Baraka Trading",
    role: "Operations Director",
    rating: 5,
    text: "When SARS audited us, A-Level handled SARS liaison and documentation. Resolved without penalties — calm and professional throughout.",
    service: "Audit support",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-slate-800 text-slate-800" : "fill-transparent text-slate-300"}`}
          strokeWidth={1.25}
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
    <section id="testimonials" className="border-t border-slate-200/80 bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <MarketingSectionHeader
          kicker="References"
          title={
            <>
              What clients <span className="text-slate-600">report back</span>
            </>
          }
          description="Names and companies are abbreviated where clients prefer privacy. Ratings reflect voluntary feedback, not paid endorsements."
        />

        <div className="mx-auto max-w-3xl">
          <figure className="border border-slate-200 bg-white p-8 md:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                {getInitials(t.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <figcaption className="text-[15px] font-semibold text-slate-900">{t.name}</figcaption>
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    {t.service}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {t.role}, {t.company}
                </p>
                <div className="mt-3">
                  <StarRating rating={t.rating} />
                </div>
                <blockquote className="mt-6 text-[15px] leading-[1.65] text-slate-700">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 transition-all ${
                      i === current ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                    aria-current={i === current}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </figure>

          <dl className="mt-8 grid grid-cols-3 gap-px border border-slate-200 bg-slate-200 text-center">
            {[
              { value: "200+", label: "Relationships" },
              { value: "4.9", label: "Avg. rating" },
              { value: "98%", label: "Recommend" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-3 py-5">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-xl font-normal tabular-nums text-slate-900 md:text-2xl">
                  {stat.value}
                </dd>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
