"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const linkFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 rounded-sm";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const linkClass = scrolled
    ? "text-slate-600 hover:text-slate-900"
    : "text-slate-300 hover:text-white";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background,border-color,box-shadow] duration-200",
        scrolled
          ? "border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(15,23,42,0.04)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            scrolled ? "focus-visible:outline-slate-900" : "focus-visible:outline-white"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center border transition-colors",
              scrolled
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-white/25 bg-white/5 text-white"
            )}
          >
            <span className="text-[11px] font-semibold tracking-tight">AL</span>
          </div>
          <div className="hidden min-[380px]:block">
            <div
              className={cn(
                "text-[13px] font-semibold leading-none tracking-tight",
                scrolled ? "text-slate-900" : "text-white"
              )}
            >
              A-Level Business
            </div>
            <div
              className={cn(
                "mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em]",
                scrolled ? "text-slate-500" : "text-slate-400"
              )}
            >
              Consultants
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNav(link.href)}
              className={cn(
                "px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
                linkClass,
                linkFocus
              )}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/portal/login"
            className={cn(
              "inline-flex items-center justify-center border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
              scrolled
                ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                : "border-white/40 bg-transparent text-white hover:bg-white/10",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            )}
          >
            Client login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "rounded-sm p-2 md:hidden",
            linkFocus,
            scrolled
              ? "text-slate-800 hover:bg-slate-100"
              : "text-white hover:bg-white/10"
          )}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t transition-[max-height,opacity] duration-200 md:hidden",
          scrolled ? "border-slate-200 bg-white" : "border-white/10 bg-slate-950",
          menuOpen ? "max-h-[22rem] opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="space-y-0 px-5 py-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNav(link.href)}
              className={cn(
                "block w-full border-b py-3 text-left text-[12px] font-medium uppercase tracking-[0.12em] last:border-0",
                scrolled
                  ? "border-slate-100 text-slate-700 hover:text-slate-900"
                  : "border-white/10 text-slate-200 hover:text-white"
              )}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3">
            <Link
              href="/portal/login"
              className={cn(
                "flex w-full items-center justify-center py-3 text-[11px] font-semibold uppercase tracking-[0.12em]",
                scrolled
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900"
              )}
              onClick={() => setMenuOpen(false)}
            >
              Client login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
