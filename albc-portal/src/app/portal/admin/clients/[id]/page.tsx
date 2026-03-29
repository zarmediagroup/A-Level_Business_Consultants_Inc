import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Edit2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDate, formatDateTime, formatFileSize, getInitials, DOCUMENT_CATEGORIES, DOCUMENT_STATUS } from "@/lib/utils";
import ClientNotesPanel from "./ClientNotesPanel";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (isDemoMode()) {
    const demoClient = { id, full_name: "Sarah Mitchell", email: "sarah@smretail.co.za", phone: "+27 82 111 2222", company: "SM Retail Solutions", service_category: "Bookkeeping", role: "client" as const, is_active: true, created_at: new Date(Date.now() - 86400000 * 30).toISOString(), last_login: new Date(Date.now() - 3600000).toISOString() };
    const demoDocs = [
      { id: "1", client_id: id, file_name: "Bank_Statement_March_2026.pdf", file_type: "application/pdf", file_size: 245000, storage_path: "", category: "bank_statement", status: "under_review", uploaded_at: new Date().toISOString(), uploaded_by: id },
      { id: "2", client_id: id, file_name: "Invoice_INV-2026-003.pdf", file_type: "application/pdf", file_size: 112000, storage_path: "", category: "invoice", status: "received", uploaded_at: new Date(Date.now() - 86400000).toISOString(), uploaded_by: id },
    ];
    return <ClientProfilePageContent client={demoClient as never} documents={demoDocs as never} notes={[]} auditLogs={[]} adminId="demo-admin" />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const [{ data: client }, { data: documents }, { data: notes }, { data: auditLogs }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase
        .from("documents")
        .select("*")
        .eq("client_id", id)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("client_notes")
        .select("*, admin:profiles!admin_id(full_name)")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", id)
        .order("timestamp", { ascending: false })
        .limit(10),
    ]);

  if (!client) notFound();

  const { data: { user: adminUser } } = await supabase.auth.getUser();

  return <ClientProfilePageContent
    client={client as never}
    documents={documents as never}
    notes={notes as never}
    auditLogs={auditLogs as never}
    adminId={adminUser?.id ?? ""}
  />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClientProfilePageContent({ client, documents, notes, auditLogs, adminId }: { client: any; documents: any[]; notes: any[]; auditLogs: any[]; adminId: string }) {
  const getCategoryLabel = (value: string) =>
    DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  const getStatusInfo = (value: string) =>
    DOCUMENT_STATUS.find((s) => s.value === value) ?? { label: value, color: "" };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/portal/admin/clients"
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-600/50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{client.full_name}</h1>
          <p className="text-slate-500 text-sm">Client Profile</p>
        </div>
        <Link
          href={`/portal/admin/clients?edit=${client.id}`}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Client
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-700/15 border-2 border-blue-600/50 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-800 text-2xl font-bold">
                  {getInitials(client.full_name)}
                </span>
              </div>
              <h2 className="text-white font-bold text-lg">{client.full_name}</h2>
              {client.company && (
                <p className="text-slate-400 text-sm mt-1">{client.company}</p>
              )}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    client.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {client.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {client.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {[
                { icon: Mail, label: "Email", value: client.email },
                { icon: Phone, label: "Phone", value: client.phone ?? "—" },
                { icon: Building2, label: "Company", value: client.company ?? "—" },
                { icon: Briefcase, label: "Service", value: client.service_category ?? "—" },
                { icon: Calendar, label: "Member Since", value: formatDate(client.created_at) },
                { icon: Clock, label: "Last Login", value: client.last_login ? formatDateTime(client.last_login) : "Never" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-900/40" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">{item.label}</p>
                      <p className="text-slate-900 text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Document Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {DOCUMENT_STATUS.map((s) => {
                const count = (documents ?? []).filter((d) => d.status === s.value).length;
                return (
                  <div key={s.value} className={`rounded-xl p-3 ${s.color}`}>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          {auditLogs && auditLogs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900 text-xs font-medium capitalize">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-slate-400 text-xs">{formatDateTime(log.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Documents + Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-800" />
                <h2 className="font-bold text-slate-900">
                  Documents ({(documents ?? []).length})
                </h2>
              </div>
              <Link
                href={`/portal/admin/documents?client=${client.id}`}
                className="text-blue-800 text-xs font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["File Name", "Category", "Size", "Uploaded", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(documents ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center">
                        <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-slate-400 text-sm">No documents uploaded yet</p>
                      </td>
                    </tr>
                  ) : (
                    (documents ?? []).map((doc) => {
                      const statusInfo = getStatusInfo(doc.status);
                      return (
                        <tr key={doc.id} className="table-row-hover">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-300 flex-shrink-0" />
                              <span className="text-slate-900 text-sm font-medium truncate max-w-[160px]">
                                {doc.file_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-slate-500 text-xs">{getCategoryLabel(doc.category)}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-slate-400 text-xs">{formatFileSize(doc.file_size)}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-slate-400 text-xs">{formatDate(doc.uploaded_at)}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <a
                              href={`/api/documents/${doc.id}/download`}
                              className="text-blue-800 hover:text-blue-900 text-xs font-medium transition-colors"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <ClientNotesPanel
            clientId={client.id}
            adminId={adminId}
            initialNotes={notes ?? []}
          />
        </div>
      </div>
    </div>
  );
}
