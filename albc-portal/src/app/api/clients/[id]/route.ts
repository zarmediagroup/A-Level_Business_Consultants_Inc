import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase-server";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json();
  const { full_name, phone, company, service_category, is_active } = body;

  const adminClient = await createAdminClient();

  const { data: profile, error } = await adminClient
    .from("profiles")
    .update({ full_name, phone, company, service_category, is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await adminClient.from("audit_logs").insert({
    user_id: adminUser.id,
    action: "client_updated",
    entity_type: "profile",
    entity_id: id,
    details: { full_name, is_active },
  });

  return NextResponse.json({ client: profile });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const adminClient = await createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await adminClient.from("audit_logs").insert({
    user_id: adminUser.id,
    action: "client_deleted",
    entity_type: "profile",
    entity_id: id,
  });

  return NextResponse.json({ success: true });
}
