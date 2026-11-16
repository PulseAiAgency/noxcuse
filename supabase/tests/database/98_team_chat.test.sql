begin;

select tests.create_user('owner@chat.local') as owner \gset
select tests.create_user('mate@chat.local') as mate \gset
select tests.create_user('out@chat.local') as outsider \gset

select tests.authenticate_as(:'owner');
select id as team, invite_code as code from public.create_team('Bavards') \gset
select tests.reset_role();
select tests.as_service();
select public.svc_join_team(:'mate', :'code');
select tests.reset_role();

-- Members talk; the text is trimmed and bounded.
select tests.authenticate_as(:'mate');
select public.send_team_message(:'team', '  On y va ce soir ?  ') as m1 \gset
select tests.eq((select body from public.team_messages where id = :'m1'), 'On y va ce soir ?', 'message trimmed and stored');
select tests.throws(format('select public.send_team_message(%L, %L)', :'team', '   '), 'invalid_message', 'empty message refused');
select tests.throws(format('select public.send_team_message(%L, %L)', :'team', repeat('a', 501)), 'invalid_message', 'too long refused');
select tests.throws(format('insert into public.team_messages (team_id, user_id, body) values (%L, auth.uid(), %L)', :'team', 'x'),
                    '42501', 'no direct insert');
select tests.reset_role();

-- Outsiders neither read nor write.
select tests.authenticate_as(:'outsider');
select tests.eq((select count(*) from public.team_messages)::int, 0, 'outsiders read nothing');
select tests.throws(format('select public.send_team_message(%L, %L)', :'team', 'coucou'), 'not_found', 'outsiders cannot post');
select tests.reset_role();

-- Reporting: not your own message, a teammate's is stored with the excerpt.
select tests.authenticate_as(:'owner');
select tests.eq((select count(*) from public.team_messages)::int, 1, 'teammates read the chat');
select public.report_team_message(:'m1', 'Spam');
select tests.reset_role();
select tests.eq((select count(*) from public.member_reports where message_id = :'m1')::int, 1, 'report stored with the message');
select tests.authenticate_as(:'mate');
select tests.throws(format('select public.report_team_message(%L, %L)', :'m1', 'x'), 'not_allowed', 'cannot report yourself');
select tests.reset_role();

-- Deleting: the author or the owner; the text is wiped.
select tests.authenticate_as(:'owner');
select public.send_team_message(:'team', 'Moi je viens') as m2 \gset
select tests.reset_role();
select tests.authenticate_as(:'mate');
select tests.throws(format('select public.delete_team_message(%L)', :'m2'), 'not_allowed', 'a member cannot delete another message');
select tests.reset_role();
select tests.authenticate_as(:'owner');
select public.delete_team_message(:'m1');
select tests.eq((select body from public.team_messages where id = :'m1'), '—', 'owner moderation wipes the text');
select tests.reset_role();

-- Flood guard.
select tests.authenticate_as(:'mate');
select public.send_team_message(:'team', 'msg ' || g) from generate_series(1, 19) g;
select tests.throws(format('select public.send_team_message(%L, %L)', :'team', 'encore'), 'too_many_messages', '20 a minute max');
select tests.reset_role();

rollback;
