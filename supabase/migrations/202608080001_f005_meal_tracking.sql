create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  meal_type text not null,
  consumed_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint meals_name_length_check
    check (char_length(btrim(name)) between 2 and 100),
  constraint meals_name_control_characters_check check (name !~ '[[:cntrl:]]'),
  constraint meals_meal_type_check
    check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack'))
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals (id) on delete cascade,
  food_id uuid references public.foods (id) on delete set null,
  food_name text not null,
  food_brand text,
  food_source text not null,
  external_id text,
  quantity_grams numeric(10, 2) not null,
  calories numeric(10, 2) not null,
  protein numeric(10, 2) not null,
  carbohydrates numeric(10, 2) not null,
  fat numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  constraint meal_items_food_name_length_check
    check (char_length(btrim(food_name)) between 2 and 150),
  constraint meal_items_food_name_control_characters_check
    check (food_name !~ '[[:cntrl:]]'),
  constraint meal_items_food_brand_length_check
    check (food_brand is null or char_length(btrim(food_brand)) between 1 and 100),
  constraint meal_items_food_source_check
    check (food_source in ('system', 'custom', 'open_food_facts')),
  constraint meal_items_provenance_check check (
    (food_source = 'open_food_facts' and external_id ~ '^[0-9]{8,14}$')
    or (food_source in ('system', 'custom') and external_id is null)
  ),
  constraint meal_items_quantity_grams_check
    check (quantity_grams > 0 and quantity_grams <= 100000),
  constraint meal_items_calories_check check (calories between 0 and 900000),
  constraint meal_items_protein_check check (protein between 0 and 100000),
  constraint meal_items_carbohydrates_check check (carbohydrates between 0 and 100000),
  constraint meal_items_fat_check check (fat between 0 and 100000)
);

comment on table public.meals is 'User-owned meals ordered by consumption time.';
comment on table public.meal_items is 'Meal food entries with immutable identity, provenance, and calculated nutrition snapshots.';
comment on column public.meal_items.quantity_grams is 'Consumed quantity in canonical grams.';

create index meals_user_consumed_at_idx on public.meals (user_id, consumed_at desc);
create index meal_items_meal_id_idx on public.meal_items (meal_id);
create index meal_items_food_id_idx on public.meal_items (food_id) where food_id is not null;

create or replace function public.set_meal_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.name = btrim(new.name);
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_meal_updated_at_before_write
before insert or update on public.meals
for each row execute function public.set_meal_updated_at();

create or replace function public.normalize_meal_item_snapshot()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  referenced_source text;
  referenced_external_id text;
begin
  new.food_name = btrim(new.food_name);
  new.food_brand = nullif(btrim(new.food_brand), '');
  new.external_id = nullif(btrim(new.external_id), '');

  if new.food_source = 'open_food_facts' and new.food_id is not null then
    raise exception using errcode = '23514', message = 'transient Open Food Facts items cannot reference foods';
  end if;

  if new.food_source in ('system', 'custom') and new.food_id is null then
    if not (tg_op = 'UPDATE' and old.food_id is not null) then
      raise exception using errcode = '23514', message = 'internal meal items must reference a food';
    end if;
  end if;

  if new.food_id is not null and (tg_op = 'INSERT' or old.food_id is distinct from new.food_id or old.food_source is distinct from new.food_source or old.external_id is distinct from new.external_id) then
    select foods.source, foods.external_id
      into referenced_source, referenced_external_id
      from public.foods
      where foods.id = new.food_id;

    if not found or referenced_source is distinct from new.food_source or referenced_external_id is distinct from new.external_id then
      raise exception using errcode = '23514', message = 'meal item food provenance does not match an accessible food';
    end if;
  end if;

  return new;
end;
$$;

create trigger normalize_meal_item_snapshot_before_write
before insert or update on public.meal_items
for each row execute function public.normalize_meal_item_snapshot();

alter table public.meals enable row level security;
alter table public.meal_items enable row level security;

revoke all on table public.meals from anon, authenticated;
grant select on table public.meals to authenticated;
grant insert (user_id, name, meal_type, consumed_at) on table public.meals to authenticated;
grant update (name, meal_type, consumed_at) on table public.meals to authenticated;
grant delete on table public.meals to authenticated;

revoke all on table public.meal_items from anon, authenticated;
grant select on table public.meal_items to authenticated;
grant insert (
  meal_id, food_id, food_name, food_brand, food_source, external_id,
  quantity_grams, calories, protein, carbohydrates, fat
) on table public.meal_items to authenticated;
grant update (
  food_id, food_name, food_brand, food_source, external_id,
  quantity_grams, calories, protein, carbohydrates, fat
) on table public.meal_items to authenticated;
grant delete on table public.meal_items to authenticated;

create policy "Users can read their own meals"
on public.meals for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own meals"
on public.meals for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own meals"
on public.meals for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own meals"
on public.meals for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read items in their own meals"
on public.meal_items for select to authenticated
using (exists (
  select 1 from public.meals
  where meals.id = meal_items.meal_id
    and meals.user_id = (select auth.uid())
));

create policy "Users can create items in their own meals"
on public.meal_items for insert to authenticated
with check (exists (
  select 1 from public.meals
  where meals.id = meal_items.meal_id
    and meals.user_id = (select auth.uid())
));

create policy "Users can update items in their own meals"
on public.meal_items for update to authenticated
using (exists (
  select 1 from public.meals
  where meals.id = meal_items.meal_id
    and meals.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.meals
  where meals.id = meal_items.meal_id
    and meals.user_id = (select auth.uid())
));

create policy "Users can delete items in their own meals"
on public.meal_items for delete to authenticated
using (exists (
  select 1 from public.meals
  where meals.id = meal_items.meal_id
    and meals.user_id = (select auth.uid())
));
