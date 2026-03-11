import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { FEATURE_FLAGS } from "@/subscription/featureFlags";

const STORAGE_KEY = "eateriq_food_battle_usage";

interface StoredUsage {
  date: string;
  used: number;
}

interface FoodBattleLimitState {
  canBattle: boolean;
  battlesLeft: number;
  maxBattles: number;
  recordBattle: () => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

export const useFoodBattleLimit = (): FoodBattleLimitState => {
  const { tier } = useSubscription();
  const isPro = tier !== "free";

  const baseFree = FEATURE_FLAGS.food_battle.freeLimit ?? 3;

  const [used, setUsed] = useState(0);

  // Load from localStorage
  useEffect(() => {
    if (isPro) {
      setUsed(0);
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: StoredUsage = JSON.parse(raw);
      const today = getTodayString();

      if (parsed.date !== today) {
        // new day, reset
        return;
      }

      setUsed(parsed.used ?? 0);
    } catch {
      // ignore parse errors and start fresh
    }
  }, [isPro]);

  const persist = (nextUsed: number) => {
    try {
      const payload: StoredUsage = {
        date: getTodayString(),
        used: nextUsed,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage failures
    }
  };

  const maxBattles = isPro ? Infinity : baseFree;
  const available = isPro ? Infinity : Math.max(0, baseFree - used);
  const canBattle = isPro || available > 0;

  const recordBattle = () => {
    if (isPro) return;
    const nextUsed = used + 1;
    setUsed(nextUsed);
    persist(nextUsed);
  };

  return {
    canBattle,
    battlesLeft: available === Infinity ? Infinity : available,
    maxBattles,
    recordBattle,
  };
};


