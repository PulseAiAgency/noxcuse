import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { ErrorNote } from '@/components/ui/ErrorNote';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import {
  DEFAULT_REMINDER_HOUR,
  PLAN_DAYS,
  planHint,
  REMINDER_HOURS,
  togglePlanDay,
} from '@/domain/plan';
import { parisParts } from '@/domain/week';
import { useLocalOnboarding, useUpdateLocalOnboarding } from '@/features/onboarding/localStore';
import { useMyPlan, useSetPlan } from '@/features/plan/api';
import { useProfile } from '@/features/profile/api';
import { toUserMessage } from '@/lib/errors';
import { colors, minTouch, radii, spacing } from '@/theme/tokens';

/** « Mon plan de la semaine »: the days I commit to, visible to my team, with reminders. */
export default function PlanScreen() {
  const plan = useMyPlan();
  const profile = useProfile();
  const local = useLocalOnboarding();
  const saveLocal = useUpdateLocalOnboarding();
  const setPlan = useSetPlan();
  const [days, setDays] = useState<number[] | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [today] = useState(() => parisParts(Date.now()).weekday);

  // Edits start from the saved plan and hour until the player changes them.
  const picked = days ?? plan.data ?? [];
  const pickedHour = hour ?? local.data?.planReminderHour ?? DEFAULT_REMINDER_HOUR;
  const goal = profile.data?.weekly_goal ?? 3;
  const hint = planHint(picked, goal);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/team'));

  async function onSave() {
    setError(null);
    try {
      await saveLocal.mutateAsync({ planReminderHour: pickedHour });
      await setPlan.mutateAsync({ days: picked, hour: pickedHour });
      close();
    } catch (err) {
      setError(toUserMessage(err));
    }
  }

  return (
    <Screen
      footer={
        <Button
          label={picked.length ? "C'est noté" : 'Pas de plan cette semaine'}
          onPress={onSave}
          disabled={setPlan.isPending || !plan.data}
          accessibilityHint="Ta team voit tes jours de salle"
        />
      }
    >
      <View style={styles.head}>
        <Text variant="label" color={colors.accent}>
          Ta semaine
        </Text>
        <PressableScale
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
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
      <Text variant="display" accessibilityRole="header">
        Mon plan.
      </Text>
      <Text color={colors.muted}>
        Annonce tes jours de salle. Ta team les voit, et l&apos;app te les rappelle. Le Canap&apos;
        aussi les voit.
      </Text>

      <Text variant="label" color={colors.muted} style={styles.section}>
        {`Tes jours · objectif ${goal} / sem.`}
      </Text>
      <View style={styles.days} accessibilityRole="radiogroup">
        {PLAN_DAYS.map((d) => {
          const on = picked.includes(d.iso);
          const past = d.iso < today;
          return (
            <PressableScale
              key={d.iso}
              onPress={() => setDays(togglePlanDay(picked, d.iso))}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={d.label}
              style={[styles.day, on && styles.dayOn, past && !on && styles.dayPast]}
            >
              <Text variant="headline" color={on ? colors.ink : colors.offWhite}>
                {d.short}
              </Text>
              <Text variant="caption" color={on ? colors.ink : colors.muted}>
                {d.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
      {hint ? (
        <Text variant="caption" color={colors.accent}>
          {hint}
        </Text>
      ) : null}

      <Text variant="label" color={colors.muted} style={styles.section}>
        Rappel ces jours-là
      </Text>
      <View style={styles.hours} accessibilityRole="radiogroup">
        {REMINDER_HOURS.map((h) => {
          const on = h === pickedHour;
          return (
            <PressableScale
              key={h}
              onPress={() => setHour(h)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[styles.hour, on && styles.dayOn]}
            >
              <Text variant="bodyStrong" color={on ? colors.ink : colors.offWhite}>
                {`${h} h`}
              </Text>
            </PressableScale>
          );
        })}
      </View>
      <Text variant="caption" color={colors.muted}>
        Si la séance n&apos;est pas faite, un dernier rappel part le soir. Ta team voit tes jours,
        jamais tes heures.
      </Text>
      <ErrorNote message={error} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: {
    width: 48,
    height: Math.max(minTouch, 48),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: spacing.lg },
  days: { flexDirection: 'row', gap: spacing.xs },
  day: {
    flex: 1,
    minHeight: 72,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayOn: { backgroundColor: colors.accent },
  dayPast: { opacity: 0.45 },
  hours: { flexDirection: 'row', gap: spacing.sm },
  hour: {
    flex: 1,
    minHeight: Math.max(minTouch, 52),
    borderRadius: radii.card,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
