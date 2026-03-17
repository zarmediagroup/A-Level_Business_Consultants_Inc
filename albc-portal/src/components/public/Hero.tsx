"use client";

import Link from "next/link";
import { ArrowRight, Shield, Award, TrendingUp, ChevronDown } from "lucide-react";

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "200+", label: "Clients Served" },
  { value: "98%", label: "Client Retention" },
  { value: "R50M+", label: "Tax Savings Delivered" },
];

export default function Hero() {
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060d1a]">
      {/* Background gradient layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1d3a] via-[#060d1a] to-[#060d1a]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1a2f5e]/40 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating accent elements */}
      <div className="absolute top-32 left-10 w-2 h-16 bg-gradient-to-b from-[#c9a84c] to-transparent rounded-full opacity-40" />
      <div className="absolute top-64 right-20 w-2 h-24 bg-gradient-to-b from-[#c9a84c] to-transparent rounded-full opacity-20" />
      <div className="absolute bottom-40 left-20 w-1 h-12 bg-gradient-to-b from-[#c9a84c] to-transparent rounded-full opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full px-4 py-2 mb-8">
              <Award className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">
                Professional Accounting Practice
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Financial Clarity.{" "}
              <span className="gradient-text">Business Growth.</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              A-Level Business Consultants Inc delivers expert accounting, tax, payroll,
              and business advisory services — empowering your business with precise
              financial solutions that drive measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8923c] text-[#0b1d3a] font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#c9a84c]/30 hover:-translate-y-0.5 text-sm"
              >
                Get a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/portal/login"
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#c9a84c]/40 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-sm"
              >
                <Shield className="w-4 h-4 text-[#c9a84c]" />
                Client Portal Access
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
              {[
                "SARS Registered Tax Practitioner",
                "CIPC Registered",
                "Fully Insured Practice",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  <span className="text-slate-500 text-xs font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats card */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              {/* Main card */}
              <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a07830] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Practice Overview</p>
                    <p className="text-slate-500 text-xs">Trusted by businesses since 2015</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 rounded-xl p-5 border border-white/5 hover:border-[#c9a84c]/20 transition-colors"
                    >
                      <div className="text-3xl font-bold gradient-text mb-1">
                        {stat.value}
                      </div>
                      <div className="text-slate-400 text-xs font-medium leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portal CTA inside card */}
                <div className="mt-6 bg-gradient-to-r from-[#c9a84c]/10 to-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">Existing Client?</p>
                    <p className="text-slate-400 text-xs">Access your secure document portal</p>
                  </div>
                  <Link
                    href="/portal/login"
                    className="bg-[#c9a84c] hover:bg-[#b8923c] text-[#0b1d3a] font-bold text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Log In →
                  </Link>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#c9a84c] text-[#0b1d3a] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse-gold">
                Secure &amp; Trusted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-[#c9a84c] transition-colors animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
