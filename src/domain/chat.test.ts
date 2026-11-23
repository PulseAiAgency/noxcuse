import { groupReactions, cleanMessage, continuesPrevious, MESSAGE_MAX, messageTime } from './chat';

describe('team chat', () => {
  it('cleans what is sent, like the server', () => {
    expect(cleanMessage('  salut  ')).toBe('salut');
    expect(cleanMessage('   ')).toBeNull();
    expect(cleanMessage('a'.repeat(MESSAGE_MAX + 1))).toBeNull();
  });

  it('labels times like a messaging app', () => {
    const now = new Date(2026, 10, 16, 21, 0);
    expect(messageTime(new Date(2026, 10, 16, 20, 5).toISOString(), now)).toBe('20:05');
    expect(messageTime(new Date(2026, 10, 15, 20, 5).toISOString(), now)).toBe('Hier 20:05');
    expect(messageTime(new Date(2026, 10, 12, 8, 0).toISOString(), now)).toBe('jeu. 08:00');
    expect(messageTime(new Date(2026, 10, 2, 8, 0).toISOString(), now)).toBe('02/11 08:00');
  });

  it('groups a burst from the same player', () => {
    const a = { user_id: 'a', created_at: '2026-11-16T20:00:00Z' };
    expect(continuesPrevious(a, { user_id: 'a', created_at: '2026-11-16T20:03:00Z' })).toBe(true);
    expect(continuesPrevious(a, { user_id: 'a', created_at: '2026-11-16T20:09:00Z' })).toBe(false);
    expect(continuesPrevious(a, { user_id: 'b', created_at: '2026-11-16T20:01:00Z' })).toBe(false);
    expect(continuesPrevious(undefined, a)).toBe(false);
  });
});

describe('reactions', () => {
  it('groups in a fixed order with counts and my own', () => {
    const rows = [
      { message_id: 'm1', user_id: 'a', emoji: '💪' },
      { message_id: 'm1', user_id: 'b', emoji: '🔥' },
      { message_id: 'm1', user_id: 'me', emoji: '🔥' },
      { message_id: 'm2', user_id: 'a', emoji: '🍕' },
    ];
    expect(groupReactions(rows, 'me')).toEqual({
      m1: [
        { emoji: '🔥', count: 2, mine: true },
        { emoji: '💪', count: 1, mine: false },
      ],
    });
  });

  it("never groups the Canap's lines", () => {
    const t = '2026-11-23T18:00:00Z';
    expect(
      continuesPrevious(
        { user_id: 'a', created_at: t, system: true },
        { user_id: 'a', created_at: t },
      ),
    ).toBe(false);
  });
});
