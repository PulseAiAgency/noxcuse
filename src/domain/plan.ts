/**
 * "Mon plan de la semaine": the days a player announces (1 = Monday … 7 = Sunday), and the
 * local reminders derived from it. Pure: times are epoch milliseconds, the week is Paris time.
 */
import { gameWeekStart, isAfterDeadline, parisParts } from './week';

export type PlanDay = { iso: number; short: string; label: string };

export const PLAN_DAYS: readonly PlanDay[] = [
  { iso: 1, short: 'L', label: 'lun' },
  { iso: 2, short: 'M', label: 'mar' },
  { iso: 3, short: 'M', label: 'mer' },
  { iso: 4, short: 'J', label: 'jeu' },
  { iso: 5, short: 'V', label: 'ven' },
  { iso: 6, short: 'S', label: 'sam' },
  { iso: 7, short: 'D', label: 'dim' },
];

/** Hours offered for the "C'est ton jour" reminder (local only, never sent to the server). */
export const REMINDER_HOURS = [7, 12, 18, 20] as const;
export const DEFAULT_REMINDER_HOUR = 18;
/** The evening nudge when a planned session is not done yet (Sunday: before the 20:00 close). */
export const EVENING_HOUR = 21;
export const SUNDAY_EVENING_HOUR = 17;
/** On Sunday the week closes at 20:00: the day reminder is never later than this. */
export const SUNDAY_LATEST_HOUR = 15;

/** Unique, sorted, within 1..7. */
export function normalizePlan(days: readonly number[]): number[] {
  return [...new Set(days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7))].sort(
    (a, b) => a - b,
  );
}

export function togglePlanDay(days: readonly number[], iso: number): number[] {
  return normalizePlan(days.includes(iso) ? days.filter((d) => d !== iso) : [...days, iso]);
}

/** « lun · mer · ven ». */
export function planSummary(days: readonly number[]): string {
  return normalizePlan(days)
    .map((d) => PLAN_DAYS[d - 1].label)
    .join(' · ');
}

/** Planned for today (Sunday after 20:00 already belongs to next week's plan). */
export function isPlannedToday(days: readonly number[], now: number): boolean {
  if (isAfterDeadline(now)) return false;
  return days.includes(parisParts(now).weekday);
}

/** Planned days compared with the goal: a gentle hint, never a block. */
export function planHint(days: readonly number[], goal: number): string | null {
  const n = normalizePlan(days).length;
  if (n === 0) return null;
  if (n < goal) return `${n} jour${n > 1 ? 's' : ''} pour un objectif de ${goal} : il en manque.`;
  return null;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Epoch ms of `hour`:00 Paris time on `isoDate`. */
export function parisTime(isoDate: string, hour: number): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, hour);
  const p = parisParts(guess);
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - guess;
  return guess - offset;
}

export type PlanReminder = {
  /** Stable id: "plan-day-2026-11-24", "plan-evening-2026-11-24", "plan-monday". */
  id: string;
  kind: 'day' | 'evening' | 'monday';
  at: number;
  title: string;
  body: string;
};

/** Id of today's evening nudge, cancelled as soon as today's session is validated. */
export function eveningReminderId(isoDate: string): string {
  return `plan-evening-${isoDate}`;
}

/**
 * Reminders of the current game week (only those still in the future) + next Monday's prompt
 * to announce the new plan.
 */
export function planReminders(days: readonly number[], hour: number, now: number): PlanReminder[] {
  const monday = gameWeekStart(now);
  const out: PlanReminder[] = [];
  for (const d of normalizePlan(days)) {
    const date = addDays(monday, d - 1);
    const sunday = d === 7;
    const dayAt = parisTime(date, sunday ? Math.min(hour, SUNDAY_LATEST_HOUR) : hour);
    out.push({
      id: `plan-day-${date}`,
      kind: 'day',
      at: dayAt,
      title: "C'est ton jour 💪",
      body: 'Tu as prévu la salle aujourd’hui. Ta team compte sur toi.',
    });
    const eveningAt = parisTime(date, sunday ? SUNDAY_EVENING_HOUR : EVENING_HOUR);
    if (eveningAt > dayAt) {
      out.push({
        id: eveningReminderId(date),
        kind: 'evening',
        at: eveningAt,
        title: 'Tu avais prévu la salle aujourd’hui…',
        body: sunday
          ? 'Dernière chance : la semaine se termine à 20 h, il te faut 40 minutes.'
          : 'Le Canap’ a déjà sorti les chips. Il reste un peu de temps.',
      });
    }
  }
  out.push({
    id: 'plan-monday',
    kind: 'monday',
    at: parisTime(addDays(monday, 7), 9),
    title: 'Nouvelle semaine 🏋️',
    body: 'Annonce tes jours de salle : ta team verra ton plan.',
  });
  return out.filter((r) => r.at > now);
}
