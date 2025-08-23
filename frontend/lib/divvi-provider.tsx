'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  divviClient, 
  UserReferralStats, 
  EventReferralInfo, 
  ReferralReward 
} from './divvi-client'
import { DIVVI_CONFIG } from './divvi-config'

// Context types
interface DivviContextType {
  // Referral stats
  userStats: UserReferralStats | null
  pendingRewards: ReferralReward[]
  
  // Loading states
  isLoadingStats: boolean
  isLoadingRewards: boolean
  
  // Actions
  trackEventView: (eventId: string) => Promise<void>
  trackEventRegistration: (eventId: string) => Promise<void>
  getEventReferralInfo: (eventId: string) => Promise<EventReferralInfo | null>
  claimReward: (rewardId: string) => Promise<boolean>
  refreshStats: () => Promise<void>
  
  // Referral data
  currentReferralCode: string | null
  hasReferral: boolean
}

const DivviContext = createContext<DivviContextType | undefined>(undefined)

// Provider component
interface DivviProviderProps {
  children: ReactNode
}

export function DivviProvider({ children }: DivviProviderProps) {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State
  const [userStats, setUserStats] = useState<UserReferralStats | null>(null)
  const [pendingRewards, setPendingRewards] = useState<ReferralReward[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [isLoadingRewards, setIsLoadingRewards] = useState(false)
  const [currentReferralCode, setCurrentReferralCode] = useState<string | null>(null)

  // Check for referral code in URL params
  useEffect(() => {
    const refParam = searchParams.get('ref')
    if (refParam && DIVVI_CONFIG.referral.enabled) {
      setCurrentReferralCode(refParam)
      divviClient.trackReferralClick(refParam, address)
    }
  }, [searchParams, address])

  // Load user stats when wallet connects
  useEffect(() => {
    if (isConnected && address && DIVVI_CONFIG.referral.enabled) {
      loadUserStats()
      loadPendingRewards()
    } else {
      setUserStats(null)
      setPendingRewards([])
    }
  }, [isConnected, address])

  // Functions
  const loadUserStats = async () => {
    if (!address || !isConnected) return

    setIsLoadingStats(true)
    try {
      const stats = await divviClient.getUserReferralStats(address)
      setUserStats(stats)
    } catch (error) {
      console.error('Error loading user stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const loadPendingRewards = async () => {
    if (!address || !isConnected) return

    setIsLoadingRewards(true)
    try {
      const rewards = await divviClient.getPendingRewards(address)
      setPendingRewards(rewards)
    } catch (error) {
      console.error('Error loading pending rewards:', error)
    } finally {
      setIsLoadingRewards(false)
    }
  }

  const trackEventView = async (eventId: string) => {
    try {
      await divviClient.trackEventView(eventId, address)
    } catch (error) {
      console.error('Error tracking event view:', error)
    }
  }

  const trackEventRegistration = async (eventId: string) => {
    if (!address || !isConnected) return

    try {
      await divviClient.trackEventRegistration(eventId, address, currentReferralCode || undefined)
      // Refresh stats after registration
      await loadUserStats()
      await loadPendingRewards()
    } catch (error) {
      console.error('Error tracking event registration:', error)
    }
  }

  const getEventReferralInfo = async (eventId: string): Promise<EventReferralInfo | null> => {
    if (!address || !isConnected) return null

    try {
      return await divviClient.getEventReferralInfo(eventId, address)
    } catch (error) {
      console.error('Error getting event referral info:', error)
      return null
    }
  }

  const claimReward = async (rewardId: string): Promise<boolean> => {
    if (!address || !isConnected) return false

    try {
      const success = await divviClient.claimReward(rewardId, address)
      if (success) {
        // Refresh rewards after claiming
        await loadPendingRewards()
        await loadUserStats()
      }
      return success
    } catch (error) {
      console.error('Error claiming reward:', error)
      return false
    }
  }

  const refreshStats = async () => {
    await Promise.all([loadUserStats(), loadPendingRewards()])
  }

  const value: DivviContextType = {
    userStats,
    pendingRewards,
    isLoadingStats,
    isLoadingRewards,
    trackEventView,
    trackEventRegistration,
    getEventReferralInfo,
    claimReward,
    refreshStats,
    currentReferralCode,
    hasReferral: !!currentReferralCode,
  }

  return <DivviContext.Provider value={value}>{children}</DivviContext.Provider>
}

// Custom hooks
export function useDivvi() {
  const context = useContext(DivviContext)
  if (context === undefined) {
    throw new Error('useDivvi must be used within a DivviProvider')
  }
  return context
}

export function useReferralStats() {
  const { userStats, isLoadingStats, refreshStats } = useDivvi()
  return { userStats, isLoadingStats, refreshStats }
}

export function useReferralRewards() {
  const { pendingRewards, isLoadingRewards, claimReward } = useDivvi()
  return { pendingRewards, isLoadingRewards, claimReward }
}

export function useEventTracking() {
  const { trackEventView, trackEventRegistration, getEventReferralInfo } = useDivvi()
  return { trackEventView, trackEventRegistration, getEventReferralInfo }
}

export function useReferralCode() {
  const { currentReferralCode, hasReferral } = useDivvi()
  return { currentReferralCode, hasReferral }
}
