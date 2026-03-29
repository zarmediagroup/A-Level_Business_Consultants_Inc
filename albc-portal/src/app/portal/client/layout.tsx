import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import ClientSidebar from "@/components/portal/ClientSidebar";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDemoMode()) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <ClientSidebar clientName="Demo Client" unreadCount={1} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "client" || !profile.is_active) {
    redirect("/portal/login");
  }

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <ClientSidebar
        clientName={profile.full_name}
        unreadCount={unreadCount ?? 0}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
