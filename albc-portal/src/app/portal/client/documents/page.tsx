import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import ClientDocumentsPanel from "./ClientDocumentsPanel";

const DEMO_DOCS = [
  { id: "1", client_id: "demo", file_name: "Bank_Statement_March_2026.pdf", file_type: "application/pdf", file_size: 245000, storage_path: "", category: "bank_statement", status: "under_review", uploaded_at: new Date().toISOString(), uploaded_by: "demo" },
  { id: "2", client_id: "demo", file_name: "Invoice_INV-2026-003.pdf", file_type: "application/pdf", file_size: 112000, storage_path: "", category: "invoice", status: "received", uploaded_at: new Date(Date.now() - 86400000).toISOString(), uploaded_by: "demo" },
  { id: "3", client_id: "demo", file_name: "Tax_Certificate_2025.pdf", file_type: "application/pdf", file_size: 89000, storage_path: "", category: "tax_certificate", status: "processed", uploaded_at: new Date(Date.now() - 172800000).toISOString(), uploaded_by: "demo" },
];

export default async function ClientDocumentsPage() {
  if (isDemoMode()) {
    return <ClientDocumentsPanel initialDocuments={DEMO_DOCS as never} />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", user.id)
    .order("uploaded_at", { ascending: false });

  return <ClientDocumentsPanel initialDocuments={documents ?? []} />;
}
