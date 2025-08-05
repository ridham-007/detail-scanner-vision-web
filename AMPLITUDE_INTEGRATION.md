# Amplitude Integration Setup Guide

## Overview
Amplitude has been successfully integrated into EaterIQ to provide comprehensive product analytics and user behavior tracking.

## Installation
✅ Added `@amplitude/analytics-browser` package

## Configuration

### 1. API Key Setup
You need to add your Amplitude API key to the analytics configuration:

**File: `src/utils/analytics.ts`**
```typescript
export const AMPLITUDE_API_KEY = 'YOUR_AMPLITUDE_API_KEY'; // Replace with your actual Amplitude API key
```

### 2. Current Implementation

#### Analytics Initialization
- ✅ Analytics initialized in `src/main.tsx`
- ✅ Both Google Analytics and Amplitude initialized together
- ✅ Default tracking enabled for sessions, page views, form interactions, and file downloads

#### User Identification
- ✅ Automatic user identification on sign-in
- ✅ User properties set: email, provider, created_at
- ✅ Proper handling of sign-out events

#### Scanner Events (Implemented)
- ✅ `scan_attempt` - When user starts scanning
- ✅ `manual_barcode_entry` - When user enters barcode manually
- ✅ `scan_success` - When barcode scan succeeds
- ✅ `scan_error` - When barcode scan fails
- ✅ `product_viewed` - When product details are viewed
- ✅ `scan_duplicate` - When user scans a previously scanned product
- ✅ `product_not_found` - When product lookup fails

#### Authentication Events (Implemented)
- ✅ `user_signed_in` - User login with provider info
- ✅ `user_signed_out` - User logout

## Next Implementation Steps

### Priority 1: Core User Engagement
- [ ] Quiz interactions: `quiz_started`, `quiz_completed`, `quiz_question_answered`
- [ ] Favorites: `product_favorited`, `product_unfavorited`
- [ ] Shopping lists: `list_created`, `item_added_to_list`

### Priority 2: Advanced Product Analytics
- [ ] Health insights: `health_insights_viewed`, `health_score_clicked`
- [ ] Product sharing: `product_shared`
- [ ] Ingredient analysis: `ingredients_expanded`

### Priority 3: User Properties Enhancement
- [ ] Scan frequency tracking
- [ ] Average health score preference
- [ ] Feature usage patterns
- [ ] User segments (health-conscious, convenience-focused, etc.)

### Priority 4: Business Intelligence
- [ ] Conversion funnels
- [ ] Retention cohorts
- [ ] Feature adoption rates
- [ ] Content engagement metrics

## Event Properties Standards

### Common Properties
All events include these standard properties:
- `user_id`: Supabase user ID
- `timestamp`: Event timestamp
- `session_id`: Amplitude session ID

### Product-Related Events
- `barcode`: Product barcode
- `product_name`: Product name
- `health_score`: Product health score (if available)
- `scan_method`: 'camera' or 'manual'

### User Events
- `provider`: Authentication provider (google, email, etc.)
- `email`: User email (for identification)

## Dashboard Recommendations

### Key Metrics to Track
1. **User Engagement**
   - Daily/Weekly/Monthly Active Users
   - Session duration
   - Scans per session

2. **Product Discovery**
   - Scan success rate
   - Product not found rate
   - Duplicate scan rate

3. **Feature Adoption**
   - Quiz completion rate
   - Shopping list usage
   - Favorites usage

4. **User Journey**
   - Scan to action conversion
   - New user onboarding funnel
   - Feature discovery rate

### Recommended Amplitude Charts
1. **Funnel**: Scanner → Product View → Action (Save/Share/Add to List)
2. **Retention**: Day 1, 7, 30 retention rates
3. **User Flow**: Most common user paths through the app
4. **Cohort**: User behavior patterns by signup date

## Getting Your Amplitude API Key

1. Sign up for Amplitude at https://amplitude.com
2. Create a new project for EaterIQ
3. Go to Settings → Projects → [Your Project] → General
4. Copy the API Key
5. Replace `YOUR_AMPLITUDE_API_KEY` in `src/utils/analytics.ts`

## Testing the Integration

1. Open browser developer tools
2. Check the Network tab for Amplitude API calls
3. Events should be sent to `https://api2.amplitude.com/2/httpapi`
4. In Amplitude dashboard, events should appear within minutes

## Troubleshooting

### Events Not Appearing
- Check API key is correct
- Verify network requests in browser dev tools
- Ensure user has consented to analytics (if using consent management)

### Duplicate Events
- Make sure `initAnalytics()` is only called once
- Check for multiple component re-renders triggering events

### Missing User Properties
- Verify user identification is happening after successful login
- Check that user properties are being set correctly in the auth flow

---

**Status**: ✅ Basic integration complete
**Next Steps**: Add your Amplitude API key and test the integration