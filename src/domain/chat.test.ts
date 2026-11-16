import { cleanMessage, continuesPrevious, MESSAGE_MAX, messageTime } from './chat';

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
