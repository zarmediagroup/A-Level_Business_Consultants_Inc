import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import {
  ClipboardList,
  LogIn,
  Upload,
  Edit2,
  Trash2,
  RefreshCw,
  User,
  Settings,
} from "lucide-react";

const actionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  login: { icon: LogIn, color: "text-green-600", label: "Login" },
  logout: { icon: LogIn, color: "text-slate-400", label: "Logout" },
  document_upload: { icon: Upload, color: "text-blue-600", label: "Document Uploaded" },
  document_delete: { icon: Trash2, color: "text-red-500", label: "Document Deleted" },
  document_status_change: { icon: RefreshCw, color: "text-amber-600", label: "Status Changed" },
  client_created: { icon: User, color: "text-green-600", label: "Client Created" },
  client_updated: { icon: Edit2, color: "text-blue-600", label: "Client Updated" },
  client_deleted: { icon: Trash2, color: "text-red-500", label: "Client Deactivated" },
  settings_updated: { icon: Settings, color: "text-purple-600", label: "Settings Updated" },
};

import { isDemoMode } from "@/lib/demo-mode";

const DEMO_LOGS = [
  { id: "1", user_id: "1", action: "login", entity_type: "auth", timestamp: new Date().toISOString(), user: { full_name: "Sarah Mitchell", email: "sarah@smretail.co.za", role: "client" } },
  { id: "2", user_id: "1", action: "document_upload", entity_type: "document", timestamp: new Date(Date.now() - 3600000).toISOString(), details: { file_name: "Bank_Statement_March_2026.pdf" }, user: { full_name: "Sarah Mitchell", email: "sarah@smretail.co.za", role: "client" } },
  { id: "3", user_id: "admin", action: "document_status_change", entity_type: "document", timestamp: new Date(Date.now() - 7200000).toISOString(), details: { new_status: "under_review" }, user: { full_name: "Demo Admin", email: "admin@albc.co.za", role: "admin" } },
  { id: "4", user_id: "2", action: "login", entity_type: "auth", timestamp: new Date(Date.now() - 86400000).toISOString(), user: { full_name: "David Khumalo", email: "david@dkconstruction.co.za", role: "client" } },
  { id: "5", user_id: "admin", action: "client_created", entity_type: "profile", timestamp: new Date(Date.now() - 172800000).toISOString(), details: { email: "priya@naidoopro.co.za" }, user: { full_name: "Demo Admin", email: "admin@albc.co.za", role: "admin" } },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuditLogPageContent({ logs }: { logs: any[] }) {
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
        <p className="text-slate-500 text-sm mt-1">
          Immutable record of all portal activity — {(logs ?? []).length} entries
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <ClipboardList className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-amber-800 text-sm">
          <strong>Audit logs are immutable.</strong> All entries are system-generated and cannot be edited or deleted.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Timestamp", "Action", "User", "Entity", "Details"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(logs ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <ClipboardList className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No audit log entries yet</p>
                  </td>
                </tr>
              ) : (
                (logs ?? []).map((log) => {
                  const config = actionConfig[log.action] ?? {
                    icon: Settings,
                    color: "text-slate-500",
                    label: log.action,
                  };
                  const Icon = config.icon;
                  const logUser = log.user as { full_name: string; email: string; role: string } | null;

                  return (
                    <tr key={log.id} className="table-row-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-500 text-sm font-mono">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${config.color}`} />
                          <span className="text-slate-900 text-sm font-medium">
                            {config.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {logUser ? (
                          <div>
                            <p className="text-slate-900 text-sm font-medium">{logUser.full_name}</p>
                            <p className="text-slate-400 text-xs capitalize">{logUser.role}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-sm capitalize">
                          {log.entity_type?.replace(/_/g, " ") ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.details ? (
                          <span className="text-slate-400 text-xs font-mono bg-slate-50 px-2 py-1 rounded">
                            {JSON.stringify(log.details).slice(0, 80)}
                            {JSON.stringify(log.details).length > 80 ? "..." : ""}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {(logs ?? []).length > 0 && (
          <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-slate-400 text-xs">
              Showing {Math.min(200, (logs ?? []).length)} most recent entries
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AuditLogPage() {
  if (isDemoMode()) {
    return <AuditLogPageContent logs={DEMO_LOGS} />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, user:profiles!user_id(full_name, email, role)")
    .order("timestamp", { ascending: false })
    .limit(200);

  return <AuditLogPageContent logs={logs ?? []} />;
}
