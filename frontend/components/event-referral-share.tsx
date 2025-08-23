'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Copy, Share2, ExternalLink, DollarSign } from 'lucide-react'
import { useEventTracking } from '@/lib/divvi-provider'
import { EventReferralInfo } from '@/lib/divvi-client'
import { DIVVI_CONFIG } from '@/lib/divvi-config'
import { toast } from 'sonner'

interface EventReferralShareProps {
  eventId: string
  eventName: string
  className?: string
}

export function EventReferralShare({ eventId, eventName, className }: EventReferralShareProps) {
  const { address, isConnected } = useAccount()
  const { getEventReferralInfo } = useEventTracking()
  const [referralInfo, setReferralInfo] = useState<EventReferralInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    if (isConnected && address && DIVVI_CONFIG.ui.showReferralLinks) {
      loadReferralInfo()
    }
  }, [isConnected, address, eventId])

  const loadReferralInfo = async () => {
    if (!address || !isConnected) return

    setLoading(true)
    try {
      const info = await getEventReferralInfo(eventId)
      setReferralInfo(info)
    } catch (error) {
      console.error('Error loading referral info:', error)
      toast.error('Failed to load referral information')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!referralInfo?.referralLink) return

    try {
      await navigator.clipboard.writeText(referralInfo.referralLink)
      toast.success('Referral link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy referral link')
    }
  }

  const handleCopyCode = async () => {
    if (!referralInfo?.referralCode) return

    try {
      await navigator.clipboard.writeText(referralInfo.referralCode)
      toast.success('Referral code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy referral code')
    }
  }

  const handleShare = async () => {
    if (!referralInfo) return

    setSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out ${eventName} on Tixora`,
          text: `Join me at ${eventName}! Use my referral link to get tickets on Tixora.`,
          url: referralInfo.referralLink,
        })
        toast.success('Shared successfully!')
      } else {
        // Fallback to copy link
        await handleCopyLink()
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share')
    } finally {
      setSharing(false)
    }
  }

  if (!isConnected || !address) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share & Earn
          </CardTitle>
          <CardDescription>
            Connect your wallet to generate referral links and earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Connect your wallet to start earning referral rewards
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!DIVVI_CONFIG.ui.showReferralLinks) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share & Earn Rewards
        </CardTitle>
        <CardDescription>
          Share this event with friends and earn {DIVVI_CONFIG.referral.defaultRewardPercentage}% commission on their tickets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">Loading referral information...</p>
          </div>
        ) : referralInfo ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Referral Code</p>
                  <p className="font-mono text-sm text-muted-foreground">{referralInfo.referralCode}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Referral Link</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {referralInfo.referralLink}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Reward Rate</span>
                </div>
                <Badge variant="secondary">{referralInfo.rewardPercentage}% commission</Badge>
              </div>
              
              <div className="text-right space-y-1">
                <p className="text-xs text-muted-foreground">Total Referrals</p>
                <p className="text-sm font-medium">{referralInfo.totalReferrals}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleShare} 
                className="flex-1" 
                disabled={sharing}
              >
                {sharing ? 'Sharing...' : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open(referralInfo.referralLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {referralInfo.totalReferrals > 0 && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 You've referred {referralInfo.totalReferrals} people to this event!
                  {referralInfo.totalRewards && referralInfo.totalRewards !== '0' && (
                    <> You've earned {parseFloat(referralInfo.totalRewards).toFixed(4)} ETH in rewards.</>  
                  )}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-3">
              Failed to load referral information
            </p>
            <Button variant="outline" size="sm" onClick={loadReferralInfo}>
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
