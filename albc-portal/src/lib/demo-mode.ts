export function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    !url ||
    url === "your_supabase_project_url" ||
    url === "https://placeholder.supabase.co"
  );
}
