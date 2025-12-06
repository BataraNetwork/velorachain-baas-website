import { api } from "encore.dev/api";
import db from "../external_dbs/neondb/db";
import { getRateLimitStatus } from "../middleware/rate-limit";

interface UsageMetricsRequest {
  userId: string;
}

interface UsageMetricsResponse {
  userId: string;
  plan: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
    quotaPerDay: number;
  };
  currentUsage: {
    quotaUsed: number;
    quotaRemaining: number;
    quotaPercentage: number;
  };
  recentActivity: Array<{
    endpoint: string;
    count: number;
    cost: number;
    timestamp: Date;
  }>;
}

export const getUsageMetrics = api(
  { method: "GET", path: "/metrics/usage/:userId", expose: true, auth: true },
  async (req: UsageMetricsRequest): Promise<UsageMetricsResponse> => {
    const user = await db.queryRow<{ plan: string }>`
      SELECT plan FROM users WHERE id = ${req.userId}
    `;

    if (!user) {
      throw new Error("User not found");
    }

    const rateLimitStatus = await getRateLimitStatus(req.userId, user.plan);

    const recentActivityRows: Array<{
      endpoint: string;
      count: number;
      cost: number;
      created_at: Date;
    }> = [];

    const recentActivity = db.query<{
      endpoint: string;
      count: number;
      cost: number;
      created_at: Date;
    }>`
      SELECT endpoint, count, cost, created_at
      FROM api_usage
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
      LIMIT 100
    `;

    for await (const row of recentActivity) {
      recentActivityRows.push(row);
    }

    return {
      userId: req.userId,
      plan: user.plan,
      rateLimits: rateLimitStatus.limits,
      currentUsage: {
        quotaUsed: rateLimitStatus.quotaUsed,
        quotaRemaining: rateLimitStatus.quotaRemaining,
        quotaPercentage: rateLimitStatus.quotaPercentage,
      },
      recentActivity: recentActivityRows.map((row) => ({
        endpoint: row.endpoint,
        count: row.count,
        cost: parseFloat(row.cost.toString()),
        timestamp: row.created_at,
      })),
    };
  }
);

export const trackApiUsage = async (
  userId: string,
  endpoint: string,
  cost: number = 0
): Promise<void> => {
  await db.exec`
    INSERT INTO api_usage (user_id, endpoint, count, cost)
    VALUES (${userId}, ${endpoint}, 1, ${cost})
  `;
};

interface QuotaAlert {
  userId: string;
  plan: string;
  quotaPercentage: number;
  quotaRemaining: number;
  threshold: number;
}

export async function checkQuotaAlerts(userId: string, plan: string): Promise<QuotaAlert | null> {
  const status = await getRateLimitStatus(userId, plan);

  const alertThresholds = [90, 95, 98, 100];

  for (const threshold of alertThresholds) {
    if (status.quotaPercentage >= threshold) {
      return {
        userId,
        plan,
        quotaPercentage: status.quotaPercentage,
        quotaRemaining: status.quotaRemaining,
        threshold,
      };
    }
  }

  return null;
}
