-- Team chat: one conversation per team, visible only to its members. Messages are written only
-- through send_team_message (membership, length, rate limit), soft-deleted by their author or the
-- team owner, reportable (member_reports.message_id). Realtime: the table is in the
-- supabase_realtime publication, RLS filters what each player receives.

create table public.team_messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index team_messages_team_idx on public.team_messages (team_id, created_at desc);
alter table public.team_messages enable row level security;
revoke all on public.team_messages from anon, authenticated;
grant select on public.team_messages to authenticated;
grant all on public.team_messages to service_role;
create policy team_messages_select_member on public.team_messages
  for select to authenticated using (app_private.is_team_member(team_id));

alter table public.member_reports
  add column message_id uuid references public.team_messages (id) on delete set null;

create function public.send_team_message(p_team uuid, p_body text) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := app_private.require_uid();
  msg text := btrim(coalesce(p_body, ''));
  v_id uuid;
begin
  if not app_private.is_team_member(p_team) then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if char_length(msg) < 1 or char_length(msg) > 500 then
    raise exception 'invalid_message' using errcode = '22023';
  end if;
  -- Flood guard: 20 messages a minute per player and team.
  if (select count(*) from public.team_messages m
       where m.team_id = p_team and m.user_id = uid
         and m.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too_many_messages' using errcode = 'P0001';
  end if;
  insert into public.team_messages (team_id, user_id, body) values (p_team, uid, msg)
  returning id into v_id;
  return v_id;
end $$;

-- The author, or the team owner (moderation), removes a message: its text is wiped for good.
create function public.delete_team_message(p_message uuid) returns void
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
  if m.user_id <> uid and not exists (
    select 1 from public.team_members tm
     where tm.team_id = m.team_id and tm.user_id = uid and tm.role = 'owner') then
    raise exception 'not_allowed' using errcode = '42501';
  end if;
  update public.team_messages set body = '—', deleted_at = now()
   where id = p_message and deleted_at is null;
end $$;

-- Report a message to the publisher (reviewed from the dashboard, Apple guideline 1.2).
create function public.report_team_message(p_message uuid, p_reason text) returns void
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
  if m.user_id = uid then
    raise exception 'not_allowed' using errcode = '42501';
  end if;
  insert into public.member_reports (team_id, reporter_id, reported_id, reason, message_id)
  values (m.team_id, uid, m.user_id,
          left(coalesce(nullif(btrim(p_reason), ''), 'Message signalé') || ' · « ' || m.body || ' »', 500),
          m.id);
end $$;

-- Push: teammates are told about a new message (not for every message of a burst).
create function app_private.notify_team_message() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.team_messages m
     where m.team_id = new.team_id and m.user_id = new.user_id and m.id <> new.id
       and m.created_at > new.created_at - interval '2 minutes') then
    perform app_private.call_function('notify-chat', jsonb_build_object('message_id', new.id));
  end if;
  return new;
end $$;

create trigger team_messages_notify
  after insert on public.team_messages
  for each row execute function app_private.notify_team_message();

-- Service role: what the push needs (never the message history).
create function public.svc_chat_push(p_message uuid)
returns table (team_id uuid, team_name text, author_id uuid, author_pseudo text, body text)
language sql stable security definer set search_path = ''
as $$
  select m.team_id, t.name, m.user_id, p.pseudo, m.body
    from public.team_messages m
    join public.teams t on t.id = m.team_id
    join public.profiles p on p.id = m.user_id
   where m.id = p_message and m.deleted_at is null
$$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.team_messages;
  end if;
end $$;

revoke all on function public.send_team_message(uuid, text), public.delete_team_message(uuid),
  public.report_team_message(uuid, text) from public, anon;
grant execute on function public.send_team_message(uuid, text), public.delete_team_message(uuid),
  public.report_team_message(uuid, text) to authenticated, service_role;
revoke all on function app_private.notify_team_message() from public;
revoke all on function public.svc_chat_push(uuid) from public, anon, authenticated;
grant execute on function public.svc_chat_push(uuid) to service_role;
