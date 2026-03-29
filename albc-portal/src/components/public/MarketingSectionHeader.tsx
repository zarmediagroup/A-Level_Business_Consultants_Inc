import type { ReactNode } from "react";

interface MarketingSectionHeaderProps {
  kicker: string;
  title: ReactNode;
  description?: string;
  /** Use for alternating layout rhythm */
  align?: "center" | "left";
}

export function MarketingSectionHeader({
  kicker,
  title,
  description,
  align = "center",
}: MarketingSectionHeaderProps) {
  const wrap =
    align === "center"
      ? "text-center mx-auto max-w-2xl"
      : "max-w-xl";

  return (
    <header className={`mb-14 md:mb-20 ${wrap}`}>
      <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
        {kicker}
      </p>
      <div
        className={`mt-4 h-px w-10 bg-slate-900 ${align === "center" ? "mx-auto" : ""}`}
        aria-hidden
      />
      <h2 className="font-display mt-5 text-3xl font-normal text-slate-900 tracking-tight sm:text-[2.125rem] sm:leading-snug md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[15px] leading-[1.65] text-slate-600 md:text-base md:leading-relaxed">
          {description}
        </p>
      ) : null}
    </header>
  );
}
