create table public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  brand text,
  category text not null,
  barcode text,
  calories numeric(8, 2) not null,
  protein numeric(8, 2) not null,
  carbohydrates numeric(8, 2) not null,
  fat numeric(8, 2) not null,
  fiber numeric(8, 2),
  sugar numeric(8, 2),
  sodium numeric(10, 2),
  serving_size numeric(8, 2) not null default 100,
  serving_unit text not null default 'g',
  source text not null,
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint foods_name_length_check
    check (char_length(btrim(name)) between 2 and 150),
  constraint foods_name_control_characters_check check (name !~ '[[:cntrl:]]'),
  constraint foods_brand_length_check
    check (brand is null or char_length(btrim(brand)) between 1 and 100),
  constraint foods_category_length_check
    check (char_length(btrim(category)) between 2 and 80),
  constraint foods_barcode_check
    check (barcode is null or barcode ~ '^[0-9]{8,14}$'),
  constraint foods_calories_check check (calories between 0 and 900),
  constraint foods_protein_check check (protein between 0 and 100),
  constraint foods_carbohydrates_check check (carbohydrates between 0 and 100),
  constraint foods_fat_check check (fat between 0 and 100),
  constraint foods_fiber_check check (fiber is null or fiber between 0 and 100),
  constraint foods_sugar_check check (sugar is null or sugar between 0 and 100),
  constraint foods_sodium_check check (sodium is null or sodium between 0 and 100000),
  constraint foods_serving_check check (serving_size = 100 and serving_unit = 'g'),
  constraint foods_source_check
    check (source in ('system', 'custom', 'open_food_facts')),
  constraint foods_ownership_source_check check (
    (source = 'custom' and user_id is not null and external_id is null)
    or (source in ('system', 'open_food_facts') and user_id is null)
  ),
  constraint foods_external_id_check check (
    (source = 'open_food_facts' and external_id is not null)
    or (source <> 'open_food_facts' and external_id is null)
  )
);

comment on table public.foods is
  'Global food catalogue and private user-created foods with nutrition per 100 g.';

create index foods_global_name_search_idx
  on public.foods (lower(name) text_pattern_ops)
  where user_id is null;
create index foods_private_owner_name_search_idx
  on public.foods (user_id, lower(name) text_pattern_ops)
  where user_id is not null;
create index foods_category_idx on public.foods (lower(category));
create index foods_user_id_idx on public.foods (user_id)
  where user_id is not null;
create unique index foods_global_barcode_key on public.foods (barcode)
  where user_id is null and barcode is not null;
create unique index foods_private_owner_barcode_key
  on public.foods (user_id, barcode)
  where user_id is not null and barcode is not null;
create unique index foods_external_source_id_key
  on public.foods (source, external_id)
  where external_id is not null;

create or replace function public.set_food_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.name = btrim(new.name);
  new.brand = nullif(btrim(new.brand), '');
  new.category = btrim(new.category);
  new.barcode = nullif(btrim(new.barcode), '');
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_food_updated_at_before_write
before insert or update on public.foods
for each row execute function public.set_food_updated_at();

alter table public.foods enable row level security;

revoke all on table public.foods from anon, authenticated;
grant select on table public.foods to authenticated;
grant insert (
  user_id, name, brand, category, barcode, calories, protein,
  carbohydrates, fat, fiber, sugar, sodium, serving_size, serving_unit, source
) on table public.foods to authenticated;
grant update (
  name, brand, category, barcode, calories, protein,
  carbohydrates, fat, fiber, sugar, sodium, serving_size, serving_unit
) on table public.foods to authenticated;
grant delete on table public.foods to authenticated;

create policy "Authenticated users can read global and owned foods"
on public.foods
for select
to authenticated
using (user_id is null or (select auth.uid()) = user_id);

create policy "Users can create their own custom foods"
on public.foods
for insert
to authenticated
with check ((select auth.uid()) = user_id and source = 'custom');

create policy "Users can update their own custom foods"
on public.foods
for update
to authenticated
using ((select auth.uid()) = user_id and source = 'custom')
with check ((select auth.uid()) = user_id and source = 'custom');

create policy "Users can delete their own custom foods"
on public.foods
for delete
to authenticated
using ((select auth.uid()) = user_id and source = 'custom');
