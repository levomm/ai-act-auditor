
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  email text,
  repo_url text,
  uploaded_files_meta jsonb,
  score integer,
  classification text,
  top_risks jsonb,
  full_report jsonb,
  status text not null default 'pending',
  error text,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'waitlist',
  company text,
  employees text,
  ai_use_case text,
  notes text,
  scan_id uuid,
  created_at timestamptz not null default now()
);

alter table public.scans enable row level security;
alter table public.leads enable row level security;

-- Anyone can create a scan (lead magnet)
create policy "anyone can insert scans"
  on public.scans for insert
  to anon, authenticated
  with check (true);

-- Anyone with the scan id (UUID acts as share token) can read it.
-- We rely on the unguessable UUID for access control on the public share link.
create policy "anyone can read scans by id"
  on public.scans for select
  to anon, authenticated
  using (true);

-- Server function (service role) updates scans; no public update policy.

-- Leads: insert only, no select for the public.
create policy "anyone can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);
