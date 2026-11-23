import { z } from 'zod';

import type { CronAuthorizer } from '../_shared/cron.ts';
import { corsHeaders, errorResponse, HttpError, json, log, readJson } from '../_shared/http.ts';
import type { PushMessage } from '../_shared/push.ts';

export type ChatInfo = {
  team_id: string;
  team_name: string;
  author_id: string;
  author_pseudo: string | null;
  body: string;
};

export type ReactionInfo = {
  team_id: string;
  team_name: string;
  /** The message author, or the player a Canap' line is about. */
  target_id: string;
  reactor_pseudo: string | null;
  /** true for a Canap' line (a session), false for a player's message. */
  system: boolean;
};

export interface ChatStore {
  info(messageId: string): Promise<ChatInfo | null>;
  reaction(messageId: string, reactorId: string): Promise<ReactionInfo | null>;
  /** Teammates' phones with the « chat » preference on (the author included, filtered here). */
  targets(teamId: string): Promise<{ user_id: string; token: string }[]>;
  deleteTokens(tokens: string[]): Promise<void>;
}

export type Deps = {
  authorize: CronAuthorizer;
  store: ChatStore;
  push: (messages: PushMessage[]) => Promise<{ sent: number; invalidTokens: string[] }>;
};

export const inputSchema = z.union([
  z.object({ message_id: z.uuid() }).strict(),
  z
    .object({
      reaction: z
        .object({
          message_id: z.uuid(),
          reactor_id: z.uuid(),
          emoji: z.enum(['🔥', '💪', '😂', '👏']),
        })
        .strict(),
    })
    .strict(),
]);

/** « Alex a réagi 🔥 à ta séance ». */
export function reactionText(pseudo: string | null, emoji: string, system: boolean): string {
  return `${pseudo ?? 'Un pote'} a réagi ${emoji} à ${system ? 'ta séance' : 'ton message'}`;
}

/** « Sam : on y va ce soir ? », cut to fit a notification. */
export function chatPreview(pseudo: string | null, body: string): string {
  const text = `${pseudo ?? 'Un pote'} : ${body}`;
  return text.length > 140 ? `${text.slice(0, 139)}…` : text;
}

export function createHandler(deps: Deps) {
  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
    try {
      if (req.method !== 'POST') throw new HttpError(405, 'method_not_allowed');
      await deps.authorize(req);
      const parsed = inputSchema.safeParse(await readJson(req));
      if (!parsed.success) throw new HttpError(400, 'invalid_input');
      if ('reaction' in parsed.data) {
        const r = parsed.data.reaction;
        const info = await deps.store.reaction(r.message_id, r.reactor_id);
        if (!info) return json({ sent: 0, skipped: 'gone' });
        const tokens = (await deps.store.targets(info.team_id)).filter(
          (t) => t.user_id === info.target_id,
        );
        let sent = 0;
        if (tokens.length) {
          const result = await deps.push(
            tokens.map((t) => ({
              to: t.token,
              title: info.team_name,
              body: reactionText(info.reactor_pseudo, r.emoji, info.system),
              sound: 'default',
              data: { type: 'chat', team_id: info.team_id },
            })),
          );
          sent = result.sent;
          if (result.invalidTokens.length) await deps.store.deleteTokens(result.invalidTokens);
        }
        log('info', 'notify-chat', 'reaction_done', { sent });
        return json({ sent });
      }
      const info = await deps.store.info(parsed.data.message_id);
      if (!info) return json({ sent: 0, skipped: 'gone' });

      const tokens = (await deps.store.targets(info.team_id)).filter(
        (t) => t.user_id !== info.author_id,
      );
      let sent = 0;
      if (tokens.length) {
        const result = await deps.push(
          tokens.map((t) => ({
            to: t.token,
            title: info.team_name,
            body: chatPreview(info.author_pseudo, info.body),
            sound: 'default',
            data: { type: 'chat', team_id: info.team_id },
          })),
        );
        sent = result.sent;
        if (result.invalidTokens.length) await deps.store.deleteTokens(result.invalidTokens);
      }
      log('info', 'notify-chat', 'done', { sent });
      return json({ sent });
    } catch (err) {
      return errorResponse(err, 'notify-chat');
    }
  };
}
