import { useState, useCallback, useRef } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  cooldownMs?: number;
}

interface RateLimitState {
  isLimited: boolean;
  attemptsRemaining: number;
  resetTime: number | null;
  cooldownEnd: number | null;
}

export const useRateLimit = (options: RateLimitOptions) => {
  const { maxAttempts, windowMs, cooldownMs = 60000 } = options;
  const attemptsRef = useRef<number[]>([]);
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    attemptsRemaining: maxAttempts,
    resetTime: null,
    cooldownEnd: null,
  });

  const cleanOldAttempts = useCallback(() => {
    const now = Date.now();
    attemptsRef.current = attemptsRef.current.filter(
      (timestamp) => now - timestamp < windowMs
    );
  }, [windowMs]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();

    // Check if in cooldown
    if (state.cooldownEnd && now < state.cooldownEnd) {
      return false;
    }

    cleanOldAttempts();

    if (attemptsRef.current.length >= maxAttempts) {
      const oldestAttempt = attemptsRef.current[0];
      const resetTime = oldestAttempt + windowMs;

      setState({
        isLimited: true,
        attemptsRemaining: 0,
        resetTime,
        cooldownEnd: now + cooldownMs,
      });

      return false;
    }

    return true;
  }, [state.cooldownEnd, cleanOldAttempts, maxAttempts, windowMs, cooldownMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    attemptsRef.current.push(now);
    cleanOldAttempts();

    const remaining = Math.max(0, maxAttempts - attemptsRef.current.length);

    setState((prev) => ({
      ...prev,
      attemptsRemaining: remaining,
      isLimited: remaining === 0,
    }));
  }, [cleanOldAttempts, maxAttempts]);

  const reset = useCallback(() => {
    attemptsRef.current = [];
    setState({
      isLimited: false,
      attemptsRemaining: maxAttempts,
      resetTime: null,
      cooldownEnd: null,
    });
  }, [maxAttempts]);

  const getRemainingCooldown = useCallback((): number => {
    if (!state.cooldownEnd) return 0;
    const remaining = state.cooldownEnd - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }, [state.cooldownEnd]);

  return {
    isLimited: state.isLimited,
    attemptsRemaining: state.attemptsRemaining,
    checkRateLimit,
    recordAttempt,
    reset,
    getRemainingCooldown,
  };
};
