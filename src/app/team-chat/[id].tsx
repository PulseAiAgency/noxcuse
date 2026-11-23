import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Canap } from '@/components/Canap';
import { ErrorNote } from '@/components/ui/ErrorNote';
import { PressableScale } from '@/components/ui/PressableScale';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import {
  cleanMessage,
  continuesPrevious,
  groupReactions,
  MESSAGE_MAX,
  messageTime,
  type Reaction,
  type ReactionCount,
  REACTIONS,
} from '@/domain/chat';
import {
  type ChatMessage,
  useDeleteMessage,
  useHiddenAuthors,
  useReactions,
  useReportMessage,
  useSendMessage,
  useTeamMessages,
  useToggleHidden,
  useToggleReaction,
} from '@/features/chat/api';
import { useMyTeams, useTeamBoard } from '@/features/teams/api';
import { toUserMessage } from '@/lib/errors';
import { colors, minTouch, radii, spacing } from '@/theme/tokens';

/** Le chat de la team: members only, live, with report / hide / delete on a long press. */
export default function TeamChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teams = useMyTeams();
  const team = teams.data?.find((t) => t.id === id);
  const board = useTeamBoard(id);
  const messages = useTeamMessages(id);
  const send = useSendMessage(id);
  const remove = useDeleteMessage(id);
  const report = useReportMessage();
  const hidden = useHiddenAuthors();
  const toggleHidden = useToggleHidden();
  const reactionRows = useReactions(id);
  const toggleReaction = useToggleReaction(id);
  const [text, setText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const members = new Map((board.data ?? []).map((m) => [m.user_id, m]));
  const me = (board.data ?? []).find((m) => m.is_me)?.user_id;
  const isOwner = team?.role === 'owner';
  const list = messages.data ?? [];
  const toSend = cleanMessage(text);
  const reactions = groupReactions(reactionRows.data ?? [], me);

  function react(messageId: string, emoji: Reaction) {
    toggleReaction.mutate({ messageId, emoji }, { onError: (e) => setNotice(toUserMessage(e)) });
  }

  /** Tappable reaction chips; on a Canap' line, all four are always offered. */
  function reactionBar(message: ChatMessage, all: boolean) {
    const counts = reactions[message.id] ?? [];
    const shown: ReactionCount[] = all
      ? REACTIONS.map(
          (e) => counts.find((c) => c.emoji === e) ?? { emoji: e, count: 0, mine: false },
        )
      : counts;
    if (shown.length === 0) return null;
    return (
      <View style={[styles.reactions, all && styles.reactionsCenter]}>
        {shown.map((c) => (
          <PressableScale
            key={c.emoji}
            onPress={() => react(message.id, c.emoji)}
            accessibilityRole="button"
            accessibilityState={{ selected: c.mine }}
            accessibilityLabel={`${c.emoji} ${c.count}${c.mine ? ', ta réaction' : ''}`}
            style={[styles.reaction, c.mine && styles.reactionMine]}
          >
            <Text variant="caption" color={colors.offWhite}>
              {c.count ? `${c.emoji} ${c.count}` : c.emoji}
            </Text>
          </PressableScale>
        ))}
      </View>
    );
  }

  async function onSend() {
    if (!toSend) return;
    setNotice(null);
    try {
      await send.mutateAsync(toSend);
      setText('');
    } catch (err) {
      setNotice(toUserMessage(err));
    }
  }

  function onLongPress(m: ChatMessage) {
    if (m.deleted_at || m.system) return;
    const mine = m.user_id === me;
    const pseudo = members.get(m.user_id)?.pseudo ?? 'ce joueur';
    const isHidden = hidden.data?.includes(m.user_id) ?? false;
    const actions: { text: string; style?: 'destructive' | 'cancel'; onPress?: () => void }[] = [];
    if (mine || isOwner) {
      actions.push({
        text: mine ? 'Supprimer mon message' : 'Supprimer (créateur de la team)',
        style: 'destructive',
        onPress: () => remove.mutate(m.id, { onError: (e) => setNotice(toUserMessage(e)) }),
      });
    }
    if (!mine) {
      actions.push({
        text: 'Réagir',
        onPress: () =>
          Alert.alert('Réagir', undefined, [
            ...REACTIONS.map((e) => ({ text: e, onPress: () => react(m.id, e) })),
            { text: 'Annuler', style: 'cancel' as const },
          ]),
      });
      actions.push({
        text: 'Signaler',
        onPress: () =>
          Alert.alert('Signaler ce message', 'On le relit sous 24 h.', [
            ...['Insulte ou harcèlement', 'Contenu choquant', 'Spam'].map((reason) => ({
              text: reason,
              onPress: () =>
                report.mutate(
                  { id: m.id, reason },
                  {
                    onSuccess: () => setNotice('Merci, le message est signalé.'),
                    onError: (e) => setNotice(toUserMessage(e)),
                  },
                ),
            })),
            { text: 'Annuler', style: 'cancel' as const },
          ]),
      });
      actions.push({
        text: isHidden ? `Afficher les messages de ${pseudo}` : `Masquer les messages de ${pseudo}`,
        onPress: () => toggleHidden.mutate(m.user_id),
      });
    }
    actions.push({ text: 'Annuler', style: 'cancel' });
    Alert.alert('Message', undefined, actions);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <Text variant="label" color={colors.accent}>
            Chat de la team
          </Text>
          <Text variant="headline" numberOfLines={1}>
            {team?.name ?? 'Ta team'}
          </Text>
        </View>
        <PressableScale
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/team'))}
          accessibilityRole="button"
          accessibilityLabel="Fermer le chat"
          style={styles.close}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={colors.offWhite}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </Svg>
        </PressableScale>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        {messages.isLoading ? (
          <View style={styles.loading}>
            <Skeleton height={56} />
            <Skeleton height={56} />
          </View>
        ) : list.length === 0 ? (
          <View style={styles.empty}>
            <Canap mood="sleepy" size={140} />
            <Text variant="headline">Silence radio.</Text>
            <Text variant="caption" color={colors.muted} style={styles.center}>
              Le Canap&apos; adore quand personne ne parle de la salle. Lance le premier message.
            </Text>
          </View>
        ) : (
          <FlatList
            data={[...list].reverse()}
            inverted
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const ordered = [...list].reverse();
              const prev = ordered[index + 1];
              const grouped = continuesPrevious(prev, item);
              const mine = item.user_id === me;
              const member = members.get(item.user_id);
              const masked = !mine && (hidden.data?.includes(item.user_id) ?? false);
              if (item.system) {
                return (
                  <View
                    style={styles.canapLine}
                    accessible
                    accessibilityLabel={`Le Canap' : ${item.body}`}
                  >
                    <View style={styles.canapRow}>
                      <Canap mood="sad" size={34} accessible={false} />
                      <Text variant="body" color={colors.offWhite} style={styles.flex}>
                        {item.body}
                      </Text>
                    </View>
                    <Text variant="caption" color={colors.muted} style={styles.time}>
                      {messageTime(item.created_at)}
                    </Text>
                    {reactionBar(item, true)}
                  </View>
                );
              }
              return (
                <PressableScale
                  onLongPress={() => onLongPress(item)}
                  accessibilityRole="text"
                  accessibilityHint="Appui long : réagir, signaler, masquer ou supprimer"
                  style={[
                    styles.row,
                    mine ? styles.rowMine : null,
                    grouped ? styles.grouped : null,
                  ]}
                >
                  {!mine && !grouped ? (
                    <Text
                      variant="caption"
                      color={member?.plate_color ?? colors.muted}
                      style={styles.author}
                    >
                      {member?.pseudo ?? 'Ancien joueur'}
                    </Text>
                  ) : null}
                  <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                    <Text
                      variant="body"
                      color={mine ? colors.ink : colors.offWhite}
                      style={item.deleted_at || masked ? styles.italic : null}
                    >
                      {item.deleted_at ? 'Message supprimé' : masked ? 'Message masqué' : item.body}
                    </Text>
                  </View>
                  {!item.deleted_at && !masked ? reactionBar(item, false) : null}
                  {!grouped ? (
                    <Text variant="caption" color={colors.muted} style={styles.time}>
                      {messageTime(item.created_at)}
                    </Text>
                  ) : null}
                </PressableScale>
              );
            }}
          />
        )}

        <ErrorNote message={messages.error ? toUserMessage(messages.error) : null} />
        {notice ? (
          <Text
            variant="caption"
            color={colors.muted}
            style={styles.notice}
            accessibilityLiveRegion="polite"
          >
            {notice}
          </Text>
        ) : null}

        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Chambre ta team…"
            placeholderTextColor={colors.muted}
            multiline
            maxLength={MESSAGE_MAX}
            style={styles.input}
            accessibilityLabel="Message"
          />
          <PressableScale
            onPress={onSend}
            disabled={!toSend || send.isPending}
            accessibilityRole="button"
            accessibilityLabel="Envoyer"
            style={[styles.send, (!toSend || send.isPending) && styles.sendOff]}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12h13M13 6l6 6-6 6"
                stroke={colors.ink}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  close: {
    width: 48,
    height: Math.max(minTouch, 48),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: { padding: spacing.lg, gap: spacing.md },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  center: { textAlign: 'center' },
  list: { padding: spacing.lg, gap: 2 },
  row: { alignItems: 'flex-start', marginTop: spacing.md, maxWidth: '82%' },
  rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  grouped: { marginTop: 4 },
  author: { marginBottom: 4, marginLeft: spacing.sm, fontFamily: undefined },
  bubble: { borderRadius: radii.card, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMine: { backgroundColor: colors.accent, borderBottomRightRadius: 6 },
  bubbleOther: { backgroundColor: colors.card, borderBottomLeftRadius: 6 },
  italic: { fontStyle: 'italic', opacity: 0.75 },
  time: { marginTop: 4, marginHorizontal: spacing.sm, fontSize: 11 },
  notice: { textAlign: 'center', paddingHorizontal: spacing.lg },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: 24,
    backgroundColor: colors.card,
    color: colors.offWhite,
    paddingHorizontal: spacing.lg,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 16,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOff: { opacity: 0.4 },
  canapLine: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 4,
  },
  canapRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reactions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  reactionsCenter: { justifyContent: 'flex-start' },
  reaction: {
    minHeight: 32,
    minWidth: 44,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionMine: { borderWidth: 1.5, borderColor: colors.accent },
});
