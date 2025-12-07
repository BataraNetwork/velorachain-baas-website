import { api } from "encore.dev/api";
import neondb from "../external_dbs/neondb/db";

export interface APIKeyListItem {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  expires_at?: Date;
  last_used_at?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ListKeysRequest {
  user_id: string;
}

export interface ListKeysResponse {
  keys: APIKeyListItem[];
}

export const list = api(
  { method: "GET", path: "/api/keys/:user_id", expose: true },
  async (req: ListKeysRequest): Promise<ListKeysResponse> => {
    const keys = await neondb.queryAll<APIKeyListItem>`
      SELECT 
        id, name, key_prefix, scopes, rate_limit_per_minute, 
        rate_limit_per_hour, rate_limit_per_day, expires_at, 
        last_used_at, is_active, created_at, updated_at
      FROM api_keys
      WHERE user_id = ${req.user_id}
      ORDER BY created_at DESC
    `;

    return {
      keys: keys.map(k => ({
        ...k,
        rate_limit_per_minute: k.rate_limit_per_minute ?? undefined,
        rate_limit_per_hour: k.rate_limit_per_hour ?? undefined,
        rate_limit_per_day: k.rate_limit_per_day ?? undefined,
        expires_at: k.expires_at ?? undefined,
        last_used_at: k.last_used_at ?? undefined,
      })),
    };
  }
);
