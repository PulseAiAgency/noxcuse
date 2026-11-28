import { SOLO_TEAM_NAME, soloHeadline, soloMood, soloScore, soloWeekLine } from '../solo';
import { validateTeamName } from '../teams';

describe('solo mode', () => {
  it('scores held weeks for the player and SKIP weeks for the Canap', () => {
    expect(
      soloScore([
        { isTeamPr: true, skipsCount: 0 },
        { isTeamPr: false, skipsCount: 1 },
        { isTeamPr: true, skipsCount: 0 },
        // Joker week: nobody scores.
        { isTeamPr: false, skipsCount: 0 },
      ]),
    ).toEqual({ me: 2, canap: 1 });
    expect(soloScore([])).toEqual({ me: 0, canap: 0 });
  });

  it('draws the leader on the Canap face', () => {
    expect(soloMood({ me: 3, canap: 1 })).toBe('sad');
    expect(soloMood({ me: 0, canap: 2 })).toBe('smug');
    expect(soloMood({ me: 1, canap: 1 })).toBe('idle');
  });

  it('says who leads', () => {
    expect(soloHeadline({ me: 0, canap: 0 })).toMatch(/Premier round/);
    expect(soloHeadline({ me: 2, canap: 0 })).toMatch(/Tu mènes/);
    expect(soloHeadline({ me: 0, canap: 1 })).toMatch(/Le Canap’ mène/);
    expect(soloHeadline({ me: 1, canap: 1 })).toMatch(/Égalité/);
  });

  it('describes the current round', () => {
    expect(soloWeekLine(3, 3, 'achieved', false)).toMatch(/Round gagné/);
    expect(soloWeekLine(1, 3, 'safe', false)).toBe(
      'Encore 2 séances pour battre le Canap’ cette semaine.',
    );
    expect(soloWeekLine(2, 3, 'safe', false)).toBe(
      'Encore 1 séance pour battre le Canap’ cette semaine.',
    );
    expect(soloWeekLine(0, 3, 'shaky', false)).toMatch(/Plus le droit à l’erreur : 3 séances/);
    expect(soloWeekLine(0, 3, 'lost', false)).toMatch(/Round perdu/);
    expect(soloWeekLine(0, 3, 'safe', true)).toMatch(/Joker/);
  });

  it('uses a valid team name for the solo team', () => {
    expect(validateTeamName(SOLO_TEAM_NAME)).toBeNull();
  });
});
