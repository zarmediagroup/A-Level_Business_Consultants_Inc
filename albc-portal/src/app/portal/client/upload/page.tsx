"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { DOCUMENT_CATEGORIES, formatFileSize } from "@/lib/utils";
import Link from "next/link";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

interface UploadFile {
  file: File;
  id: string;
  category: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const onDrop = useCallback((accepted: File[], rejected: { file: File }[]) => {
    const newFiles: UploadFile[] = accepted.map((f) => ({
      file: f,
      id: Math.random().toString(36).slice(2),
      category: "other",
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    if (rejected.length > 0) {
      alert(`${rejected.length} file(s) rejected. Only PDF, Word, Excel, and images up to 25MB are accepted.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateCategory = (id: string, category: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, category } : f))
    );
  };

  const handleUpload = async () => {
    const pending = files.filter((f) => f.status === "pending");
    if (pending.length === 0) return;

    setUploading(true);

    for (const uf of pending) {
      setFiles((prev) =>
        prev.map((f) => (f.id === uf.id ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", uf.file);
        formData.append("category", uf.category);

        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          setFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, status: "success" } : f))
          );
        } else {
          const data = await res.json();
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uf.id
                ? { ...f, status: "error", error: data.error ?? "Upload failed" }
                : f
            )
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uf.id ? { ...f, status: "error", error: "Network error" } : f
          )
        );
      }
    }

    setUploading(false);
    const updated = files.map((f) =>
      pending.find((p) => p.id === f.id) ? { ...f, status: "success" as const } : f
    );
    if (updated.every((f) => f.status === "success")) {
      setAllDone(true);
    }
  };

  if (allDone) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0b1d3a] mb-3">
            Documents Submitted!
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Your documents have been securely uploaded and your accountant has been notified.
            You can track their status in your documents vault.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/portal/client/documents"
              className="bg-[#0b1d3a] hover:bg-[#1a2f5e] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              View My Documents
            </Link>
            <button
              onClick={() => { setFiles([]); setAllDone(false); }}
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Upload More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1d3a]">Upload Documents</h1>
        <p className="text-slate-500 text-sm mt-1">
          Securely upload your financial documents. Accepted: PDF, Word, Excel, JPEG, PNG (max 25MB each)
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 mb-6 ${
          isDragActive
            ? "drop-zone-active border-[#c9a84c]"
            : "border-slate-200 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/2"
        }`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-2xl bg-[#0b1d3a]/5 flex items-center justify-center mx-auto mb-4">
          <Upload className={`w-8 h-8 ${isDragActive ? "text-[#c9a84c]" : "text-[#0b1d3a]/30"}`} />
        </div>
        {isDragActive ? (
          <p className="text-[#c9a84c] font-semibold">Drop your files here...</p>
        ) : (
          <>
            <p className="text-[#0b1d3a] font-semibold mb-1">
              Drag & drop files here
            </p>
            <p className="text-slate-400 text-sm mb-4">or click to browse files</p>
            <span className="inline-flex items-center gap-2 bg-[#0b1d3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
              <FileText className="w-4 h-4" />
              Choose Files
            </span>
          </>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3 mb-6">
          {files.map((uf) => (
            <div
              key={uf.id}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-colors ${
                uf.status === "success"
                  ? "border-green-200"
                  : uf.status === "error"
                  ? "border-red-200"
                  : "border-slate-100"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {uf.status === "success" ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : uf.status === "error" ? (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                ) : uf.status === "uploading" ? (
                  <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-[#0b1d3a]/5 flex items-center justify-center">
                    <File className="w-4 h-4 text-[#0b1d3a]/40" />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#0b1d3a] text-sm font-semibold truncate">{uf.file.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-400 text-xs">{formatFileSize(uf.file.size)}</span>
                  {uf.status === "error" && (
                    <span className="text-red-500 text-xs">{uf.error}</span>
                  )}
                  {uf.status === "success" && (
                    <span className="text-green-600 text-xs font-medium">Uploaded successfully</span>
                  )}
                </div>
              </div>

              {/* Category select */}
              {uf.status === "pending" && (
                <select
                  value={uf.category}
                  onChange={(e) => updateCategory(uf.id, e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#c9a84c]/50 bg-white flex-shrink-0"
                >
                  {DOCUMENT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              )}

              {/* Remove */}
              {(uf.status === "pending" || uf.status === "error") && (
                <button
                  onClick={() => removeFile(uf.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {files.some((f) => f.status === "pending") && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 bg-[#0b1d3a] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors text-sm"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading securely...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload {files.filter((f) => f.status === "pending").length} Document
              {files.filter((f) => f.status === "pending").length > 1 ? "s" : ""}
            </>
          )}
        </button>
      )}

      <p className="text-slate-400 text-xs text-center mt-4">
        All documents are encrypted and stored securely. Only your accountant can access your files.
      </p>
    </div>
  );
}
