import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import ClientsPanel from "./ClientsPanel";

const DEMO_CLIENTS = [
  { id: "1", full_name: "Sarah Mitchell", email: "sarah@smretail.co.za", phone: "+27 82 111 2222", company: "SM Retail Solutions", service_category: "Bookkeeping", role: "client" as const, is_active: true, created_at: new Date().toISOString(), last_login: new Date(Date.now() - 3600000).toISOString(), document_count: 8 },
  { id: "2", full_name: "David Khumalo", email: "david@dkconstruction.co.za", phone: "+27 73 222 3333", company: "DK Construction Group", service_category: "Tax Returns", role: "client" as const, is_active: true, created_at: new Date(Date.now() - 86400000 * 10).toISOString(), last_login: new Date(Date.now() - 86400000).toISOString(), document_count: 14 },
  { id: "3", full_name: "Priya Naidoo", email: "priya@naidoopro.co.za", phone: "+27 61 333 4444", company: "Naidoo Professional Services", service_category: "Business Consulting", role: "client" as const, is_active: true, created_at: new Date(Date.now() - 86400000 * 20).toISOString(), last_login: new Date(Date.now() - 86400000 * 2).toISOString(), document_count: 6 },
  { id: "4", full_name: "James Okonkwo", email: "james@jotech.co.za", phone: "+27 79 444 5555", company: "JO Tech Innovations", service_category: "Payroll", role: "client" as const, is_active: true, created_at: new Date(Date.now() - 86400000 * 30).toISOString(), last_login: undefined, document_count: 3 },
  { id: "5", full_name: "Fatima Adams", email: "fatima@albaraka.co.za", phone: "+27 83 555 6666", company: "Al-Baraka Trading", service_category: "VAT Returns", role: "client" as const, is_active: false, created_at: new Date(Date.now() - 86400000 * 60).toISOString(), last_login: new Date(Date.now() - 86400000 * 14).toISOString(), document_count: 2 },
];

export default async function ClientsPage() {
  if (isDemoMode()) {
    return <ClientsPanel initialClients={DEMO_CLIENTS as never} adminId="demo-admin" />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  // Get document counts per client
  const { data: docCounts } = await supabase
    .from("documents")
    .select("client_id");

  const countMap = (docCounts ?? []).reduce(
    (acc: Record<string, number>, d: { client_id: string }) => {
      acc[d.client_id] = (acc[d.client_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const enriched = (clients ?? []).map((c) => ({
    ...c,
    document_count: countMap[c.id] ?? 0,
  }));

  return <ClientsPanel initialClients={enriched} adminId={user.id} />;
}
