"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react";
import { formatDate, formatDateTime, getInitials, SERVICE_CATEGORIES } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import ClientModal from "./ClientModal";

interface ClientsPanelProps {
  initialClients: (Profile & { document_count: number })[];
  adminId: string;
}

export default function ClientsPanel({ initialClients, adminId }: ClientsPanelProps) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Profile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && c.is_active) ||
        (statusFilter === "inactive" && !c.is_active);
      const matchCategory =
        categoryFilter === "all" || c.service_category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [clients, search, statusFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this client account? All their documents will be preserved.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients((prev) =>
          prev.map((c) => (c.id === id ? { ...c, is_active: false } : c))
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (client: Profile & { document_count?: number }) => {
    setClients((prev) => {
      const exists = prev.find((c) => c.id === client.id);
      if (exists) {
        return prev.map((c) => (c.id === client.id ? { ...c, ...client } : c));
      }
      return [{ ...client, document_count: 0 }, ...prev];
    });
    setShowModal(false);
    setEditingClient(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            {clients.length} total · {clients.filter((c) => c.is_active).length} active
          </p>
        </div>
        <button
          onClick={() => { setEditingClient(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800 placeholder-slate-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="all">All Services</option>
            {SERVICE_CATEGORIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Service
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Docs
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                  Last Login
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      {search || statusFilter !== "all" || categoryFilter !== "all"
                        ? "No clients match your filters"
                        : "No clients yet. Add your first client to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr key={client.id} className="table-row-hover transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {getInitials(client.full_name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-slate-900 font-semibold text-sm">{client.full_name}</p>
                          {client.company && (
                            <p className="text-slate-400 text-xs">{client.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[180px]">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center bg-slate-900/5 text-slate-900 text-xs font-medium px-3 py-1.5 rounded-full">
                        {client.service_category ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1 text-slate-600 text-sm font-semibold">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {(client as Profile & { document_count: number }).document_count}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <span className="text-slate-400 text-xs">
                        {client.last_login ? formatDateTime(client.last_login) : "Never"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                          client.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {client.is_active ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portal/admin/clients/${client.id}`}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => { setEditingClient(client); setShowModal(true); }}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-700 hover:text-slate-900 text-slate-500 flex items-center justify-center transition-colors"
                          title="Edit Client"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingId === client.id}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Deactivate"
                        >
                          {deletingId === client.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-slate-400 text-xs">
              Showing {filtered.length} of {clients.length} clients
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ClientModal
          client={editingClient}
          adminId={adminId}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
