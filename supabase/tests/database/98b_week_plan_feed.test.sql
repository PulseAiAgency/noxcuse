-- Weekly plan, Canap' lines in the chat and reactions.
begin;

select tests.create_user('plan-owner@test.local') as owner \gset
select tests.create_user('plan-mate@test.local') as mate \gset
select tests.create_user('plan-out@test.local') as outsider \gset
update public.profiles set pseudo = 'Jo' where id = :'owner';
insert into public.gyms (osm_id, name, lat, lng) values ('node/9801', 'Salle', 50.63, 3.06) returning id as gym \gset

select tests.authenticate_as(:'owner');
select id as team, invite_code as code from public.create_team('Planifiés') \gset
select tests.reset_role();
select tests.as_service();
select public.svc_join_team(:'mate', :'code');
select tests.reset_role();

-- Plan: cleaned (unique, sorted), visible to teammates, never to outsiders.
select tests.authenticate_as(:'owner');
select tests.eq(public.set_week_plan(array[5, 1, 3, 3]::smallint[])::text, '{1,3,5}', 'plan cleaned and sorted');
select tests.throws('select public.set_week_plan(array[0]::smallint[])', 'invalid_plan', 'day 0 refused');
select tests.throws('select public.set_week_plan(array[8]::smallint[])', 'invalid_plan', 'day 8 refused');
select tests.eq(public.set_week_plan(array[2, 4]::smallint[])::text, '{2,4}', 'plan replaced');
select tests.throws('insert into public.week_plans (user_id, week_start, days) values (auth.uid(), current_date, ''{1}'')',
                    '42501', 'no direct insert');
select tests.reset_role();

select tests.authenticate_as(:'mate');
select tests.eq((select days::text from public.team_week_plans(:'team') where user_id = :'owner'), '{2,4}',
                'teammates see the plan');
select tests.eq((select count(*) from public.week_plans)::int, 1, 'teammates read the plan rows');
select tests.reset_role();

select tests.authenticate_as(:'outsider');
select tests.eq((select count(*) from public.week_plans)::int, 0, 'outsiders read no plan');
select tests.throws(format('select * from public.team_week_plans(%L)', :'team'), 'not_found', 'outsiders cannot list plans');
select tests.reset_role();

select tests.authenticate_as(:'owner');
select public.set_week_plan('{}'::smallint[]);
select tests.eq((select count(*) from public.week_plans)::int, 0, 'empty plan clears it');
select tests.reset_role();

-- A validated session posts one Canap' line in the team chat.
insert into public.sessions (user_id, gym_id, source, started_at, ended_at, duration_min, local_date, week_start)
values (:'owner', :'gym', 'geofence', now() - interval '1 hour', now(), 45, current_date,
        app_private.game_week_start(now()))
returning id as sess \gset
update public.sessions set validated_at = now() where id = :'sess';
select tests.eq((select count(*) from public.team_messages where team_id = :'team' and system)::int, 1,
                'one Canap'' line per validated session');
select tests.ok((select body like '%Jo%' from public.team_messages where team_id = :'team' and system),
                'the line names the player');
select id as canap from public.team_messages where team_id = :'team' and system \gset

-- Canap' lines do not count towards the flood guard and cannot be reported.
select tests.authenticate_as(:'mate');
select tests.throws(format('select public.report_team_message(%L, %L)', :'canap', 'x'), 'not_allowed',
                    'Canap'' lines are not reportable');

-- Reactions: toggle, one per emoji, members only.
select tests.eq(public.toggle_reaction(:'canap', '🔥'), true, 'reaction added');
select tests.eq(public.toggle_reaction(:'canap', '💪'), true, 'second emoji added');
select tests.eq((select count(*) from public.message_reactions where active)::int, 2, 'teammates read reactions');
select tests.eq(public.toggle_reaction(:'canap', '🔥'), false, 'same emoji again switches it off');
select tests.eq((select count(*) from public.message_reactions where active)::int, 1, 'switched-off reaction no longer counted');
select tests.eq(public.toggle_reaction(:'canap', '🔥'), true, 'and on again');
select tests.throws(format('select public.toggle_reaction(%L, %L)', :'canap', '🍕'), 'invalid_reaction', 'unknown emoji refused');
select tests.throws(format('insert into public.message_reactions (message_id, team_id, user_id, emoji) values (%L, %L, auth.uid(), %L)',
                           :'canap', :'team', '👏'), '42501', 'no direct insert');
select tests.reset_role();

select tests.authenticate_as(:'outsider');
select tests.eq((select count(*) from public.message_reactions)::int, 0, 'outsiders read no reaction');
select tests.throws(format('select public.toggle_reaction(%L, %L)', :'canap', '👏'), 'not_found', 'outsiders cannot react');
select tests.reset_role();

select tests.as_service();
select tests.eq((select reactor_pseudo from public.svc_reaction_push(:'canap', :'mate')), (select pseudo from public.profiles where id = :'mate'),
                'push info for the reactor');
select tests.reset_role();

rollback;
