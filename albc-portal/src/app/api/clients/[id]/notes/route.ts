import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: client_id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { note } = await request.json();
  if (!note?.trim()) return NextResponse.json({ error: "Note cannot be empty" }, { status: 400 });

  const { data, error } = await supabase
    .from("client_notes")
    .insert({ client_id, admin_id: user.id, note: note.trim() })
    .select("*, admin:profiles!admin_id(full_name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ note: data }, { status: 201 });
}
