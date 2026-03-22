import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const DOCUMENT_CATEGORIES = [
  { value: "bank_statement", label: "Bank Statement" },
  { value: "invoice", label: "Invoice" },
  { value: "tax_certificate", label: "Tax Certificate" },
  { value: "id_document", label: "ID Document" },
  { value: "financial_statement", label: "Financial Statement" },
  { value: "payslip", label: "Payslip" },
  { value: "contract", label: "Contract" },
  { value: "other", label: "Other" },
] as const;

export const DOCUMENT_STATUS = [
  { value: "received", label: "Received", color: "badge-received" },
  { value: "under_review", label: "Under Review", color: "badge-under-review" },
  { value: "processed", label: "Processed", color: "badge-processed" },
  { value: "requires_action", label: "Requires Action", color: "badge-requires-action" },
] as const;

export const DOCUMENT_FOLDERS = [
  "General",
  "Monthly Bank Statements",
  "Invoices",
  "Tax Documents",
  "Identity Documents",
  "Payroll Documents",
  "Contracts",
] as const;

export const SERVICE_CATEGORIES = [
  "Bookkeeping",
  "Tax Returns",
  "Payroll",
  "Business Registration",
  "Financial Statements",
  "VAT Returns",
  "Company Secretarial",
  "Business Consulting",
  "Audit Support",
  "Other",
];

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]["value"];
export type DocumentStatus = typeof DOCUMENT_STATUS[number]["value"];
