import * as Notifications from 'expo-notifications';

import { eveningReminderId, planReminders } from '@/domain/plan';
import { parisDate } from '@/domain/week';

const PREFIX = 'plan-';

async function canNotify(): Promise<boolean> {
  try {
    return (await Notifications.getPermissionsAsync()).status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Replaces the plan reminders scheduled on this phone (local notifications: the reminder hour
 * never leaves the phone). Never throws: a missed reminder must not break the plan.
 */
export async function syncPlanReminders(days: readonly number[], hour: number, now = Date.now()) {
  try {
    if (!(await canNotify())) return;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.identifier.startsWith(PREFIX))
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
    );
    for (const r of planReminders(days, hour, now)) {
      await Notifications.scheduleNotificationAsync({
        identifier: r.id,
        content: {
          title: r.title,
          body: r.body,
          data: { type: r.kind === 'monday' ? 'plan_prompt' : 'plan_day' },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(r.at) },
      });
    }
  } catch {
    // Reminders are a bonus.
  }
}

/** Today's session is validated: no "tu avais prévu la salle" tonight. */
export async function cancelTodayEveningReminder(now = Date.now()) {
  try {
    await Notifications.cancelScheduledNotificationAsync(eveningReminderId(parisDate(now)));
  } catch {
    // Nothing scheduled.
  }
}
