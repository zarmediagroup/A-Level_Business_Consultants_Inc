import { createClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demo-mode";
import { redirect } from "next/navigation";
import ProfilePanel from "./ProfilePanel";

const DEMO_PROFILE = { id: "demo", full_name: "Demo Client", email: "demo@example.com", phone: "+27 82 000 0000", company: "Demo Business Pty Ltd", service_category: "Bookkeeping", role: "client" as const, is_active: true, created_at: new Date().toISOString() };

export default async function ClientProfilePage() {
  if (isDemoMode()) {
    return <ProfilePanel profile={DEMO_PROFILE as never} />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/portal/login");

  return <ProfilePanel profile={profile} />;
}
