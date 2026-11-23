import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { DEFAULT_REMINDER_HOUR, normalizePlan } from '@/domain/plan';
import { gameWeekStart } from '@/domain/week';
import { useUserId } from '@/features/auth/AuthProvider';
import { useLocalOnboarding } from '@/features/onboarding/localStore';
import { db } from '@/lib/supabase';

import { syncPlanReminders } from './reminders';

export const myPlanKey = ['my-week-plan'] as const;
export const teamPlansKey = (teamId: string) => ['team-week-plans', teamId] as const;

/** My plan for the current game week ([] = not announced yet). */
export function useMyPlan() {
  const userId = useUserId();
  return useQuery({
    queryKey: myPlanKey,
    queryFn: async (): Promise<number[]> => {
      const { data, error } = await db()
        .from('week_plans')
        .select('days')
        .eq('user_id', userId)
        .eq('week_start', gameWeekStart(Date.now()))
        .maybeSingle();
      if (error) throw error;
      return normalizePlan(data?.days ?? []);
    },
  });
}

/** Days announced by each member of a team this week (user id → days). */
export function useTeamPlans(teamId: string | undefined) {
  return useQuery({
    queryKey: teamPlansKey(teamId ?? 'none'),
    enabled: Boolean(teamId),
    queryFn: async (): Promise<Record<string, number[]>> => {
      const { data, error } = await db().rpc('team_week_plans', { p_team: teamId as string });
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.user_id, normalizePlan(r.days)]));
    },
  });
}

export function useSetPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ days, hour }: { days: number[]; hour: number }) => {
      const { data, error } = await db().rpc('set_week_plan', { p_days: normalizePlan(days) });
      if (error) throw error;
      const saved = normalizePlan(data ?? []);
      await syncPlanReminders(saved, hour);
      return saved;
    },
    onSuccess: (saved) => {
      qc.setQueryData(myPlanKey, saved);
      qc.invalidateQueries({ queryKey: ['team-week-plans'] });
    },
  });
}

/** Keeps this phone's reminders in line with the plan (new week, reinstall, new phone). */
export function usePlanReminderSync() {
  const plan = useMyPlan();
  const local = useLocalOnboarding();
  const days = plan.data;
  const hour = local.data?.planReminderHour ?? DEFAULT_REMINDER_HOUR;
  useEffect(() => {
    if (!days || !local.data) return;
    syncPlanReminders(days, hour);
  }, [days, hour, local.data]);
}
