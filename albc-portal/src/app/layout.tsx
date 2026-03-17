import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
