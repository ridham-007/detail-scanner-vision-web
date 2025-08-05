const RATE_LIMIT = 10; // max 20 requests
const WINDOW_MS = 60 * 1000; // per 60 seconds

type RateTracker = {
  [key: string]: number[];
};

const rateTracker: RateTracker = {};

export const rateLimitedQuery = async (
  key: string,
  queryFn: () => Promise<unknown>
) => {
  const now = Date.now();
  const calls = rateTracker[key] || [];

  // Remove old entries
  const recentCalls = calls.filter(timestamp => now - timestamp < WINDOW_MS);

  if (recentCalls.length >= RATE_LIMIT) {
    console.warn(`⛔ Rate limit exceeded for ${key}`);
    throw new Error("Too many requests. Please wait a moment.");
  }

  // Add current timestamp
  rateTracker[key] = [...recentCalls, now];

  return queryFn();
};
