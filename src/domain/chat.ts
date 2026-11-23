/** Team chat rules shared with the server (send_team_message). Pure. */

export const MESSAGE_MAX = 500;

/** Trimmed text to send, or null when it cannot be sent (empty or too long). */
export function cleanMessage(input: string): string | null {
  const text = input.trim();
  return text.length >= 1 && text.length <= MESSAGE_MAX ? text : null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

/** « 20:05 » today, « Hier 20:05 », « lun. 20:05 » this week, « 12/11 20:05 » before. */
export function messageTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86_400_000);
  if (diff <= 0) return time;
  if (diff === 1) return `Hier ${time}`;
  if (diff < 7) return `${DAYS[d.getDay()]} ${time}`;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${time}`;
}

/** Same author within 5 minutes: the bubble is grouped (no repeated name). */
export function continuesPrevious(
  prev: { user_id: string; created_at: string; system?: boolean } | undefined,
  msg: { user_id: string; created_at: string; system?: boolean },
): boolean {
  // The Canap's lines always stand alone.
  if (!prev || prev.system || msg.system || prev.user_id !== msg.user_id) return false;
  return Date.parse(msg.created_at) - Date.parse(prev.created_at) < 5 * 60_000;
}

/** Reactions offered on every message (same list as the server). */
export const REACTIONS = ['🔥', '💪', '😂', '👏'] as const;
export type Reaction = (typeof REACTIONS)[number];

export type ReactionRow = { message_id: string; user_id: string; emoji: string };
export type ReactionCount = { emoji: Reaction; count: number; mine: boolean };

/** Per message, the reactions in the fixed order 🔥 💪 😂 👏 (only those with at least one). */
export function groupReactions(
  rows: readonly ReactionRow[],
  me: string | undefined,
): Record<string, ReactionCount[]> {
  const byMessage: Record<string, Map<string, ReactionCount>> = {};
  for (const r of rows) {
    if (!(REACTIONS as readonly string[]).includes(r.emoji)) continue;
    const m = (byMessage[r.message_id] ??= new Map());
    const c = m.get(r.emoji) ?? { emoji: r.emoji as Reaction, count: 0, mine: false };
    c.count += 1;
    if (r.user_id === me) c.mine = true;
    m.set(r.emoji, c);
  }
  return Object.fromEntries(
    Object.entries(byMessage).map(([id, m]) => [
      id,
      REACTIONS.filter((e) => m.has(e)).map((e) => m.get(e) as ReactionCount),
    ]),
  );
}
