"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  formatDate,
  formatFileSize,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUS,
} from "@/lib/utils";
import type { Document } from "@/lib/types";

interface DocumentsPanelProps {
  initialDocuments: (Document & {
    client: { id: string; full_name: string; company?: string; email: string } | null;
  })[];
  clients: { id: string; full_name: string; company?: string }[];
}

export default function DocumentsPanel({ initialDocuments, clients }: DocumentsPanelProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.file_name.toLowerCase().includes(q) ||
        (d.client?.full_name ?? "").toLowerCase().includes(q);
      const matchClient = clientFilter === "all" || d.client_id === clientFilter;
      const matchCategory = categoryFilter === "all" || d.category === categoryFilter;
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return matchSearch && matchClient && matchCategory && matchStatus;
    });
  }, [documents, search, clientFilter, categoryFilter, statusFilter]);

  const getCategoryLabel = (value: string) =>
    DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  const getStatusInfo = (value: string) =>
    DOCUMENT_STATUS.find((s) => s.value === value) ?? { label: value, color: "" };

  const handleStatusChange = async (docId: string, newStatus: string) => {
    setUpdatingStatus(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d))
        );
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (docId: string, fileName: string) => {
    if (!confirm(`Permanently delete "${fileName}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1d3a]">Document Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            {documents.length} total documents across all clients
          </p>
        </div>
        {/* Status summary badges */}
        <div className="flex flex-wrap gap-2">
          {DOCUMENT_STATUS.map((s) => {
            const count = documents.filter((d) => d.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value === statusFilter ? "all" : s.value)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  statusFilter === s.value
                    ? "border-[#0b1d3a] bg-[#0b1d3a] text-white"
                    : `${s.color} border-transparent hover:border-current`
                }`}
              >
                {s.label}: {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by file name or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#c9a84c]/50 bg-white"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#c9a84c]/50 bg-white"
          >
            <option value="all">All Categories</option>
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#c9a84c]/50 bg-white"
          >
            <option value="all">All Status</option>
            {DOCUMENT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
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
                {["Document", "Client", "Category", "Size", "Uploaded", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No documents match your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => {
                  const statusInfo = getStatusInfo(doc.status);
                  return (
                    <tr key={doc.id} className="table-row-hover transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0b1d3a]/5 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#0b1d3a]/30" />
                          </div>
                          <span className="text-[#0b1d3a] text-sm font-semibold truncate max-w-[160px]">
                            {doc.file_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-[#0b1d3a] text-sm font-medium">
                            {doc.client?.full_name ?? "—"}
                          </p>
                          {doc.client?.company && (
                            <p className="text-slate-400 text-xs">{doc.client.company}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-sm">
                          {getCategoryLabel(doc.category)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm">
                          {formatDate(doc.uploaded_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex text-xs font-semibold px-2.5 py-1.5 rounded-full whitespace-nowrap ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                          {updatingStatus === doc.id ? (
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                          ) : (
                            <select
                              value={doc.status}
                              onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:border-[#c9a84c]/50"
                              title="Change status"
                            >
                              {DOCUMENT_STATUS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/documents/${doc.id}/download`}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#0b1d3a] hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc.id, doc.file_name)}
                            className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
            <p className="text-slate-400 text-xs">
              Showing {filtered.length} of {documents.length} documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
