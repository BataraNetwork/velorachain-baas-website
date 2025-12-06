import { APIError } from "encore.dev/api";

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitStore>();
const quotaStore = new Map<string, number>();

export interface PlanLimits {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  quotaPerDay: number;
}

const planLimits: Record<string, PlanLimits> = {
  starter: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 1000,
    quotaPerDay: 1000,
  },
  pro: {
    requestsPerMinute: 50,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    quotaPerDay: 10000,
  },
  enterprise: {
    requestsPerMinute: 200,
    requestsPerHour: 10000,
    requestsPerDay: 100000,
    quotaPerDay: 100000,
  },
};

function getRateLimitKey(userId: string, endpoint: string, window: string): string {
  const now = Date.now();
  let windowSize: number;
  
  switch (window) {
    case "minute":
      windowSize = 60000;
      break;
    case "hour":
      windowSize = 3600000;
      break;
    case "day":
      windowSize = 86400000;
      break;
    default:
      windowSize = 60000;
  }
  
  const windowStart = Math.floor(now / windowSize);
  return `${userId}:${endpoint}:${window}:${windowStart}`;
}

function getQuotaKey(userId: string): string {
  const now = Date.now();
  const dayStart = Math.floor(now / 86400000);
  return `${userId}:quota:${dayStart}`;
}

function cleanupExpiredKeys(): void {
  const now = Date.now();
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanupExpiredKeys, 60000);

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  quotaRemaining: number;
  quotaPercentage: number;
}

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  plan: string
): Promise<RateLimitResult> {
  const limits = planLimits[plan] || planLimits.starter;
  const now = Date.now();

  const minuteKey = getRateLimitKey(userId, endpoint, "minute");
  const hourKey = getRateLimitKey(userId, endpoint, "hour");
  const dayKey = getRateLimitKey(userId, endpoint, "day");
  const quotaKey = getQuotaKey(userId);

  const minuteData = rateLimitStore.get(minuteKey) || { count: 0, resetAt: now + 60000 };
  const hourData = rateLimitStore.get(hourKey) || { count: 0, resetAt: now + 3600000 };
  const dayData = rateLimitStore.get(dayKey) || { count: 0, resetAt: now + 86400000 };
  const currentQuota = quotaStore.get(quotaKey) || 0;

  if (minuteData.count >= limits.requestsPerMinute) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(minuteData.resetAt),
      quotaRemaining: limits.quotaPerDay - currentQuota,
      quotaPercentage: (currentQuota / limits.quotaPerDay) * 100,
    };
  }

  if (hourData.count >= limits.requestsPerHour) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(hourData.resetAt),
      quotaRemaining: limits.quotaPerDay - currentQuota,
      quotaPercentage: (currentQuota / limits.quotaPerDay) * 100,
    };
  }

  if (dayData.count >= limits.requestsPerDay) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(dayData.resetAt),
      quotaRemaining: limits.quotaPerDay - currentQuota,
      quotaPercentage: (currentQuota / limits.quotaPerDay) * 100,
    };
  }

  if (currentQuota >= limits.quotaPerDay) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(Math.ceil(now / 86400000) * 86400000),
      quotaRemaining: 0,
      quotaPercentage: 100,
    };
  }

  rateLimitStore.set(minuteKey, { count: minuteData.count + 1, resetAt: minuteData.resetAt });
  rateLimitStore.set(hourKey, { count: hourData.count + 1, resetAt: hourData.resetAt });
  rateLimitStore.set(dayKey, { count: dayData.count + 1, resetAt: dayData.resetAt });
  quotaStore.set(quotaKey, currentQuota + 1);

  const remaining = Math.min(
    limits.requestsPerMinute - minuteData.count - 1,
    limits.requestsPerHour - hourData.count - 1,
    limits.requestsPerDay - dayData.count - 1
  );

  return {
    allowed: true,
    remaining,
    resetAt: new Date(minuteData.resetAt),
    quotaRemaining: limits.quotaPerDay - currentQuota - 1,
    quotaPercentage: ((currentQuota + 1) / limits.quotaPerDay) * 100,
  };
}

export async function enforceRateLimit(
  userId: string,
  endpoint: string,
  plan: string
): Promise<void> {
  const result = await checkRateLimit(userId, endpoint, plan);

  if (!result.allowed) {
    throw APIError.resourceExhausted("Rate limit exceeded. Please try again later.").withDetails({
      retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000),
      resetAt: result.resetAt.toISOString(),
      quotaRemaining: result.quotaRemaining,
    });
  }

  if (result.quotaPercentage >= 90) {
    console.warn(`User ${userId} has used ${result.quotaPercentage.toFixed(1)}% of daily quota`);
  }
}

export async function getRateLimitStatus(userId: string, plan: string) {
  const limits = planLimits[plan] || planLimits.starter;
  const quotaKey = getQuotaKey(userId);
  const currentQuota = quotaStore.get(quotaKey) || 0;

  return {
    plan,
    limits,
    quotaUsed: currentQuota,
    quotaRemaining: limits.quotaPerDay - currentQuota,
    quotaPercentage: (currentQuota / limits.quotaPerDay) * 100,
  };
}
