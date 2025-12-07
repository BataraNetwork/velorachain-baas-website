import { APIError } from "encore.dev/api";
import { createHash } from "crypto";
import neondb from "../external_dbs/neondb/db";

export interface APIKeyData {
  id: string;
  user_id: string;
  scopes: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
}

export async function validateAPIKey(apiKey: string): Promise<APIKeyData> {
  if (!apiKey || !apiKey.startsWith("vk_")) {
    throw APIError.unauthenticated("Invalid API key format");
  }

  const keyHash = createHash("sha256").update(apiKey).digest("hex");

  const key = await neondb.queryRow<{
    id: string;
    user_id: string;
    scopes: string[];
    rate_limit_per_minute: number | null;
    rate_limit_per_hour: number | null;
    rate_limit_per_day: number | null;
    expires_at: Date | null;
    is_active: boolean;
  }>`
    SELECT 
      id, user_id, scopes, rate_limit_per_minute, 
      rate_limit_per_hour, rate_limit_per_day, expires_at, is_active
    FROM api_keys
    WHERE key_hash = ${keyHash}
  `;

  if (!key) {
    throw APIError.unauthenticated("Invalid API key");
  }

  if (!key.is_active) {
    throw APIError.unauthenticated("API key has been revoked");
  }

  if (key.expires_at && new Date(key.expires_at) < new Date()) {
    throw APIError.unauthenticated("API key has expired");
  }

  return {
    id: key.id,
    user_id: key.user_id,
    scopes: key.scopes,
    rate_limit_per_minute: key.rate_limit_per_minute ?? undefined,
    rate_limit_per_hour: key.rate_limit_per_hour ?? undefined,
    rate_limit_per_day: key.rate_limit_per_day ?? undefined,
  };
}

export async function checkRateLimit(keyId: string, rateLimitPerMinute?: number, rateLimitPerHour?: number, rateLimitPerDay?: number): Promise<void> {
  const now = new Date();
  
  if (rateLimitPerMinute) {
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const minuteCount = await neondb.queryRow<{ count: number }>`
      SELECT COALESCE(SUM(count), 0)::integer as count
      FROM api_key_usage
      WHERE api_key_id = ${keyId} AND timestamp >= ${oneMinuteAgo}
    `;
    
    if (minuteCount && minuteCount.count >= rateLimitPerMinute) {
      throw APIError.resourceExhausted("Rate limit exceeded: too many requests per minute");
    }
  }

  if (rateLimitPerHour) {
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const hourCount = await neondb.queryRow<{ count: number }>`
      SELECT COALESCE(SUM(count), 0)::integer as count
      FROM api_key_usage
      WHERE api_key_id = ${keyId} AND timestamp >= ${oneHourAgo}
    `;
    
    if (hourCount && hourCount.count >= rateLimitPerHour) {
      throw APIError.resourceExhausted("Rate limit exceeded: too many requests per hour");
    }
  }

  if (rateLimitPerDay) {
    const oneDayAgo = new Date(now.getTime() - 86400000);
    const dayCount = await neondb.queryRow<{ count: number }>`
      SELECT COALESCE(SUM(count), 0)::integer as count
      FROM api_key_usage
      WHERE api_key_id = ${keyId} AND timestamp >= ${oneDayAgo}
    `;
    
    if (dayCount && dayCount.count >= rateLimitPerDay) {
      throw APIError.resourceExhausted("Rate limit exceeded: too many requests per day");
    }
  }
}

export function checkScope(requiredScope: string, keyScopes: string[]): void {
  if (!keyScopes.includes(requiredScope) && !keyScopes.includes("*")) {
    throw APIError.permissionDenied(`API key does not have required scope: ${requiredScope}`);
  }
}
