import { api } from "encore.dev/api";
import { randomBytes, createHash } from "crypto";
import neondb from "../external_dbs/neondb/db";

export interface GenerateKeyRequest {
  user_id: string;
  name: string;
  scopes: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  expires_at?: Date;
}

export interface APIKeyResponse {
  id: string;
  name: string;
  key: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  expires_at?: Date;
  created_at: Date;
}

export const generate = api(
  { method: "POST", path: "/api/keys/generate", expose: true },
  async (req: GenerateKeyRequest): Promise<APIKeyResponse> => {
    const key = `vk_${randomBytes(32).toString("hex")}`;
    const keyHash = createHash("sha256").update(key).digest("hex");
    const keyPrefix = key.substring(0, 12);

    const result = await neondb.rawQueryRow<{
      id: string;
      name: string;
      key_prefix: string;
      scopes: string[];
      rate_limit_per_minute: number | null;
      rate_limit_per_hour: number | null;
      rate_limit_per_day: number | null;
      expires_at: Date | null;
      created_at: Date;
    }>(
      `INSERT INTO api_keys (
        user_id, name, key_hash, key_prefix, scopes, 
        rate_limit_per_minute, rate_limit_per_hour, rate_limit_per_day, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, key_prefix, scopes, rate_limit_per_minute, 
                rate_limit_per_hour, rate_limit_per_day, expires_at, created_at`,
      req.user_id,
      req.name,
      keyHash,
      keyPrefix,
      JSON.stringify(req.scopes),
      req.rate_limit_per_minute ?? null,
      req.rate_limit_per_hour ?? null,
      req.rate_limit_per_day ?? null,
      req.expires_at ?? null
    );

    if (!result) {
      throw new Error("Failed to create API key");
    }

    return {
      id: result.id,
      name: result.name,
      key,
      key_prefix: result.key_prefix,
      scopes: result.scopes,
      rate_limit_per_minute: result.rate_limit_per_minute ?? undefined,
      rate_limit_per_hour: result.rate_limit_per_hour ?? undefined,
      rate_limit_per_day: result.rate_limit_per_day ?? undefined,
      expires_at: result.expires_at ?? undefined,
      created_at: result.created_at,
    };
  }
);
