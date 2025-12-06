import { api } from "encore.dev/api";
import db from "../external_dbs/neondb/db";
import { enforceRateLimit } from "../middleware/rate-limit";
import { trackApiUsage } from "../metrics/usage";

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  id?: string;
  message: string;
}

export const submitContact = api(
  { method: "POST", path: "/contact", expose: true },
  async (req: ContactRequest): Promise<ContactResponse> => {
    try {
      const userId = req.email;
      const plan = "starter";
      
      await enforceRateLimit(userId, "submit_contact", plan);
      await trackApiUsage(userId, "submit_contact", 0.01);
      // Validate required fields
      if (!req.name || !req.email || !req.message) {
        return {
          success: false,
          message: "Name, email, and message are required fields"
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.email)) {
        return {
          success: false,
          message: "Please provide a valid email address"
        };
      }

      // Insert contact form submission into database
      const result = await db.queryRow<{ id: string }>`
        INSERT INTO contacts (name, email, message)
        VALUES (${req.name}, ${req.email}, ${req.message})
        RETURNING id
      `;

      return {
        success: true,
        id: result?.id || '',
        message: "Thank you for your message. We'll get back to you soon!"
      };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return {
        success: false,
        message: "There was an error submitting your message. Please try again."
      };
    }
  }
);