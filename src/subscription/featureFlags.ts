// src/subscription/featureFlags.ts
export type FeatureKey =
    | 'scan_unlimited'
    | 'product_full_nutrition'
    | 'product_allergens'
    | 'product_alternatives'
    | 'preference_exact_flag'
    | 'preference_filter'
    | 'preference_safe_label'
    | 'food_battle'
    | 'quiz_unlimited'
    | 'quiz_create'
    | 'calculator_detailed'
    | 'history_unlimited'
    | 'favorites_unlimited';

export interface FeatureConfig {
    requiresPro: boolean;
    freeLimit?: number; // daily limit for free users
    freePreview?: boolean; // show teaser for free users
    paywallMessage: string;
    paywallSubtext?: string;
}

export const FEATURE_FLAGS: Record<FeatureKey, FeatureConfig> = {
    scan_unlimited: {
        requiresPro: true,
        freeLimit: 5,
        paywallMessage: "You've reached today's scan limit",
        paywallSubtext: 'Upgrade to Pro for unlimited scans. Resets at midnight.',
    },
    product_full_nutrition: {
        requiresPro: true,
        paywallMessage: 'Full nutrition breakdown is Pro',
        paywallSubtext: 'See every nutrient, vitamin, and mineral in detail.',
    },
    product_allergens: {
        requiresPro: true,
        paywallMessage: 'Allergen & additive flags are Pro',
        paywallSubtext: 'Know exactly what to avoid based on your profile.',
    },
    product_alternatives: {
        requiresPro: true,
        freePreview: true,
        paywallMessage: 'See all healthier alternatives',
        paywallSubtext: 'Unlock full alternatives tailored to your preferences.',
    },
    preference_exact_flag: {
        requiresPro: true,
        freePreview: true,
        paywallMessage: 'See exactly what conflicts with your preferences',
        paywallSubtext: 'Pro shows the specific ingredient flagged for you.',
    },
    preference_filter: {
        requiresPro: true,
        paywallMessage: 'Filter by your food preferences',
        paywallSubtext: 'Browse and search only products safe for your diet.',
    },
    preference_safe_label: {
        requiresPro: true,
        paywallMessage: 'See which alternatives are safe for you',
        paywallSubtext: 'Pro labels every alternative against your profile.',
    },
    food_battle: {
        requiresPro: false,
        freeLimit: 3,
        paywallMessage: "You've used all 3 free battles today",
        paywallSubtext: 'Upgrade to Pro for unlimited daily battles and no ads.',
    },
    quiz_unlimited: {
        requiresPro: true,
        freeLimit: 5,
        paywallMessage: "You've reached today's quiz limit",
        paywallSubtext: 'Upgrade to Pro for unlimited quizzes every day.',
    },
    quiz_create: {
        requiresPro: true,
        paywallMessage: 'Create your own quizzes with Pro',
        paywallSubtext: 'Build and share nutrition quizzes with the community.',
    },
    calculator_detailed: {
        requiresPro: true,
        freePreview: true,
        paywallMessage: 'Unlock your detailed analysis',
        paywallSubtext: 'Get action plans, meal breakdowns, and personalised tips.',
    },
    history_unlimited: {
        requiresPro: true,
        freeLimit: 10,
        paywallMessage: 'Your scan history is limited to 10',
        paywallSubtext: 'Upgrade to Pro to keep your full scan history forever.',
    },
    favorites_unlimited: {
        requiresPro: true,
        freeLimit: 10,
        paywallMessage: "You've reached your favourites limit (10)",
        paywallSubtext: 'Upgrade to Pro for unlimited favourites.',
    },
};
