create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  date_of_birth date,
  goal text,
  unit_system text not null default 'metric',
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length_check
    check (full_name is null or char_length(full_name) between 1 and 100),
  constraint profiles_full_name_control_characters_check
    check (full_name is null or full_name !~ '[[:cntrl:]]'),
  constraint profiles_date_of_birth_check
    check (date_of_birth is null or date_of_birth >= date '1900-01-01'),
  constraint profiles_goal_check
    check (goal is null or goal in ('weight_loss', 'maintenance', 'weight_gain')),
  constraint profiles_unit_system_check
    check (unit_system in ('metric', 'imperial'))
);

comment on table public.profiles is
  'Application profile data for authenticated CalorieDock users.';

create or replace function public.set_profile_derived_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.full_name = nullif(btrim(new.full_name), '');

  if new.date_of_birth is not null and new.date_of_birth > current_date then
    raise exception using
      errcode = '23514',
      constraint = 'profiles_date_of_birth_not_future_check',
      message = 'date_of_birth cannot be in the future';
  end if;

  new.profile_completed =
    new.full_name is not null
    and new.goal is not null
    and new.unit_system is not null;
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profile_derived_fields_before_write
before insert or update on public.profiles
for each row execute function public.set_profile_derived_fields();

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
  return new;
end;
$$;

create trigger create_profile_after_auth_user_insert
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.profiles (id)
select users.id
from auth.users as users
on conflict (id) do nothing;

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, full_name, date_of_birth, goal, unit_system)
  on table public.profiles to authenticated;
grant update (full_name, date_of_birth, goal, unit_system)
  on table public.profiles to authenticated;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
