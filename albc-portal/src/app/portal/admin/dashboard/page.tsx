import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import {
  Users, FileText, Clock, Bell, TrendingUp, AlertTriangle, CheckCircle2, Upload,
} from "lucide-react";
import { formatDateTime, formatDate, DOCUMENT_CATEGORIES, DOCUMENT_STATUS } from "@/lib/utils";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
interface UploadRow {
  id: string;
  file_name: string;
  category: string;
  status: string;
  uploaded_at: string;
  client: { full_name: string; company?: string } | null;
}
interface ClientRow {
  id: string;
  full_name: string;
  service_category?: string;
  is_active: boolean;
  created_at: string;
}
interface DashboardProps {
  totalClients: number;
  activeClients: number;
  totalDocs: number;
  pendingDocs: number;
  unreadNotifs: number;
  requiresActionCount: number;
  recentUploads: UploadRow[];
  recentClients: ClientRow[];
}

// ── Demo data ──────────────────────────────────────────────────────────────
const DEMO_UPLOADS: UploadRow[] = [
  { id: "1", file_name: "Bank_Statement_March_2026.pdf", category: "bank_statement", status: "received", uploaded_at: new Date().toISOString(), client: { full_name: "Sarah Mitchell", company: "SM Retail Solutions" } },
  { id: "2", file_name: "Invoice_INV-2026-003.pdf", category: "invoice", status: "under_review", uploaded_at: new Date(Date.now() - 86400000).toISOString(), client: { full_name: "David Khumalo", company: "DK Construction" } },
  { id: "3", file_name: "Tax_Certificate_2025.pdf", category: "tax_certificate", status: "processed", uploaded_at: new Date(Date.now() - 172800000).toISOString(), client: { full_name: "Priya Naidoo", company: "Naidoo Professional Services" } },
  { id: "4", file_name: "ID_Document_Copy.jpg", category: "id_document", status: "requires_action", uploaded_at: new Date(Date.now() - 259200000).toISOString(), client: { full_name: "James Okonkwo", company: "JO Tech Innovations" } },
  { id: "5", file_name: "Payslip_Feb_2026.pdf", category: "payslip", status: "received", uploaded_at: new Date(Date.now() - 345600000).toISOString(), client: { full_name: "Fatima Adams", company: "Al-Baraka Trading" } },
];
const DEMO_CLIENTS: ClientRow[] = [
  { id: "1", full_name: "Sarah Mitchell", service_category: "Bookkeeping", is_active: true, created_at: new Date().toISOString() },
  { id: "2", full_name: "David Khumalo", service_category: "Tax Returns", is_active: true, created_at: new Date().toISOString() },
  { id: "3", full_name: "Priya Naidoo", service_category: "Business Consulting", is_active: true, created_at: new Date().toISOString() },
  { id: "4", full_name: "James Okonkwo", service_category: "Payroll", is_active: true, created_at: new Date().toISOString() },
  { id: "5", full_name: "Fatima Adams", service_category: "VAT Returns", is_active: false, created_at: new Date().toISOString() },
];

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color, sub, href }: {
  title: string; value: number | string; icon: React.ElementType;
  color: string; sub?: string; href?: string;
}) {
  const content = (
    <div className={`border border-slate-200 bg-white p-6 transition-colors duration-150 hover:border-slate-300 ${href ? "cursor-pointer" : ""}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${color}`}>
          <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
        </div>
        {href && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            View all
          </span>
        )}
      </div>
      <div className="mb-1 font-display text-3xl font-normal tabular-nums text-slate-900">{value}</div>
      <div className="text-slate-500 text-sm font-medium">{title}</div>
      {sub && <div className="text-slate-400 text-xs mt-1">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// ── Dashboard UI ───────────────────────────────────────────────────────────
function AdminDashboardUI({
  totalClients, activeClients, totalDocs, pendingDocs,
  unreadNotifs, requiresActionCount, recentUploads, recentClients,
}: DashboardProps) {
  const getCategoryLabel = (v: string) => DOCUMENT_CATEGORIES.find((c) => c.value === v)?.label ?? v;
  const getStatusInfo = (v: string) => DOCUMENT_STATUS.find((s) => s.value === v) ?? { label: v, color: "" };

  const stats = [
    { title: "Total Clients", value: totalClients, icon: Users, color: "bg-gradient-to-br from-slate-900 to-slate-800", sub: `${activeClients} active`, href: "/portal/admin/clients" },
    { title: "Total Documents", value: totalDocs, icon: FileText, color: "bg-gradient-to-br from-slate-800 to-slate-700", href: "/portal/admin/documents" },
    { title: "Pending Review", value: pendingDocs, icon: Clock, color: "bg-gradient-to-br from-amber-500 to-amber-600", sub: "Require attention", href: "/portal/admin/documents?status=under_review" },
    { title: "Unread Alerts", value: unreadNotifs, icon: Bell, color: "bg-gradient-to-br from-blue-700 to-blue-900", href: "/portal/admin/notifications" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Demo banner */}
      {isDemoMode() && (
        <div className="mb-6 flex gap-3 border border-slate-200 bg-white p-4">
          <span className="shrink-0 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Demo
          </span>
          <p className="text-sm leading-snug text-slate-600">
            Data shown is illustrative. Add Supabase credentials in{" "}
            <code className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              .env.local
            </code>{" "}
            to connect your live environment.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/portal/admin/clients" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
          <Users className="w-4 h-4" />
          Add New Client
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Requires Action Banner */}
      {requiresActionCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-red-800 font-semibold text-sm">
              {requiresActionCount} document{requiresActionCount > 1 ? "s" : ""} require client action
            </p>
            <p className="text-red-600 text-xs mt-0.5">Review and notify affected clients as soon as possible.</p>
          </div>
          <Link href="/portal/admin/documents?status=requires_action" className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
            View Documents
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Uploads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-800" />
              <h2 className="font-bold text-slate-900">Recent Document Uploads</h2>
            </div>
            <Link href="/portal/admin/documents" className="text-blue-800 hover:text-blue-900 text-xs font-medium transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentUploads.length > 0 ? recentUploads.map((doc) => {
              const statusInfo = getStatusInfo(doc.status);
              return (
                <div key={doc.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/5 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-slate-900/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">{doc.file_name}</p>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">
                      {doc.client?.full_name ?? "Unknown"} · {getCategoryLabel(doc.category)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                    <p className="text-slate-400 text-xs mt-1">{formatDate(doc.uploaded_at)}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="px-6 py-12 text-center">
                <Upload className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Clients */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-800" />
                <h2 className="font-bold text-slate-900 text-sm">Recent Clients</h2>
              </div>
              <Link href="/portal/admin/clients" className="text-blue-800 text-xs font-medium">View all →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentClients.map((client) => (
                <Link key={client.id} href={`/portal/admin/clients/${client.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{client.full_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">{client.full_name}</p>
                    <p className="text-slate-400 text-xs truncate">{client.service_category ?? "No category"}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${client.is_active ? "bg-green-400" : "bg-red-400"}`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-800" />
              <h3 className="font-semibold text-sm">Practice Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Active clients", value: activeClients, icon: CheckCircle2, color: "text-green-400" },
                { label: "Pending reviews", value: pendingDocs, icon: Clock, color: "text-amber-400" },
                { label: "Needs action", value: requiresActionCount, icon: AlertTriangle, color: "text-red-400" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-slate-300 text-sm">{item.label}</span>
                    </div>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function AdminDashboard() {
  if (isDemoMode()) {
    return <AdminDashboardUI
      totalClients={12} activeClients={10} totalDocs={47} pendingDocs={8}
      unreadNotifs={3} requiresActionCount={1}
      recentUploads={DEMO_UPLOADS}
      recentClients={DEMO_CLIENTS}
    />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const [
    { count: totalClients },
    { count: activeClients },
    { count: totalDocs },
    { count: pendingDocs },
    { count: unreadNotifs },
    { data: recentUploads },
    { data: recentClients },
    { count: requiresAction },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client").eq("is_active", true),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "under_review"),
    supabase.from("notifications").select("*", { count: "exact", head: true }).eq("recipient_id", user.id).eq("read", false),
    supabase.from("documents").select("*, client:profiles!client_id(full_name, company)").order("uploaded_at", { ascending: false }).limit(6),
    supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false }).limit(5),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("status", "requires_action"),
  ]);

  return <AdminDashboardUI
    totalClients={totalClients ?? 0}
    activeClients={activeClients ?? 0}
    totalDocs={totalDocs ?? 0}
    pendingDocs={pendingDocs ?? 0}
    unreadNotifs={unreadNotifs ?? 0}
    requiresActionCount={requiresAction ?? 0}
    recentUploads={(recentUploads ?? []) as UploadRow[]}
    recentClients={(recentClients ?? []) as ClientRow[]}
  />;
}
