import type { SupabaseClient } from '@supabase/supabase-js';

import type { ChatInfo, ChatStore, ReactionInfo } from './handler.ts';

async function call<T>(db: SupabaseClient, fn: string, args: Record<string, unknown> = {}) {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}

export function supabaseChatStore(db: SupabaseClient): ChatStore {
  return {
    info: async (id) => (await call<ChatInfo[]>(db, 'svc_chat_push', { p_message: id }))[0] ?? null,
    reaction: async (messageId, reactorId) =>
      (
        await call<ReactionInfo[]>(db, 'svc_reaction_push', {
          p_message: messageId,
          p_reactor: reactorId,
        })
      )[0] ?? null,
    targets: (teamId) =>
      call<{ user_id: string; token: string }[]>(db, 'svc_team_push_targets', {
        p_team: teamId,
        p_pref: 'chat',
      }),
    deleteTokens: async (tokens) => {
      await call(db, 'svc_delete_push_tokens', { p_tokens: tokens });
    },
  };
}

export function cronSecretChecker(db: SupabaseClient) {
  return (secret: string) => call<boolean>(db, 'svc_cron_secret_ok', { p_secret: secret });
}
