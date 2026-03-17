import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import NotificationsPanel from "./NotificationsPanel";

const DEMO_NOTIFS = [
  { id: "1", recipient_id: "admin", type: "document_uploaded", title: "New Document Uploaded", message: "Sarah Mitchell uploaded \"Bank_Statement_March_2026.pdf\" (bank statement)", read: false, created_at: new Date().toISOString(), related_document_id: "1", related_client_id: "1" },
  { id: "2", recipient_id: "admin", type: "document_uploaded", title: "New Document Uploaded", message: "David Khumalo uploaded \"Invoice_INV-2026-003.pdf\" (invoice)", read: false, created_at: new Date(Date.now() - 86400000).toISOString(), related_document_id: "2", related_client_id: "2" },
  { id: "3", recipient_id: "admin", type: "document_uploaded", title: "New Document Uploaded", message: "James Okonkwo uploaded \"ID_Document_Copy.jpg\" (id document)", read: true, created_at: new Date(Date.now() - 172800000).toISOString(), related_document_id: "4", related_client_id: "4" },
];

export default async function NotificationsPage() {
  if (isDemoMode()) {
    return <NotificationsPanel initialNotifications={DEMO_NOTIFS as never} userId="demo-admin" />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, related_client:profiles!related_client_id(full_name, company)")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <NotificationsPanel
      initialNotifications={notifications ?? []}
      userId={user.id}
    />
  );
}
