import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { Reaction, ReactionRow } from '@/domain/chat';
import { db } from '@/lib/supabase';

export type ChatMessage = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
  /** A line posted by the Canap' (a validated session), about `user_id`. */
  system: boolean;
};

export const chatKey = (teamId: string) => ['team-chat', teamId] as const;

/** Last 100 messages of a team (oldest first), kept live with Supabase Realtime. */
export function useTeamMessages(teamId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: chatKey(teamId ?? 'none'),
    enabled: Boolean(teamId),
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data, error } = await db()
        .from('team_messages')
        .select('id, user_id, body, created_at, deleted_at, system')
        .eq('team_id', teamId as string)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []).reverse();
    },
  });

  useEffect(() => {
    if (!teamId) return;
    // RLS filters what Realtime sends: only members of the team get its messages.
    const channel = db()
      .channel(`team-chat:${teamId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_messages', filter: `team_id=eq.${teamId}` },
        () => qc.invalidateQueries({ queryKey: chatKey(teamId) }),
      )
      .subscribe();
    return () => {
      db().removeChannel(channel);
    };
  }, [teamId, qc]);

  return query;
}

export function useSendMessage(teamId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: string) => {
      const { error } = await db().rpc('send_team_message', { p_team: teamId, p_body: body });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKey(teamId) }),
  });
}

export function useDeleteMessage(teamId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db().rpc('delete_team_message', { p_message: id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKey(teamId) }),
  });
}

export function useReportMessage() {
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { error } = await db().rpc('report_team_message', { p_message: id, p_reason: reason });
      if (error) throw error;
    },
  });
}

/** Players this phone hides in chats (« Masquer ses messages »), kept on the device only. */
const HIDDEN_KEY = 'noskip.chat.hidden';

export function useHiddenAuthors() {
  return useQuery({
    queryKey: ['chat-hidden'],
    staleTime: Infinity,
    queryFn: async (): Promise<string[]> => {
      try {
        return JSON.parse((await AsyncStorage.getItem(HIDDEN_KEY)) ?? '[]') as string[];
      } catch {
        return [];
      }
    },
  });
}

export function useToggleHidden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const current = JSON.parse((await AsyncStorage.getItem(HIDDEN_KEY)) ?? '[]') as string[];
      const next = current.includes(userId)
        ? current.filter((u) => u !== userId)
        : [...current, userId];
      await AsyncStorage.setItem(HIDDEN_KEY, JSON.stringify(next));
      return next;
    },
    onSuccess: (next) => qc.setQueryData(['chat-hidden'], next),
  });
}

export const reactionsKey = (teamId: string) => ['team-reactions', teamId] as const;

/** Reactions of a team's messages (members only), kept live with Supabase Realtime. */
export function useReactions(teamId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: reactionsKey(teamId ?? 'none'),
    enabled: Boolean(teamId),
    queryFn: async (): Promise<ReactionRow[]> => {
      const { data, error } = await db()
        .from('message_reactions')
        .select('message_id, user_id, emoji')
        .eq('team_id', teamId as string)
        .eq('active', true);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!teamId) return;
    const refresh = () => qc.invalidateQueries({ queryKey: reactionsKey(teamId) });
    const channel = db()
      .channel(`team-reactions:${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `team_id=eq.${teamId}`,
        },
        refresh,
      )
      .subscribe();
    return () => {
      db().removeChannel(channel);
    };
  }, [teamId, qc]);

  return query;
}

export function useToggleReaction(teamId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: string; emoji: Reaction }) => {
      const { error } = await db().rpc('toggle_reaction', { p_message: messageId, p_emoji: emoji });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: reactionsKey(teamId) }),
  });
}
