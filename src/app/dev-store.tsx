import type React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ChatIcon, HistoryIcon, InviteIcon, TimerIcon } from '@/components/icons/GameIcons';
import { MapBackdrop } from '@/components/MapBackdrop';
import { PlayerRow } from '@/components/PlayerRow';
import { ProgressRing } from '@/components/ProgressRing';
import { TeamBar } from '@/components/TeamBar';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Text } from '@/components/ui/Text';
import { platesFor } from '@/domain/bar';
import { colors, glass, radii, spacing } from '@/theme/tokens';

const noop = () => undefined;

/** Static twin of RoundGlassButton (the pressable wrapper does not paint its icon in web exports). */
function Round({ children, main }: { children: React.ReactNode; main?: boolean }) {
  const d = main ? glass.roundButtonMain : glass.roundButton;
  return (
    <GlassPanel
      radius={d / 2}
      style={[styles.round, { width: d, height: d }, main && styles.roundMain]}
    >
      <View style={styles.icon}>{children}</View>
    </GlassPanel>
  );
}

/** Development-only: full screens with sample data, for the App Store screenshots. */
export default function DevStore() {
  const screen = useLocalSearchParams<{ screen?: string }>().screen ?? 'team';
  if (!__DEV__) return <Redirect href="/" />;
  if (screen === 'session') return <SessionSample />;
  if (screen === 'chat') return <ChatSample />;
  return <TeamSample />;
}

const players = [
  {
    id: 'me',
    pseudo: 'Jo',
    color: colors.accent,
    isMe: true,
    goal: 3,
    done: 2,
    status: 'done' as const,
    joker: false,
  },
  {
    id: 'a',
    pseudo: 'Alex',
    color: '#F5F5F0',
    isMe: false,
    goal: 4,
    done: 3,
    status: 'at_gym' as const,
    joker: false,
  },
  {
    id: 's',
    pseudo: 'Sam',
    color: '#B9BBC0',
    isMe: false,
    goal: 3,
    done: 2,
    status: 'done' as const,
    joker: false,
  },
  {
    id: 'l',
    pseudo: 'Lou',
    color: '#7C7E84',
    isMe: false,
    goal: 3,
    done: 1,
    status: 'not_yet' as const,
    joker: false,
  },
];

function TeamSample() {
  const plates = platesFor(players, colors.accent);
  return (
    <View style={styles.fill}>
      <MapBackdrop center={null} />
      <View style={styles.content}>
        <View style={styles.header}>
          <GlassPanel radius={radii.round} style={styles.teamChip}>
            <Text variant="bodyStrong">Les Guerriers</Text>
          </GlassPanel>
          <View style={styles.headButtons}>
            <Round>
              <ChatIcon color={colors.offWhite} />
            </Round>
            <Round>
              <InviteIcon color={colors.offWhite} />
            </Round>
          </View>
        </View>
        <View style={styles.counter}>
          <Text variant="label" color={colors.muted}>
            Barre de la team · cette semaine
          </Text>
          <View style={styles.kgRow}>
            <Text variant="display" style={styles.kg}>
              160
            </Text>
            <Text variant="title" style={styles.kgUnit}>
              kg
            </Text>
          </View>
        </View>
        <GlassPanel radius={radii.glass} style={styles.barPanel}>
          <TeamBar plates={plates} shaky width={320} accessibilityLabel="Barre" />
          <Text variant="bodyStrong" color={colors.accent}>
            Lou risque le skip. La barre tremble.
          </Text>
        </GlassPanel>
        <GlassPanel radius={radii.glass} style={styles.players}>
          <PlayerRow
            player={{ ...players[0], risk: 'safe' }}
            avatarUrl={null}
            spot={{ state: 'hidden', busy: false, onPress: noop }}
          />
          <PlayerRow
            player={{ ...players[1], risk: 'safe' }}
            avatarUrl={null}
            spot={{ state: 'hidden', busy: false, onPress: noop }}
          />
          <PlayerRow
            player={{ ...players[2], risk: 'safe' }}
            avatarUrl={null}
            spot={{ state: 'hidden', busy: false, onPress: noop }}
          />
          <PlayerRow
            player={{ ...players[3], risk: 'shaky' }}
            avatarUrl={null}
            spot={{ state: 'available', busy: false, onPress: noop }}
          />
        </GlassPanel>
      </View>
      <View style={styles.actions}>
        <Round>
          <HistoryIcon color={colors.offWhite} />
        </Round>
        <Round main>
          <TimerIcon color={colors.accent} />
        </Round>
        <View style={styles.actionSpacer} />
      </View>
    </View>
  );
}

function SessionSample() {
  return (
    <View style={styles.fill}>
      <MapBackdrop center={null} />
      <View style={styles.content}>
        <Text variant="label" color={colors.accent} style={styles.top}>
          Séance en cours · On Air Fitness
        </Text>
        <View style={styles.ringWrap}>
          <ProgressRing size={280} stroke={12} progress={38 / 45}>
            <Text variant="number">38:12</Text>
            <Text variant="caption" color={colors.muted}>
              Objectif 45:00
            </Text>
          </ProgressRing>
        </View>
        <GlassPanel style={styles.card}>
          <Text variant="headline">Pointage auto : garde ton téléphone sur toi.</Text>
          <Text variant="caption" color={colors.muted}>
            Ta team te voit « à la salle ». Ni l&apos;heure, ni l&apos;adresse.
          </Text>
        </GlassPanel>
      </View>
    </View>
  );
}

const messages: { who: string; color: string; text: string; mine?: boolean; time?: string }[] = [
  { who: 'Sam', color: '#B9BBC0', text: 'on y va ce soir ?', time: '17:42' },
  { who: 'Toi', color: colors.accent, text: '18 h, je suis chaud 🔥', mine: true, time: '17:43' },
  { who: 'Alex', color: '#F5F5F0', text: 'je suis déjà à la salle 😤', time: '17:45' },
  { who: 'Lou', color: '#7C7E84', text: 'le Canap’ me regarde 👀' },
  { who: 'Lou', color: '#7C7E84', text: 'ok ok j’arrive', time: '17:46' },
  { who: 'Sam', color: '#B9BBC0', text: 'la barre tremble, bouge Lou 😂', time: '17:48' },
];

function ChatSample() {
  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      <View style={styles.chatHead}>
        <Text variant="label" color={colors.accent}>
          Chat de la team
        </Text>
        <Text variant="headline">Les Guerriers</Text>
      </View>
      <View style={styles.chatList}>
        {messages.map((m, i) => {
          const grouped = i > 0 && messages[i - 1].who === m.who;
          return (
            <View key={i} style={[styles.row, m.mine && styles.rowMine, grouped && styles.grouped]}>
              {!m.mine && !grouped ? (
                <Text variant="caption" color={m.color} style={styles.author}>
                  {m.who}
                </Text>
              ) : null}
              <View style={[styles.bubble, m.mine ? styles.bubbleMine : styles.bubbleOther]}>
                <Text variant="body" color={m.mine ? colors.ink : colors.offWhite}>
                  {m.text}
                </Text>
              </View>
              {m.time ? (
                <Text variant="caption" color={colors.muted} style={styles.time}>
                  {m.time}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.composer}>
        <View style={styles.input}>
          <Text color={colors.muted}>Chambre ta team…</Text>
        </View>
        <View style={styles.send} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.map },
  content: { padding: spacing.lg, gap: spacing.md, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headButtons: { flexDirection: 'row', gap: spacing.sm },
  teamChip: { paddingHorizontal: spacing.lg, minHeight: 44, justifyContent: 'center' },
  counter: { marginTop: spacing.md, gap: spacing.xs },
  kgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  kg: { fontSize: 72, lineHeight: 74, letterSpacing: -2 },
  kgUnit: { paddingBottom: 8 },
  barPanel: { padding: spacing.lg, gap: spacing.md, alignItems: 'center' },
  players: { padding: spacing.lg, gap: spacing.sm },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  actionSpacer: { width: 50 },
  round: { alignItems: 'center', justifyContent: 'center' },
  icon: { zIndex: 1 },
  roundMain: { borderColor: colors.accent, borderWidth: 1.5 },
  top: { marginTop: spacing.xl },
  ringWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  card: { padding: spacing.lg, gap: spacing.xs },
  chatHead: { paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md },
  chatList: { flex: 1, justifyContent: 'flex-end', padding: spacing.lg },
  row: { alignItems: 'flex-start', marginTop: spacing.md, maxWidth: '82%' },
  rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  grouped: { marginTop: 4 },
  author: { marginBottom: 4, marginLeft: spacing.sm },
  bubble: { borderRadius: radii.card, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMine: { backgroundColor: colors.accent, borderBottomRightRadius: 6 },
  bubbleOther: { backgroundColor: colors.card, borderBottomLeftRadius: 6 },
  time: { marginTop: 4, marginHorizontal: spacing.sm, fontSize: 11 },
  composer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent },
});
