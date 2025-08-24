import { DIVVI_CONFIG } from './divvi-config'

// Types for Divvi integration
export interface ReferralData {
  referralCode: string
  referrerAddress: string
  eventId: string
  rewardPercentage: number
  timestamp: number
}

export interface UserReferralStats {
  totalReferrals: number
  totalEarnings: string // in wei
  pendingRewards: string // in wei
  activeReferralCodes: string[]
}

export interface EventReferralInfo {
  eventId: string
  referralCode: string
  referralLink: string
  rewardPercentage: number
  totalReferrals: number
  totalRewards: string // in wei
}

export interface ReferralReward {
  id: string
  referralCode: string
  referrerAddress: string
  referredAddress: string
  eventId: string
  amount: string // in wei
  status: 'pending' | 'claimed' | 'expired'
  timestamp: number
}

// Utility functions
export class DivviClient {
  private consumerAddress: string
  private apiBaseUrl: string

  constructor() {
    this.consumerAddress = DIVVI_CONFIG.consumerAddress
    this.apiBaseUrl = DIVVI_CONFIG.apiBaseUrl
  }

  /**
   * Generate a referral code for a user and event
   */
  generateReferralCode(userAddress: string, eventId: string): string {
    // Simple referral code generation (in production, this should be more sophisticated)
    const timestamp = Date.now().toString(36)
    const userHash = userAddress.slice(2, 8) // Take first 6 chars after 0x
    const eventHash = eventId.toString().slice(-4) // Take last 4 chars of event ID
    
    return `${userHash}${eventHash}${timestamp}`.toUpperCase()
  }

  /**
   * Generate a referral link for sharing
   */
  generateReferralLink(eventId: string, referralCode: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tixora.com'
    return `${baseUrl}/marketplace?event=${eventId}&ref=${referralCode}`
  }

  /**
   * Track referral click
   */
  async trackReferralClick(referralCode: string, clickerAddress?: string): Promise<void> {
    if (!DIVVI_CONFIG.tracking.trackReferralClicks) return

    try {
      // Store referral in localStorage and cookies for tracking
      if (typeof window !== 'undefined') {
        localStorage.setItem('tixora_referral_code', referralCode)
        localStorage.setItem('tixora_referral_timestamp', Date.now().toString())
        
        // Set cookie for cross-session tracking
        document.cookie = `tixora_ref=${referralCode}; max-age=${DIVVI_CONFIG.referral.cookieExpiryDays * 24 * 60 * 60}; path=/`
      }

      // TODO: Send to Divvi API when available
      console.log('Tracked referral click:', { referralCode, clickerAddress, timestamp: Date.now() })
    } catch (error) {
      console.error('Error tracking referral click:', error)
    }
  }

  /**
   * Track event view
   */
  async trackEventView(eventId: string, userAddress?: string): Promise<void> {
    if (!DIVVI_CONFIG.tracking.trackViews) return

    try {
      // TODO: Send to Divvi API when available
      console.log('Tracked event view:', { eventId, userAddress, timestamp: Date.now() })
    } catch (error) {
      console.error('Error tracking event view:', error)
    }
  }

  /**
   * Track event registration
   */
  async trackEventRegistration(
    eventId: string, 
    userAddress: string, 
    referralCode?: string
  ): Promise<void> {
    if (!DIVVI_CONFIG.tracking.trackRegistrations) return

    try {
      // Check for referral code from localStorage if not provided
      if (!referralCode && typeof window !== 'undefined') {
        referralCode = localStorage.getItem('tixora_referral_code') || undefined
      }

      // TODO: Send to Divvi API and process referral reward
      console.log('Tracked event registration:', { 
        eventId, 
        userAddress, 
        referralCode, 
        timestamp: Date.now() 
      })

      // Clear referral tracking after successful registration
      if (referralCode && typeof window !== 'undefined') {
        localStorage.removeItem('tixora_referral_code')
        localStorage.removeItem('tixora_referral_timestamp')
      }
    } catch (error) {
      console.error('Error tracking event registration:', error)
    }
  }

  /**
   * Get user referral statistics
   */
  async getUserReferralStats(userAddress: string): Promise<UserReferralStats> {
    try {
      // TODO: Fetch from Divvi API when available
      // For now, return mock data
      return {
        totalReferrals: 0,
        totalEarnings: '0',
        pendingRewards: '0',
        activeReferralCodes: []
      }
    } catch (error) {
      console.error('Error fetching user referral stats:', error)
      throw error
    }
  }

  /**
   * Get referral information for an event
   */
  async getEventReferralInfo(eventId: string, userAddress: string): Promise<EventReferralInfo> {
    try {
      const referralCode = this.generateReferralCode(userAddress, eventId)
      const referralLink = this.generateReferralLink(eventId, referralCode)

      // TODO: Fetch actual data from Divvi API when available
      return {
        eventId,
        referralCode,
        referralLink,
        rewardPercentage: DIVVI_CONFIG.referral.defaultRewardPercentage,
        totalReferrals: 0,
        totalRewards: '0'
      }
    } catch (error) {
      console.error('Error fetching event referral info:', error)
      throw error
    }
  }

  /**
   * Get pending referral rewards for a user
   */
  async getPendingRewards(userAddress: string): Promise<ReferralReward[]> {
    try {
      // TODO: Fetch from Divvi API when available
      return []
    } catch (error) {
      console.error('Error fetching pending rewards:', error)
      throw error
    }
  }

  /**
   * Claim referral reward
   */
  async claimReward(rewardId: string, userAddress: string): Promise<boolean> {
    try {
      // TODO: Implement reward claiming via Divvi API
      console.log('Claiming reward:', { rewardId, userAddress })
      return true
    } catch (error) {
      console.error('Error claiming reward:', error)
      return false
    }
  }
}

// Singleton instance
export const divviClient = new DivviClient()
