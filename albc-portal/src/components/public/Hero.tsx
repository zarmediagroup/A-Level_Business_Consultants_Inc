"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

const stats = [
  { value: "10+", label: "Years" },
  { value: "200+", label: "Clients" },
  { value: "98%", label: "Retention" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(30,58,138,0.15),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-[5.5rem] lg:px-8 lg:pb-28 lg:pt-[6.5rem]">
        <div className="max-w-3xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Accounting · Tax · Advisory
          </p>

          <h1 className="font-display mt-6 text-[2.125rem] font-normal leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
            Clear financial records, compliant filings, and advice you can act on.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-[1.65] text-slate-400 md:text-base md:leading-relaxed">
            South African businesses work with us for disciplined bookkeeping, tax, payroll,
            and structuring — delivered with direct access to experienced professionals.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex h-11 items-center justify-center gap-2 bg-white px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Schedule a call
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
            <Link
              href="/portal/login"
              className="inline-flex h-11 items-center justify-center gap-2 border border-white/20 bg-transparent px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-white/35 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Shield className="h-3.5 w-3.5 opacity-80" strokeWidth={2} />
              Client portal
            </Link>
          </div>

          <dl className="mt-14 flex flex-wrap gap-y-6 border-t border-white/10 pt-10">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={
                  i === 0
                    ? "min-w-[5.5rem] pr-8 sm:pr-12"
                    : "min-w-[5.5rem] border-l border-white/10 pl-8 sm:pl-12"
                }
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex flex-col gap-1">
                  <span className="font-display text-2xl font-normal tabular-nums text-white sm:text-[1.75rem]">
                    {s.value}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-slate-500">
            {["SARS-registered tax practitioner", "CIPC registered", "Professional indemnity"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-px w-3 bg-slate-600" aria-hidden />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
