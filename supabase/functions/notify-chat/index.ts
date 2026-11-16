// notify-chat: tells teammates about a new team chat message (first message of a burst only, see
// the database trigger). Called through pg_net with the shared `x-cron-secret` header.
import { adminClient, requireEnv } from '../_shared/auth.ts';
import { cronAuthorizer } from '../_shared/cron.ts';
import { sendPush } from '../_shared/push.ts';
import { createHandler } from './handler.ts';
import { cronSecretChecker, supabaseChatStore } from './store.ts';

const db = adminClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
const expoAccessToken = Deno.env.get('EXPO_ACCESS_TOKEN') ?? undefined;

Deno.serve(
  createHandler({
    authorize: cronAuthorizer(cronSecretChecker(db)),
    store: supabaseChatStore(db),
    push: (messages) => sendPush(fetch, messages, expoAccessToken),
  }),
);
