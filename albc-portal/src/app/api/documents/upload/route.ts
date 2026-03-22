import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile?.is_active) {
    return NextResponse.json({ error: "Account inactive" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "other";
  const folder = (formData.get("folder") as string) || "General";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 25MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowedExts = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "webp"];
  if (!ext || !allowedExts.includes(ext)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // Generate unique storage path
  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "_");
  const storagePath = `${user.id}/${sanitizedFolder}/${timestamp}_${sanitized}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  // Save document record
  const { data: doc, error: dbError } = await supabase
    .from("documents")
    .insert({
      client_id: user.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
      folder,
      category,
      status: "received",
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (dbError) {
    await supabase.storage.from("documents").remove([storagePath]);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Audit log
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "document_upload",
    entity_type: "document",
    entity_id: doc.id,
    details: { file_name: file.name, folder, category, file_size: file.size },
  });

  // Notify admin(s)
  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (admins && admins.length > 0) {
    const { data: clientProfile } = await supabase
      .from("profiles")
      .select("full_name, company")
      .eq("id", user.id)
      .single();

    const clientName = clientProfile?.full_name ?? "A client";

    await supabase.from("notifications").insert(
      admins.map((admin) => ({
        recipient_id: admin.id,
        type: "document_uploaded",
        title: "New Document Uploaded",
        message: `${clientName} uploaded "${file.name}" to ${folder} (${category.replace(/_/g, " ")})`,
        related_document_id: doc.id,
        related_client_id: user.id,
      }))
    );

    // Optionally send email (handled by separate email service)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "document_uploaded",
          clientName,
          fileName: file.name,
          folder,
          category,
          docId: doc.id,
        }),
      });
    } catch {
      // Non-blocking — notification still saved
    }
  }

  // Send confirmation notification to client
  await supabase.from("notifications").insert({
    recipient_id: user.id,
    type: "upload_confirmed",
    title: "Document Uploaded Successfully",
    message: `Your document "${file.name}" was uploaded to ${folder} and is under review.`,
    related_document_id: doc.id,
  });

  return NextResponse.json({ document: doc }, { status: 201 });
}
