import { api } from "encore.dev/api";
import neondb from "../external_dbs/neondb/db";

export interface UsageStats {
  endpoint: string;
  count: number;
  last_used: Date;
}

export interface UsageRequest {
  key_id: string;
  days?: number;
}

export interface UsageResponse {
  total_requests: number;
  endpoints: UsageStats[];
}

export const usage = api(
  { method: "GET", path: "/api/keys/:key_id/usage", expose: true },
  async (req: UsageRequest): Promise<UsageResponse> => {
    const days = req.days ?? 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const stats = await neondb.queryAll<{
      endpoint: string;
      count: number;
      last_used: Date;
    }>`
      SELECT 
        endpoint,
        SUM(count)::integer as count,
        MAX(timestamp) as last_used
      FROM api_key_usage
      WHERE api_key_id = ${req.key_id}
        AND timestamp >= ${cutoffDate}
      GROUP BY endpoint
      ORDER BY count DESC
    `;

    const total = stats.reduce((sum, s) => sum + s.count, 0);

    return {
      total_requests: total,
      endpoints: stats,
    };
  }
);

export interface RecordUsageRequest {
  api_key_id: string;
  endpoint: string;
}

export interface RecordUsageResponse {
  success: boolean;
}

export const recordUsage = api(
  { method: "POST", path: "/api/keys/usage/record", expose: true },
  async (req: RecordUsageRequest): Promise<RecordUsageResponse> => {
    await neondb.exec`
      INSERT INTO api_key_usage (api_key_id, endpoint, count, timestamp)
      VALUES (${req.api_key_id}, ${req.endpoint}, 1, NOW())
    `;

    await neondb.exec`
      UPDATE api_keys
      SET last_used_at = NOW()
      WHERE id = ${req.api_key_id}
    `;

    return { success: true };
  }
);
