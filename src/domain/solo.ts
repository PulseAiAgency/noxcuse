/**
 * Solo mode: « Toi contre le Canap' ». A player without teammates still plays, against the
 * mascot: every week held is a point for you, every SKIP a point for the Canap'.
 * Pure functions, fed by the team history (a solo player has a team of one).
 */

import type { WeekRisk } from './week';

/** Name of the team created by « Seul pour l'instant » (fits the 32-character team name limit). */
export const SOLO_TEAM_NAME = 'Moi vs le Canap’';

export type SoloWeek = { isTeamPr: boolean; skipsCount: number };

export type SoloScore = { me: number; canap: number };

/** Closed weeks: held = a point for you, a SKIP = a point for the Canap'. Joker weeks count for nobody. */
export function soloScore(weeks: readonly SoloWeek[]): SoloScore {
  return weeks.reduce(
    (s, w) => ({ me: s.me + (w.isTeamPr ? 1 : 0), canap: s.canap + (w.skipsCount > 0 ? 1 : 0) }),
    { me: 0, canap: 0 },
  );
}

export type CanapMood = 'idle' | 'smug' | 'sad';

/** Who leads, drawn on the Canap's face. */
export function soloMood(score: SoloScore): CanapMood {
  if (score.me > score.canap) return 'sad';
  if (score.canap > score.me) return 'smug';
  return 'idle';
}

export function soloHeadline(score: SoloScore): string {
  if (score.me === 0 && score.canap === 0) return 'Premier round cette semaine.';
  if (score.me > score.canap) return 'Tu mènes. Le Canap’ boude.';
  if (score.canap > score.me) return 'Le Canap’ mène. Il ricane déjà.';
  return 'Égalité. Le Canap’ attend ton faux pas.';
}

/** This week's round, from the live board. */
export function soloWeekLine(done: number, goal: number, risk: WeekRisk, joker: boolean): string {
  if (joker) return 'Joker blessure : ce round ne compte pas. Soigne-toi.';
  if (done >= goal) return 'Round gagné cette semaine. Le Canap’ n’aura rien.';
  const left = goal - done;
  const seances = left === 1 ? '1 séance' : `${left} séances`;
  if (risk === 'lost') return 'Round perdu. Dimanche, le Canap’ t’envoie sa carte.';
  if (risk === 'shaky')
    return `Plus le droit à l’erreur : ${seances}, il faut y aller tous les jours restants.`;
  return `Encore ${seances} pour battre le Canap’ cette semaine.`;
}
