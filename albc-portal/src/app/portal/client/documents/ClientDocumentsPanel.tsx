"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FileText, Search, Upload, Download, Filter, MessageSquare } from "lucide-react";
import {
  formatDate,
  formatFileSize,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUS,
  DOCUMENT_FOLDERS,
} from "@/lib/utils";
import type { Document } from "@/lib/types";

interface ClientDocumentsPanelProps {
  initialDocuments: Document[];
}

export default function ClientDocumentsPanel({ initialDocuments }: ClientDocumentsPanelProps) {
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return initialDocuments.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !search || d.file_name.toLowerCase().includes(q);
      const matchFolder = folderFilter === "all" || (d.folder ?? "General") === folderFilter;
      const matchCategory = categoryFilter === "all" || d.category === categoryFilter;
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return matchSearch && matchFolder && matchCategory && matchStatus;
    });
  }, [initialDocuments, search, folderFilter, categoryFilter, statusFilter]);

  const getCategoryLabel = (value: string) =>
    DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
  const getFolderLabel = (value?: string) => value ?? "General";

  const getStatusInfo = (value: string) =>
    DOCUMENT_STATUS.find((s) => s.value === value) ?? { label: value, color: "" };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1d3a]">My Documents</h1>
          <p className="text-slate-500 text-sm mt-1">
            {initialDocuments.length} document{initialDocuments.length !== 1 ? "s" : ""} in your secure vault
          </p>
        </div>
        <Link
          href="/portal/client/upload"
          className="flex items-center gap-2 bg-[#0b1d3a] hover:bg-[#1a2f5e] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </Link>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {DOCUMENT_STATUS.map((s) => {
          const count = initialDocuments.filter((d) => d.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value === statusFilter ? "all" : s.value)}
              className={`rounded-xl p-4 text-left transition-all ${
                statusFilter === s.value ? "ring-2 ring-[#0b1d3a] ring-offset-1" : ""
              } ${s.color}`}
            >
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs mt-0.5 font-medium opacity-80">{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#c9a84c]/50 focus:ring-2 focus:ring-[#c9a84c]/10 text-slate-800"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none bg-white"
          >
            <option value="all">All Folders</option>
            {DOCUMENT_FOLDERS.map((folder) => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Document", "Folder", "Category", "Size", "Uploaded", "Status", ""].map((h) => (
                  <th key={h || "action"} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                    <p className="text-slate-400 text-sm mb-4">
                      {search || categoryFilter !== "all" || statusFilter !== "all"
                        ? "No documents match your filters"
                        : "No documents yet. Upload your first document!"}
                    </p>
                    {!search && categoryFilter === "all" && statusFilter === "all" && (
                      <Link
                        href="/portal/client/upload"
                        className="inline-flex items-center gap-2 bg-[#0b1d3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Now
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => {
                  const statusInfo = getStatusInfo(doc.status);
                  return (
                    <tr key={doc.id} className="table-row-hover">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0b1d3a]/5 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#0b1d3a]/30" />
                          </div>
                          <span className="text-[#0b1d3a] text-sm font-semibold truncate max-w-[180px]">
                            {doc.file_name}
                          </span>
                        </div>
                        {doc.notes && (
                          <div className="mt-1 flex items-start gap-1.5 text-amber-700 text-xs">
                            <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{doc.notes}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-sm">{getFolderLabel(doc.folder)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-500 text-sm">{getCategoryLabel(doc.category)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm">{formatFileSize(doc.file_size)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-slate-400 text-sm">{formatDate(doc.uploaded_at)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#0b1d3a] hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
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
              Showing {filtered.length} of {initialDocuments.length} documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
