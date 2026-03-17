import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import AdminSidebar from "@/components/portal/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDemoMode()) {
    return (
      <div className="flex h-screen bg-[#f0f2f8] overflow-hidden">
        <AdminSidebar unreadCount={3} adminName="Demo Admin" />
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

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/portal/login");
  }

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  return (
    <div className="flex h-screen bg-[#f0f2f8] overflow-hidden">
      <AdminSidebar
        unreadCount={unreadCount ?? 0}
        adminName={profile.full_name}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
