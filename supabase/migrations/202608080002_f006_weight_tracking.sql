create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  weight_kg numeric(6, 2) not null,
  recorded_at timestamptz not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint weight_entries_weight_kg_check
    check (weight_kg between 20 and 500),
  constraint weight_entries_note_length_check
    check (note is null or char_length(note) <= 500),
  constraint weight_entries_note_control_characters_check
    check (note is null or note !~ '[[:cntrl:]]')
);

comment on table public.weight_entries is
  'User-owned body-weight measurements stored canonically in kilograms.';
comment on column public.weight_entries.weight_kg is
  'Canonical weight in kilograms, independent of the user display preference.';

create index weight_entries_user_recorded_at_id_idx
  on public.weight_entries (user_id, recorded_at desc, id desc);

create or replace function public.normalize_weight_entry()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.note = nullif(btrim(new.note), '');
  new.updated_at = now();
  return new;
end;
$$;

create trigger normalize_weight_entry_before_write
before insert or update on public.weight_entries
for each row execute function public.normalize_weight_entry();

alter table public.weight_entries enable row level security;

revoke all on table public.weight_entries from anon, authenticated;
grant select on table public.weight_entries to authenticated;
grant insert (user_id, weight_kg, recorded_at, note)
  on table public.weight_entries to authenticated;
grant update (weight_kg, recorded_at, note)
  on table public.weight_entries to authenticated;
grant delete on table public.weight_entries to authenticated;

create policy "Users can read their own weight entries"
on public.weight_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own weight entries"
on public.weight_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own weight entries"
on public.weight_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own weight entries"
on public.weight_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);
