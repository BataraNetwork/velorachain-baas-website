import { api } from "encore.dev/api";
import { randomBytes, createHash } from "crypto";
import neondb from "../external_dbs/neondb/db";
import { APIKeyResponse } from "./generate";

export interface RotateKeyRequest {
  key_id: string;
  user_id: string;
}

export const rotate = api(
  { method: "POST", path: "/api/keys/rotate", expose: true },
  async (req: RotateKeyRequest): Promise<APIKeyResponse> => {
    const existingKey = await neondb.queryRow<{
      name: string;
      scopes: string[];
      rate_limit_per_minute: number | null;
      rate_limit_per_hour: number | null;
      rate_limit_per_day: number | null;
      expires_at: Date | null;
    }>`
      SELECT name, scopes, rate_limit_per_minute, rate_limit_per_hour, 
             rate_limit_per_day, expires_at
      FROM api_keys
      WHERE id = ${req.key_id} AND user_id = ${req.user_id}
    `;

    if (!existingKey) {
      throw new Error("API key not found");
    }

    await neondb.exec`
      UPDATE api_keys
      SET is_active = false, updated_at = NOW()
      WHERE id = ${req.key_id} AND user_id = ${req.user_id}
    `;

    const newKey = `vk_${randomBytes(32).toString("hex")}`;
    const keyHash = createHash("sha256").update(newKey).digest("hex");
    const keyPrefix = newKey.substring(0, 12);

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
      existingKey.name,
      keyHash,
      keyPrefix,
      JSON.stringify(existingKey.scopes),
      existingKey.rate_limit_per_minute,
      existingKey.rate_limit_per_hour,
      existingKey.rate_limit_per_day,
      existingKey.expires_at
    );

    if (!result) {
      throw new Error("Failed to rotate API key");
    }

    return {
      id: result.id,
      name: result.name,
      key: newKey,
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
