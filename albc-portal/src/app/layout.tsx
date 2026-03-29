import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A-Level Business Consultants Inc | Professional Accounting & Business Advisory",
  description:
    "A-Level Business Consultants Inc provides expert accounting, tax, payroll, and business advisory services. Empowering businesses with precise financial solutions.",
  keywords: [
    "accounting",
    "business consultants",
    "tax services",
    "payroll",
    "bookkeeping",
    "financial statements",
    "VAT returns",
    "South Africa",
  ],
  openGraph: {
    title: "A-Level Business Consultants Inc",
    description: "Professional Accounting & Business Advisory Services",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexSans.variable} ${sourceSerif.variable}`}>
      <body className="antialiased text-slate-900 bg-white text-[15px] leading-normal">
        {children}
      </body>
    </html>
  );
}
