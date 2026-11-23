-- Weekly plan ("Mon plan de la semaine") and the live team feed (Canap' messages + reactions).
--
-- Plan: each player announces the days (1 = Monday … 7 = Sunday) they intend to train in the
-- current game week. Teammates see the days, never a time or a place. Reminders are local
-- notifications scheduled on the phone (the reminder hour never leaves it).
--
-- Feed: when a session is validated, the Canap' posts a system message in each team of the
-- player; teammates react with one of four emojis. A reaction pushes the message's author
-- (or the player a Canap' message is about), through notify-chat.

-- ---------------------------------------------------------------------------
-- Weekly plan
-- ---------------------------------------------------------------------------
create table public.week_plans (
  user_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  days smallint[] not null
    check (cardinality(days) between 1 and 7 and days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);
alter table public.week_plans enable row level security;
revoke all on public.week_plans from anon, authenticated;
grant select on public.week_plans to authenticated;
grant all on public.week_plans to service_role;
create policy week_plans_select_own_or_teammate on public.week_plans
  for select to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.team_members me
      join public.team_members them on them.team_id = me.team_id
      where me.user_id = auth.uid() and them.user_id = week_plans.user_id));

-- Sets (or clears, with an empty array) the player's plan for the current game week.
create function public.set_week_plan(p_days smallint[]) returns smallint[]
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := app_private.require_uid();
  wk date := app_private.game_week_start(now());
  cleaned smallint[];
begin
  select coalesce(array_agg(distinct d order by d), '{}') into cleaned
    from unnest(coalesce(p_days, '{}')) d;
  if exists (select 1 from unnest(cleaned) d where d < 1 or d > 7) then
    raise exception 'invalid_plan' using errcode = '22023';
  end if;
  if cardinality(cleaned) = 0 then
    delete from public.week_plans where user_id = uid and week_start = wk;
    return cleaned;
  end if;
  insert into public.week_plans (user_id, week_start, days) values (uid, wk, cleaned)
  on conflict (user_id, week_start) do update set days = excluded.days, updated_at = now();
  return cleaned;
end $$;

-- Plans of a team for the current game week (members only).
create function public.team_week_plans(p_team uuid)
returns table (user_id uuid, days smallint[])
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not app_private.is_team_member(p_team) then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  return query
  select w.user_id, w.days
    from public.week_plans w
    join public.team_members m on m.user_id = w.user_id and m.team_id = p_team
   where w.week_start = app_private.game_week_start(now());
end $$;

revoke all on function public.set_week_plan(smallint[]), public.team_week_plans(uuid) from public, anon;
grant execute on function public.set_week_plan(smallint[]), public.team_week_plans(uuid)
  to authenticated, service_role;
