import { api } from "encore.dev/api";
import neondb from "../external_dbs/neondb/db";

export interface RevokeKeyRequest {
  key_id: string;
  user_id: string;
}

export interface RevokeKeyResponse {
  success: boolean;
}

export const revoke = api(
  { method: "POST", path: "/api/keys/revoke", expose: true },
  async (req: RevokeKeyRequest): Promise<RevokeKeyResponse> => {
    await neondb.exec`
      UPDATE api_keys
      SET is_active = false, updated_at = NOW()
      WHERE id = ${req.key_id} AND user_id = ${req.user_id}
    `;

    return { success: true };
  }
);
