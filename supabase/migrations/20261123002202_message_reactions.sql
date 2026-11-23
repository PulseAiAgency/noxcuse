-- Emoji reactions on team chat messages (🔥 💪 😂 👏), one of each per player and message.

create table public.message_reactions (
  message_id uuid not null references public.team_messages (id) on delete cascade,
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null check (emoji in ('🔥', '💪', '😂', '👏')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);
create index message_reactions_team_idx on public.message_reactions (team_id);
alter table public.message_reactions enable row level security;
revoke all on public.message_reactions from anon, authenticated;
grant select on public.message_reactions to authenticated;
grant all on public.message_reactions to service_role;
create policy message_reactions_select_member on public.message_reactions
  for select to authenticated using (app_private.is_team_member(team_id));

-- Adds the reaction, or removes it if already there. Returns true when added.
create function public.toggle_reaction(p_message uuid, p_emoji text) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := app_private.require_uid();
  m public.team_messages;
begin
  select * into m from public.team_messages where id = p_message;
  if m.id is null or not app_private.is_team_member(m.team_id) then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if m.deleted_at is not null or p_emoji not in ('🔥', '💪', '😂', '👏') then
    raise exception 'invalid_reaction' using errcode = '22023';
  end if;
  delete from public.message_reactions
   where message_id = p_message and user_id = uid and emoji = p_emoji;
  if found then
    return false;
  end if;
  insert into public.message_reactions (message_id, team_id, user_id, emoji)
  values (p_message, m.team_id, uid, p_emoji);
  return true;
end $$;

-- Push to the person concerned (author, or the player a Canap' line is about): only for the
-- reactor's first reaction on that message, so toggling emojis never spams.
create function app_private.notify_reaction() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  target uuid;
begin
  select m.user_id into target from public.team_messages m where m.id = new.message_id;
  if target is null or target = new.user_id then
    return new;
  end if;
  if exists (select 1 from public.message_reactions r
              where r.message_id = new.message_id and r.user_id = new.user_id
                and r.emoji <> new.emoji) then
    return new;
  end if;
  perform app_private.call_function('notify-chat', jsonb_build_object(
    'reaction', jsonb_build_object(
      'message_id', new.message_id, 'reactor_id', new.user_id, 'emoji', new.emoji)));
  return new;
end $$;

create trigger message_reactions_notify
  after insert on public.message_reactions
  for each row execute function app_private.notify_reaction();

-- Service role: what the reaction push needs.
create function public.svc_reaction_push(p_message uuid, p_reactor uuid)
returns table (team_id uuid, team_name text, target_id uuid, reactor_pseudo text, system boolean)
language sql stable security definer set search_path = ''
as $$
  select m.team_id, t.name, m.user_id, p.pseudo, m.system
    from public.team_messages m
    join public.teams t on t.id = m.team_id
    join public.profiles p on p.id = p_reactor
   where m.id = p_message and m.deleted_at is null
     and exists (select 1 from public.message_reactions r
                  where r.message_id = p_message and r.user_id = p_reactor)
$$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.message_reactions;
  end if;
end $$;

revoke all on function public.toggle_reaction(uuid, text) from public, anon;
grant execute on function public.toggle_reaction(uuid, text) to authenticated, service_role;
revoke all on function app_private.notify_reaction() from public;
revoke all on function public.svc_reaction_push(uuid, uuid) from public, anon, authenticated;
grant execute on function public.svc_reaction_push(uuid, uuid) to service_role;
