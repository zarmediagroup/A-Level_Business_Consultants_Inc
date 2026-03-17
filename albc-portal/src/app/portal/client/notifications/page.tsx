import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import NotificationsPanel from "../../admin/notifications/NotificationsPanel";

const DEMO_NOTIFS = [
  { id: "1", recipient_id: "demo", type: "upload_confirmed", title: "Document Uploaded Successfully", message: "Your document \"Bank_Statement_March_2026.pdf\" has been received and is under review.", read: false, created_at: new Date().toISOString() },
  { id: "2", recipient_id: "demo", type: "document_status_changed", title: "Document Status Updated", message: "Your document \"Tax_Certificate_2025.pdf\" status has been updated to: Processed", read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export default async function ClientNotificationsPage() {
  if (isDemoMode()) {
    return <NotificationsPanel initialNotifications={DEMO_NOTIFS as never} userId="demo" />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <NotificationsPanel
      initialNotifications={notifications ?? []}
      userId={user.id}
    />
  );
}
