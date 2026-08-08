create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weight_unit text not null default 'kg',
  height_unit text not null default 'cm',
  water_unit text not null default 'ml',
  language text not null default 'en',
  theme text not null default 'system',
  notification_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_weight_unit_check
    check (weight_unit in ('kg', 'lbs')),
  constraint user_preferences_height_unit_check
    check (height_unit in ('cm', 'ft/in')),
  constraint user_preferences_water_unit_check
    check (water_unit in ('ml', 'L', 'oz')),
  constraint user_preferences_language_check
    check (language in ('en', 'sr')),
  constraint user_preferences_theme_check
    check (theme in ('system', 'light', 'dark')),
  constraint user_preferences_notifications_object_check
    check (jsonb_typeof(notification_preferences) = 'object')
);

comment on table public.user_preferences is
  'User-owned MVP application preferences. F007 manages only water_unit.';

create or replace function public.set_user_preferences_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_preferences_updated_at_before_update
before update on public.user_preferences
for each row execute function public.set_user_preferences_updated_at();

insert into public.user_preferences (user_id)
select users.id
from auth.users as users
on conflict (user_id) do nothing;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

alter table public.user_preferences enable row level security;

revoke all on table public.user_preferences from anon, authenticated;
grant select on table public.user_preferences to authenticated;
grant insert (user_id, water_unit) on table public.user_preferences to authenticated;
grant update (water_unit) on table public.user_preferences to authenticated;

create policy "Users can read their own preferences"
on public.user_preferences
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own preferences"
on public.user_preferences
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own preferences"
on public.user_preferences
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create table public.water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount_ml numeric not null,
  consumed_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint water_entries_amount_ml_check
    check (amount_ml > 0)
);

comment on table public.water_entries is
  'User-owned hydration entries stored canonically in millilitres.';
comment on column public.water_entries.amount_ml is
  'Canonical amount in millilitres, independent of the user display preference.';

create index water_entries_user_consumed_at_idx
  on public.water_entries (user_id, consumed_at desc);

alter table public.water_entries enable row level security;

revoke all on table public.water_entries from anon, authenticated;
grant select on table public.water_entries to authenticated;
grant insert (user_id, amount_ml, consumed_at) on table public.water_entries to authenticated;
grant update (amount_ml, consumed_at) on table public.water_entries to authenticated;
grant delete on table public.water_entries to authenticated;

create policy "Users can read their own water entries"
on public.water_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own water entries"
on public.water_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own water entries"
on public.water_entries
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own water entries"
on public.water_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);
