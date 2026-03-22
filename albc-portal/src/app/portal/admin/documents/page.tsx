import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import DocumentsPanel from "./DocumentsPanel";

const DEMO_DOCS = [
  { id: "1", client_id: "1", file_name: "Bank_Statement_March_2026.pdf", file_type: "application/pdf", file_size: 245000, storage_path: "", folder: "Monthly Bank Statements", category: "bank_statement", status: "received", uploaded_at: new Date().toISOString(), uploaded_by: "1", client: { id: "1", full_name: "Sarah Mitchell", company: "SM Retail Solutions", email: "sarah@smretail.co.za" } },
  { id: "2", client_id: "2", file_name: "Invoice_INV-2026-003.pdf", file_type: "application/pdf", file_size: 112000, storage_path: "", folder: "Invoices", category: "invoice", status: "under_review", uploaded_at: new Date(Date.now() - 86400000).toISOString(), uploaded_by: "2", client: { id: "2", full_name: "David Khumalo", company: "DK Construction Group", email: "david@dkconstruction.co.za" } },
  { id: "3", client_id: "3", file_name: "Tax_Certificate_2025.pdf", file_type: "application/pdf", file_size: 89000, storage_path: "", folder: "Tax Documents", category: "tax_certificate", status: "processed", uploaded_at: new Date(Date.now() - 172800000).toISOString(), uploaded_by: "3", client: { id: "3", full_name: "Priya Naidoo", company: "Naidoo Professional Services", email: "priya@naidoopro.co.za" } },
  { id: "4", client_id: "4", file_name: "ID_Document_Copy.jpg", file_type: "image/jpeg", file_size: 540000, storage_path: "", folder: "Identity Documents", category: "id_document", status: "requires_action", notes: "Please re-upload a clearer copy. The current scan is too dark to read.", uploaded_at: new Date(Date.now() - 259200000).toISOString(), uploaded_by: "4", client: { id: "4", full_name: "James Okonkwo", company: "JO Tech Innovations", email: "james@jotech.co.za" } },
  { id: "5", client_id: "1", file_name: "Payslip_Feb_2026.pdf", file_type: "application/pdf", file_size: 67000, storage_path: "", folder: "Payroll Documents", category: "payslip", status: "received", uploaded_at: new Date(Date.now() - 345600000).toISOString(), uploaded_by: "1", client: { id: "1", full_name: "Sarah Mitchell", company: "SM Retail Solutions", email: "sarah@smretail.co.za" } },
];
const DEMO_CLIENTS = [
  { id: "1", full_name: "Sarah Mitchell", company: "SM Retail Solutions" },
  { id: "2", full_name: "David Khumalo", company: "DK Construction Group" },
  { id: "3", full_name: "Priya Naidoo", company: "Naidoo Professional Services" },
  { id: "4", full_name: "James Okonkwo", company: "JO Tech Innovations" },
];

export default async function AdminDocumentsPage() {
  if (isDemoMode()) {
    return <DocumentsPanel initialDocuments={DEMO_DOCS as never} clients={DEMO_CLIENTS as never} />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const [{ data: documents }, { data: clients }] = await Promise.all([
    supabase
      .from("documents")
      .select("*, client:profiles!client_id(id, full_name, company, email)")
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name, company")
      .eq("role", "client")
      .order("full_name"),
  ]);

  return <DocumentsPanel initialDocuments={documents ?? []} clients={clients ?? []} />;
}
