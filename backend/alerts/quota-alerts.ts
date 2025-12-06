import { api } from "encore.dev/api";
import db from "../external_dbs/neondb/db";
import { checkQuotaAlerts } from "../metrics/usage";

interface AlertPreference {
  userId: string;
  email: string;
  thresholds: number[];
  enabled: boolean;
}

const alertsSent = new Map<string, Set<number>>();

export async function sendQuotaAlert(
  userId: string,
  plan: string,
  quotaPercentage: number,
  quotaRemaining: number,
  threshold: number
): Promise<void> {
  const alertKey = `${userId}:${new Date().toDateString()}`;

  if (!alertsSent.has(alertKey)) {
    alertsSent.set(alertKey, new Set());
  }

  const sentThresholds = alertsSent.get(alertKey)!;

  if (sentThresholds.has(threshold)) {
    return;
  }

  const user = await db.queryRow<{ email: string; name: string }>`
    SELECT email, name FROM users WHERE id = ${userId}
  `;

  if (!user) {
    console.error(`User ${userId} not found for quota alert`);
    return;
  }

  console.warn(
    `[QUOTA ALERT] User: ${user.name} (${user.email}), Plan: ${plan}, ` +
    `Usage: ${quotaPercentage.toFixed(1)}%, Remaining: ${quotaRemaining}, Threshold: ${threshold}%`
  );

  sentThresholds.add(threshold);
}

interface CheckAlertsRequest {
  userId: string;
}

interface CheckAlertsResponse {
  alertTriggered: boolean;
  quotaPercentage?: number;
  quotaRemaining?: number;
  threshold?: number;
  message?: string;
}

export const checkUserAlerts = api(
  { method: "GET", path: "/alerts/check/:userId", expose: true, auth: true },
  async (req: CheckAlertsRequest): Promise<CheckAlertsResponse> => {
    const user = await db.queryRow<{ plan: string }>`
      SELECT plan FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw new Error("User not found");
    }

    const alert = await checkQuotaAlerts(req.userId, user.plan);

    if (alert) {
      await sendQuotaAlert(
        alert.userId,
        alert.plan,
        alert.quotaPercentage,
        alert.quotaRemaining,
        alert.threshold
      );

      let message = "";
      if (alert.threshold === 100) {
        message = "You have reached your daily quota limit. Please upgrade your plan or wait until tomorrow.";
      } else if (alert.threshold >= 95) {
        message = `You have used ${alert.quotaPercentage.toFixed(1)}% of your daily quota. Consider upgrading your plan.`;
      } else {
        message = `You have used ${alert.quotaPercentage.toFixed(1)}% of your daily quota.`;
      }

      return {
        alertTriggered: true,
        quotaPercentage: alert.quotaPercentage,
        quotaRemaining: alert.quotaRemaining,
        threshold: alert.threshold,
        message,
      };
    }

    return {
      alertTriggered: false,
    };
  }
);
