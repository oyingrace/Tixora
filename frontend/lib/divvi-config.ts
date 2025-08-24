/**
 * Divvi Configuration for Tixora Event Ticketing Platform
 * Consumer Address: 0x08d0d1572A8a714D90D670Ea344Dd23B1dF565Dd
 */

export const DIVVI_CONFIG = {
  // Consumer address provided by Divvi
  consumerAddress: '0x08d0d1572A8a714D90D670Ea344Dd23B1dF565Dd',
  
  // API endpoints (adjust based on Divvi's actual endpoints)
  apiBaseUrl: process.env.NEXT_PUBLIC_DIVVI_API_URL || 'https://api.divvi.io',
  
  // Network configuration
  network: process.env.NEXT_PUBLIC_NETWORK || 'mainnet',
  
  // Referral settings
  referral: {
    // Default referral reward percentage (can be customized per event)
    defaultRewardPercentage: 5, // 5%
    
    // Minimum reward amount in wei
    minRewardAmount: '1000000000000000', // 0.001 ETH
    
    // Cookie expiry for referral tracking (in days)
    cookieExpiryDays: 30,
    
    // Enable/disable referral tracking
    enabled: true,
  },
  
  // Event tracking settings
  tracking: {
    // Track event views
    trackViews: true,
    
    // Track registrations
    trackRegistrations: true,
    
    // Track referral clicks
    trackReferralClicks: true,
    
    // Track user behavior
    trackUserBehavior: true,
  },
  
  // UI settings
  ui: {
    // Show referral links in events
    showReferralLinks: true,
    
    // Show referral dashboard
    showReferralDashboard: true,
    
    // Enable referral notifications
    enableNotifications: true,
  },
}

export type DivviConfig = typeof DIVVI_CONFIG
