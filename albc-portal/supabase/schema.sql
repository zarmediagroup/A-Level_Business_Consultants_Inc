-- =========================================================
-- A-Level Business Consultants Inc – Supabase Schema
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text not null,
  phone           text,
  company         text,
  service_category text,
  role            text not null default 'client' check (role in ('admin','client')),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  last_login      timestamptz
);

alter table public.profiles enable row level security;

-- Policies: admins see all, clients see only self
create policy "Profiles: admin full access"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Profiles: client read own"
  on public.profiles for select
  using (id = auth.uid());

create policy "Profiles: client update own"
  on public.profiles for update
  using (id = auth.uid());

-- ── Documents ─────────────────────────────────────────────
create table if not exists public.documents (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid not null references public.profiles(id) on delete cascade,
  file_name       text not null,
  file_type       text not null,
  file_size       bigint not null,
  storage_path    text not null,
  folder          text not null default 'General',
  category        text not null default 'other'
                    check (category in ('bank_statement','invoice','tax_certificate',
                                        'id_document','financial_statement','payslip',
                                        'contract','other')),
  status          text not null default 'received'
                    check (status in ('received','under_review','processed','requires_action')),
  notes           text,
  uploaded_at     timestamptz not null default now(),
  uploaded_by     uuid not null references public.profiles(id)
);

alter table public.documents add column if not exists folder text not null default 'General';

alter table public.documents enable row level security;

create policy "Documents: admin full access"
  on public.documents for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Documents: client read/insert own"
  on public.documents for select
  using (client_id = auth.uid());

create policy "Documents: client insert own"
  on public.documents for insert
  with check (client_id = auth.uid() and uploaded_by = auth.uid());

-- ── Notifications ─────────────────────────────────────────
create table if not exists public.notifications (
  id                    uuid primary key default uuid_generate_v4(),
  recipient_id          uuid not null references public.profiles(id) on delete cascade,
  type                  text not null,
  title                 text not null,
  message               text not null,
  read                  boolean not null default false,
  created_at            timestamptz not null default now(),
  related_document_id   uuid references public.documents(id) on delete set null,
  related_client_id     uuid references public.profiles(id) on delete set null
);

alter table public.notifications enable row level security;

create policy "Notifications: admin full access"
  on public.notifications for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Notifications: recipient read/update own"
  on public.notifications for select
  using (recipient_id = auth.uid());

create policy "Notifications: recipient update own"
  on public.notifications for update
  using (recipient_id = auth.uid());

-- ── Audit Logs ────────────────────────────────────────────
create table if not exists public.audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles(id) on delete set null,
  action        text not null,
  entity_type   text not null,
  entity_id     uuid,
  details       jsonb,
  timestamp     timestamptz not null default now(),
  ip_address    text
);

alter table public.audit_logs enable row level security;

create policy "Audit logs: admin read only"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Audit logs: service role insert"
  on public.audit_logs for insert
  with check (true);

-- ── Client Notes ──────────────────────────────────────────
create table if not exists public.client_notes (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  admin_id    uuid not null references public.profiles(id) on delete cascade,
  note        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.client_notes enable row level security;

create policy "Notes: admin full access"
  on public.client_notes for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── Helper Functions ──────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket (run via Supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
