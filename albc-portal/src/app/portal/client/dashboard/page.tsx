import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, FileText, Bell, AlertTriangle, ArrowRight } from "lucide-react";
import { formatDate, DOCUMENT_STATUS, DOCUMENT_CATEGORIES } from "@/lib/utils";

interface Doc {
  id: string; file_name: string; category: string; status: string;
  uploaded_at: string; client_id: string; file_size: number;
  file_type: string; storage_path: string; uploaded_by: string;
}
interface ProfileData {
  id: string; full_name: string; company?: string; service_category?: string;
  role: "admin" | "client"; is_active: boolean; email: string; created_at: string;
}
interface Notif { id: string; message: string; read: boolean; created_at: string; }

const DEMO_PROFILE: ProfileData = {
  id: "demo", full_name: "Demo Client", company: "Demo Business Pty Ltd",
  email: "demo@example.com", service_category: "Bookkeeping",
  role: "client", is_active: true, created_at: new Date().toISOString(),
};
const DEMO_DOCS: Doc[] = [
  { id: "1", file_name: "Bank_Statement_March_2026.pdf", category: "bank_statement", status: "under_review", uploaded_at: new Date().toISOString(), client_id: "demo", file_size: 245000, file_type: "application/pdf", storage_path: "", uploaded_by: "demo" },
  { id: "2", file_name: "Invoice_INV-2026-003.pdf", category: "invoice", status: "received", uploaded_at: new Date(Date.now() - 86400000).toISOString(), client_id: "demo", file_size: 112000, file_type: "application/pdf", storage_path: "", uploaded_by: "demo" },
  { id: "3", file_name: "Tax_Certificate_2025.pdf", category: "tax_certificate", status: "processed", uploaded_at: new Date(Date.now() - 172800000).toISOString(), client_id: "demo", file_size: 89000, file_type: "application/pdf", storage_path: "", uploaded_by: "demo" },
];
const DEMO_NOTIFICATIONS: Notif[] = [
  { id: "1", message: "Your Bank_Statement_March_2026.pdf is now under review.", read: false, created_at: new Date().toISOString() },
];

function ClientDashboardUI({ profile, docs, notifications, isDemo }: {
  profile: ProfileData; docs: Doc[]; notifications: Notif[]; isDemo?: boolean;
}) {
  const getCategoryLabel = (v: string) => DOCUMENT_CATEGORIES.find((c) => c.value === v)?.label ?? v;
  const getStatusInfo = (v: string) => DOCUMENT_STATUS.find((s) => s.value === v) ?? { label: v, color: "" };
  const statusCounts = DOCUMENT_STATUS.map((s) => ({ ...s, count: docs.filter((d) => d.status === s.value).length }));
  const requiresActionDocs = docs.filter((d) => d.status === "requires_action");

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Demo banner */}
      {isDemo && (
        <div className="mb-6 flex gap-3 border border-slate-200 bg-white p-4">
          <span className="shrink-0 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Demo
          </span>
          <p className="text-sm leading-snug text-slate-600">
            Sample dashboard. Configure Supabase in{" "}
            <code className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-800">
              .env.local
            </code>{" "}
            for your live data.
          </p>
        </div>
      )}

      {/* Welcome header */}
      <div className="mb-8">
        <div className="relative overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-7 text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-700/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-blue-200/90 text-sm font-medium mb-2">Welcome back,</p>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            {profile.company && <p className="text-slate-400 text-sm mt-1">{profile.company}</p>}
            <p className="text-slate-400 text-xs mt-3">
              {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Unread notifications */}
      {notifications.length > 0 && (
        <div className="mb-6 flex items-center gap-4 border border-slate-200 bg-slate-50 p-4">
          <Bell className="h-5 w-5 shrink-0 text-slate-600" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-slate-900 text-sm font-semibold">
              {notifications.length} new notification{notifications.length > 1 ? "s" : ""}
            </p>
            <p className="text-slate-600 text-xs mt-0.5">{notifications[0]?.message}</p>
          </div>
          <Link
            href="/portal/client/notifications"
            className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600 hover:text-slate-900"
          >
            View all
          </Link>
        </div>
      )}

      {/* Requires action */}
      {requiresActionDocs.length > 0 && (
        <div className="mb-6 flex items-center gap-4 border border-red-200 bg-red-50/80 p-4">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 text-sm font-semibold">Action Required</p>
            <p className="text-red-600 text-xs mt-0.5">{requiresActionDocs.length} document(s) require your attention. Contact your accountant.</p>
          </div>
          <Link href="/portal/client/documents" className="bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">View</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border border-slate-200 bg-white p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-to-br from-slate-900 to-slate-800">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{docs.length}</div>
          <div className="text-slate-500 text-sm">Total Documents</div>
        </div>
        {statusCounts.slice(0, 3).map((s) => (
          <div key={s.value} className="border border-slate-200 bg-white p-5">
            <div className={`inline-flex text-xs font-semibold px-2.5 py-1.5 rounded-full ${s.color} mb-3`}>{s.label}</div>
            <div className="text-2xl font-bold text-slate-900">{s.count}</div>
            <div className="text-slate-500 text-sm">Documents</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent documents */}
        <div className="overflow-hidden border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-700" strokeWidth={1.75} />
              <h2 className="font-bold text-slate-900">Recent Documents</h2>
            </div>
            <Link
              href="/portal/client/documents"
              className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 hover:text-slate-800"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {docs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Upload className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-4">No documents uploaded yet</p>
                <Link
                  href="/portal/client/upload"
                  className="inline-flex items-center gap-2 border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Upload className="w-4 h-4" />Upload your first document
                </Link>
              </div>
            ) : docs.slice(0, 6).map((doc) => {
              const statusInfo = getStatusInfo(doc.status);
              return (
                <div key={doc.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/5 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-slate-900/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-semibold truncate">{doc.file_name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{getCategoryLabel(doc.category)} · {formatDate(doc.uploaded_at)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full flex-shrink-0 ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900">Quick Actions</h2>
          <Link
            href="/portal/client/upload"
            className="group flex items-center justify-between border border-slate-900 bg-slate-900 p-5 text-white transition-colors hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10">
                <Upload className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-sm">Upload Document</p>
                <p className="text-slate-400 text-xs">Submit files securely</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/portal/client/documents"
            className="group flex items-center justify-between border border-slate-200 bg-white p-5 text-slate-900 transition-colors hover:border-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-900/50" />
              </div>
              <div>
                <p className="font-semibold text-sm">My Documents</p>
                <p className="text-slate-400 text-xs">View upload history</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Service Type</p>
                <p className="text-slate-900 font-medium">{profile.service_category ?? "Contact us"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Account Manager</p>
                <p className="text-slate-900 font-medium">A-Level Business Consultants</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Support Email</p>
                <a
                  href="mailto:info@albc.co.za"
                  className="font-medium text-slate-900 underline underline-offset-2 hover:no-underline"
                >
                  info@albc.co.za
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ClientDashboard() {
  if (isDemoMode()) {
    return <ClientDashboardUI profile={DEMO_PROFILE} docs={DEMO_DOCS} notifications={DEMO_NOTIFICATIONS} isDemo />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/portal/login");

  const [{ data: documents }, { data: notifications }] = await Promise.all([
    supabase.from("documents").select("*").eq("client_id", user.id).order("uploaded_at", { ascending: false }),
    supabase.from("notifications").select("*").eq("recipient_id", user.id).eq("read", false).order("created_at", { ascending: false }).limit(5),
  ]);

  return <ClientDashboardUI
    profile={profile as ProfileData}
    docs={(documents ?? []) as Doc[]}
    notifications={(notifications ?? []) as Notif[]}
  />;
}
