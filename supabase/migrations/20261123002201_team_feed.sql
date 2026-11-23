-- Live team feed: Canap' system messages in the team chat + emoji reactions.

alter table public.team_messages add column system boolean not null default false;

-- Players' own messages only count towards the flood guard; the Canap' never does.
create or replace function public.send_team_message(p_team uuid, p_body text) returns uuid
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
  if (select count(*) from public.team_messages m
       where m.team_id = p_team and m.user_id = uid and not m.system
         and m.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too_many_messages' using errcode = 'P0001';
  end if;
  insert into public.team_messages (team_id, user_id, body) values (p_team, uid, msg)
  returning id into v_id;
  return v_id;
end $$;

-- The Canap's lines are not reportable (they are ours, not a player's).
create or replace function public.report_team_message(p_message uuid, p_reason text) returns void
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
  if m.user_id = uid or m.system then
    raise exception 'not_allowed' using errcode = '42501';
  end if;
  insert into public.member_reports (team_id, reporter_id, reported_id, reason, message_id)
  values (m.team_id, uid, m.user_id,
          left(coalesce(nullif(btrim(p_reason), ''), 'Message signalé') || ' · « ' || m.body || ' »', 500),
          m.id);
end $$;

-- No chat push for the Canap's lines: validate-session already pushes "vient de charger 20 kg".
create or replace function app_private.notify_team_message() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.system then
    return new;
  end if;
  if not exists (
    select 1 from public.team_messages m
     where m.team_id = new.team_id and m.user_id = new.user_id and m.id <> new.id
       and not m.system
       and m.created_at > new.created_at - interval '2 minutes') then
    perform app_private.call_function('notify-chat', jsonb_build_object('message_id', new.id));
  end if;
  return new;
end $$;

-- A validated session → one Canap' line in each of the player's teams.
create function app_private.sessions_feed() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  who text;
  done int;
  goal int;
  line text;
  lines text[] := array[
    '%s vient de charger 20 kg. Le Canap'' boude.',
    'Disque chargé par %s. Le Canap'' fait semblant de dormir.',
    '%s a fait sa séance. Le Canap'' range ses chips.',
    '+20 kg pour %s. Le Canap'' accuse le coup.',
    '%s a choisi la salle. Le Canap'' reste seul avec la télécommande.'
  ];
begin
  if old.validated_at is not null or new.validated_at is null then
    return new;
  end if;
  select coalesce(nullif(btrim(p.pseudo), ''), 'Un pote') into who
    from public.profiles p where p.id = new.user_id;
  select count(*) into done from public.sessions s
   where s.user_id = new.user_id and s.validated_at is not null and s.week_start = new.week_start;
  goal := app_private.effective_goal(new.user_id, new.week_start);
  if done = goal then
    line := format('%s a tenu son objectif de la semaine (%s/%s). Le Canap'' n''aura rien de ce côté-là. 🏆',
                   who, done, goal);
  else
    line := format(lines[1 + floor(random() * array_length(lines, 1))::int], who);
  end if;
  insert into public.team_messages (team_id, user_id, body, system)
  select m.team_id, new.user_id, left(line, 500), true
    from public.team_members m where m.user_id = new.user_id;
  return new;
end $$;

create trigger sessions_feed
  after update of validated_at on public.sessions
  for each row execute function app_private.sessions_feed();

revoke all on function app_private.sessions_feed() from public;
