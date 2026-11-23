import assert from 'node:assert/strict';

import { cronAuthorizer } from '../_shared/cron.ts';
import type { PushMessage } from '../_shared/push.ts';
import { chatPreview, createHandler } from './handler.ts';

const SECRET = 'c'.repeat(40);
const MSG = '33333333-3333-4333-8333-333333333333';

function setup(gone = false) {
  const pushed: PushMessage[][] = [];
  const handler = createHandler({
    authorize: cronAuthorizer((s) => Promise.resolve(s === SECRET)),
    store: {
      info: () =>
        Promise.resolve(
          gone
            ? null
            : {
                team_id: 't1',
                team_name: 'Les Guerriers',
                author_id: 'a',
                author_pseudo: 'Sam',
                body: 'On y va ?',
              },
        ),
      reaction: () =>
        Promise.resolve(
          gone
            ? null
            : {
                team_id: 't1',
                team_name: 'Les Guerriers',
                target_id: 'a',
                reactor_pseudo: 'Alex',
                system: true,
              },
        ),
      targets: () =>
        Promise.resolve([
          { user_id: 'a', token: 'tok-author' },
          { user_id: 'b', token: 'tok-mate' },
        ]),
      deleteTokens: () => Promise.resolve(),
    },
    push: (m) => {
      pushed.push(m);
      return Promise.resolve({ sent: m.length, invalidTokens: [] });
    },
  });
  return { handler, pushed };
}

const post = (body: unknown, secret: string | null = SECRET) =>
  new Request('http://localhost/notify-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(secret ? { 'x-cron-secret': secret } : {}) },
    body: JSON.stringify(body),
  });

Deno.test('only the database can call it', async () => {
  const { handler } = setup();
  assert.equal((await handler(post({ message_id: MSG }, null))).status, 401);
  assert.equal((await handler(post({ message_id: 'x' }))).status, 400);
});

Deno.test('notifies teammates, never the author, and opens the team chat', async () => {
  const { handler, pushed } = setup();
  const res = await handler(post({ message_id: MSG }));
  assert.deepEqual(await res.json(), { sent: 1 });
  assert.equal(pushed[0].length, 1);
  assert.equal(pushed[0][0].to, 'tok-mate');
  assert.equal(pushed[0][0].title, 'Les Guerriers');
  assert.equal(pushed[0][0].body, 'Sam : On y va ?');
  assert.deepEqual(pushed[0][0].data, { type: 'chat', team_id: 't1' });
});

Deno.test('a deleted message is not announced; long ones are cut', async () => {
  const { handler, pushed } = setup(true);
  assert.deepEqual(await (await handler(post({ message_id: MSG }))).json(), {
    sent: 0,
    skipped: 'gone',
  });
  assert.equal(pushed.length, 0);
  assert.equal(chatPreview('Sam', 'a'.repeat(300)).length, 140);
});

Deno.test('a reaction pushes only the person concerned', async () => {
  const { handler, pushed } = setup();
  const body = { reaction: { message_id: MSG, reactor_id: MSG, emoji: '🔥' } };
  assert.deepEqual(await (await handler(post(body))).json(), { sent: 1 });
  assert.equal(pushed[0].length, 1);
  assert.equal(pushed[0][0].to, 'tok-author');
  assert.equal(pushed[0][0].body, 'Alex a réagi 🔥 à ta séance');
  assert.equal(
    (await handler(post({ reaction: { message_id: MSG, reactor_id: MSG, emoji: '🍕' } }))).status,
    400,
  );
});
