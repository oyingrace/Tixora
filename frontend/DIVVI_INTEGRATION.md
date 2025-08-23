# Divvi Integration in Tixora

This document outlines the integration of Divvi's referral system into the Tixora event ticketing platform.

## Overview

The Divvi integration provides referral tracking and rewards functionality, allowing users to earn commissions by referring others to purchase event tickets.

## Consumer Address

**Consumer Address**: `0x08d0d1572A8a714D90D670Ea344Dd23B1dF565Dd`

This is the unique identifier for Tixora's integration with the Divvi platform.

## Features Implemented

### 1. Referral System
- **Referral Code Generation**: Unique codes generated for each user-event combination
- **Referral Link Sharing**: Shareable links with embedded referral codes
- **Commission Tracking**: 5% default commission rate on successful referrals
- **Cookie-based Tracking**: 30-day tracking window for referral attribution

### 2. User Dashboard
- **Referral Statistics**: Total referrals, earnings, and pending rewards
- **Reward Management**: View and claim pending referral rewards
- **Active Referral Codes**: Manage all generated referral codes

### 3. Event Integration
- **Event Referral Cards**: Share buttons and referral links on event pages
- **Registration Tracking**: Automatic tracking when users register via referral links
- **View Tracking**: Track when users view events via referral links

### 4. Reward System
- **Automatic Calculation**: Commission calculated based on ticket prices
- **Reward Claims**: Users can claim their earned rewards
- **Status Tracking**: Pending, claimed, and expired reward states

## Files Structure

```
lib/
├── divvi-config.ts         # Configuration settings
├── divvi-client.ts         # Core client functionality
├── divvi-provider.tsx      # React context provider
└── providers.tsx           # Updated to include DivviProvider

components/
├── referral-dashboard.tsx      # Main referral dashboard UI
├── event-referral-share.tsx    # Event sharing component
└── event-tracking-wrapper.tsx  # Event tracking utilities
```

## Configuration

The Divvi integration is configured in `lib/divvi-config.ts`:

```typescript
export const DIVVI_CONFIG = {
  consumerAddress: '0x08d0d1572A8a714D90D670Ea344Dd23B1dF565Dd',
  apiBaseUrl: process.env.NEXT_PUBLIC_DIVVI_API_URL || 'https://api.divvi.io',
  referral: {
    defaultRewardPercentage: 5, // 5%
    minRewardAmount: '1000000000000000', // 0.001 ETH
    cookieExpiryDays: 30,
    enabled: true,
  },
  // ... other settings
}
```

## Usage

### React Hooks

#### useDivvi()
Main hook for accessing all Divvi functionality:

```tsx
const { 
  userStats, 
  pendingRewards, 
  trackEventView, 
  trackEventRegistration,
  currentReferralCode 
} = useDivvi()
```

#### useReferralStats()
Hook for referral statistics:

```tsx
const { userStats, isLoadingStats, refreshStats } = useReferralStats()
```

#### useEventTracking()
Hook for event tracking:

```tsx
const { trackEventView, trackEventRegistration, getEventReferralInfo } = useEventTracking()
```

### Components

#### ReferralDashboard
Complete dashboard showing user referral stats:

```tsx
<ReferralDashboard className="custom-class" />
```

#### EventReferralShare
Event-specific referral sharing component:

```tsx
<EventReferralShare 
  eventId="123" 
  eventName="Web3 Conference" 
  className="custom-class" 
/>
```

## Event Tracking

### Automatic Tracking
- **Referral Clicks**: Tracked when users visit via referral links
- **Event Views**: Tracked when users view event details
- **Registrations**: Tracked when users purchase tickets

### Manual Tracking
Track events programmatically:

```typescript
// Track event view
await trackEventView(eventId)

// Track event registration
await trackEventRegistration(eventId)

// Get referral info for an event
const referralInfo = await getEventReferralInfo(eventId)
```

## Referral Flow

1. **User generates referral link** for an event
2. **Referral link is shared** with friends via social media, messaging, etc.
3. **Friend clicks referral link** and visits the event page
4. **Referral code is stored** in localStorage and cookies
5. **Friend purchases ticket** and referral is attributed
6. **Commission is calculated** and added to referrer's pending rewards
7. **Referrer can claim rewards** through the dashboard

## API Integration

The integration is designed to work with Divvi's API endpoints. Currently implements:
- Referral tracking and storage
- Commission calculations
- Reward management

*Note: Replace mock API calls with actual Divvi API endpoints when available.*

## Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_DIVVI_API_URL=https://api.divvi.io
NEXT_PUBLIC_NETWORK=mainnet
```

## Testing

To test the integration:

1. **Connect wallet** to the dapp
2. **Navigate to dashboard** to see referral statistics
3. **Visit any event page** to generate referral links
4. **Share referral links** and test tracking
5. **Check reward accumulation** in the referral dashboard

## Future Enhancements

- [ ] Integration with Divvi's actual API endpoints
- [ ] Advanced analytics and reporting
- [ ] Customizable commission rates per event
- [ ] Automated reward distribution
- [ ] Social media integration
- [ ] Referral leaderboards
- [ ] Multi-tier referral programs

## Support

For issues related to the Divvi integration:

1. Check the browser console for tracking logs
2. Verify wallet connection and network
3. Ensure referral codes are properly generated
4. Test with different browsers/incognito mode

## Security Considerations

- Referral codes are generated client-side but should be validated server-side
- Reward claims should be verified on-chain
- Rate limiting should be implemented for referral generation
- Suspicious referral patterns should be monitored

## License

This integration follows the same license as the Tixora project.
