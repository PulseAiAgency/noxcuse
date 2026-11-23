import {
  eveningReminderId,
  isPlannedToday,
  normalizePlan,
  parisTime,
  planHint,
  planReminders,
  planSummary,
  togglePlanDay,
} from './plan';

// Tuesday 24 Nov 2026, 10:00 Paris (UTC+1).
const TUE_10 = Date.UTC(2026, 10, 24, 9, 0);

describe('weekly plan', () => {
  it('normalizes and toggles days', () => {
    expect(normalizePlan([5, 1, 3, 3, 0, 8])).toEqual([1, 3, 5]);
    expect(togglePlanDay([1, 3], 3)).toEqual([1]);
    expect(togglePlanDay([1, 3], 2)).toEqual([1, 2, 3]);
  });

  it('summarizes and hints', () => {
    expect(planSummary([5, 1, 3])).toBe('lun · mer · ven');
    expect(planHint([1, 3], 3)).toBe('2 jours pour un objectif de 3 : il en manque.');
    expect(planHint([1, 3, 5], 3)).toBeNull();
    expect(planHint([], 3)).toBeNull();
  });

  it('knows whether today is planned', () => {
    expect(isPlannedToday([2], TUE_10)).toBe(true);
    expect(isPlannedToday([1, 3], TUE_10)).toBe(false);
    // Sunday 29 Nov, 21:00 Paris: the week is closed.
    expect(isPlannedToday([7], Date.UTC(2026, 10, 29, 20, 0))).toBe(false);
  });

  it('converts Paris wall-clock time, winter and summer', () => {
    expect(parisTime('2026-11-24', 18)).toBe(Date.UTC(2026, 10, 24, 17, 0));
    expect(parisTime('2026-07-14', 18)).toBe(Date.UTC(2026, 6, 14, 16, 0));
  });

  it('schedules only future reminders of this week, plus next Monday', () => {
    const r = planReminders([1, 2, 7], 18, TUE_10);
    expect(r.map((x) => x.id)).toEqual([
      'plan-day-2026-11-24',
      'plan-evening-2026-11-24',
      'plan-day-2026-11-29',
      'plan-evening-2026-11-29',
      'plan-monday',
    ]);
    // Monday is past; Sunday's nudge comes before the 20:00 close.
    expect(r[2].at).toBe(parisTime('2026-11-29', 15));
    expect(r[3].at).toBe(parisTime('2026-11-29', 17));
    expect(r[3].body).toMatch(/20 h/);
    expect(r[4].at).toBe(parisTime('2026-11-30', 9));
    expect(eveningReminderId('2026-11-24')).toBe('plan-evening-2026-11-24');
  });

  it('never reminds after the evening nudge', () => {
    const r = planReminders([3], 20, TUE_10);
    expect(r.map((x) => x.kind)).toEqual(['day', 'evening', 'monday']);
    expect(r[0].at).toBeLessThan(r[1].at);
  });
});
