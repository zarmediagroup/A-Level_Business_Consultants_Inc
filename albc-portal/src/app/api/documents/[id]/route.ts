import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { DOCUMENT_STATUS } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { status, notes } = body;

  const validStatuses = DOCUMENT_STATUS.map((s) => s.value);
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updates: { status?: string; notes?: string | null } = {};
  if (status) updates.status = status;
  if (typeof notes === "string") updates.notes = notes.trim() || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const { data: doc, error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Audit log
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: status ? "document_status_change" : "document_comment_added",
    entity_type: "document",
    entity_id: id,
    details: { new_status: status, notes: updates.notes ?? null },
  });

  // Notify client
  if (status) {
    const statusLabel = DOCUMENT_STATUS.find((s) => s.value === status)?.label ?? status;
    await supabase.from("notifications").insert({
      recipient_id: doc.client_id,
      type: "document_status_changed",
      title: "Document Status Updated",
      message: `Your document "${doc.file_name}" status has been updated to: ${statusLabel}`,
      related_document_id: id,
    });
  }

  if (typeof notes === "string" && updates.notes) {
    await supabase.from("notifications").insert({
      recipient_id: doc.client_id,
      type: "document_query_added",
      title: "New Query On Your Document",
      message: `A comment was added on "${doc.file_name}": ${updates.notes}`,
      related_document_id: id,
    });
  }

  return NextResponse.json({ document: doc });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get document to find storage path
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path, file_name, client_id")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  // Delete from storage
  await supabase.storage.from("documents").remove([doc.storage_path]);

  // Delete record
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "document_delete",
    entity_type: "document",
    entity_id: id,
    details: { file_name: doc.file_name, client_id: doc.client_id },
  });

  return NextResponse.json({ success: true });
}
