'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Copy, ExternalLink, Trophy, Users, DollarSign, Gift } from 'lucide-react'
import { useReferralStats, useReferralRewards, useDivvi } from '@/lib/divvi-provider'
import { formatEther } from 'viem'
import { toast } from 'sonner'

interface ReferralDashboardProps {
  className?: string
}

export function ReferralDashboard({ className }: ReferralDashboardProps) {
  const { address, isConnected } = useAccount()
  const { userStats, isLoadingStats, refreshStats } = useReferralStats()
  const { pendingRewards, isLoadingRewards, claimReward } = useReferralRewards()
  const { currentReferralCode } = useDivvi()
  
  const [claimingRewards, setClaimingRewards] = useState<{ [key: string]: boolean }>({})

  const handleCopyReferralCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Referral code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy referral code')
    }
  }

  const handleClaimReward = async (rewardId: string) => {
    setClaimingRewards(prev => ({ ...prev, [rewardId]: true }))
    
    try {
      const success = await claimReward(rewardId)
      if (success) {
        toast.success('Reward claimed successfully!')
      } else {
        toast.error('Failed to claim reward')
      }
    } catch (error) {
      toast.error('Error claiming reward')
    } finally {
      setClaimingRewards(prev => ({ ...prev, [rewardId]: false }))
    }
  }

  if (!isConnected || !address) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Referral Dashboard
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your referral statistics and rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please connect your wallet to continue</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Referral Dashboard
        </h2>
        <p className="text-muted-foreground mt-1">
          Track your referrals and earn rewards by sharing events
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="codes">Referral Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : userStats?.totalReferrals || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  People you've referred
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : 
                    userStats?.totalEarnings ? 
                    `${parseFloat(formatEther(BigInt(userStats.totalEarnings))).toFixed(4)} ETH` : 
                    '0 ETH'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Total rewards earned
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : 
                    userStats?.pendingRewards ? 
                    `${parseFloat(formatEther(BigInt(userStats.pendingRewards))).toFixed(4)} ETH` : 
                    '0 ETH'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to claim
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : userStats?.activeReferralCodes?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Referral codes created
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Referral Status</CardTitle>
              <CardDescription>
                {currentReferralCode ? 
                  `You were referred with code: ${currentReferralCode}` : 
                  'You can earn rewards by sharing events with your friends'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentReferralCode && (
                <Badge variant="secondary" className="mb-4">
                  Using referral: {currentReferralCode}
                </Badge>
              )}
              <div className="flex gap-2">
                <Button onClick={refreshStats} disabled={isLoadingStats}>
                  {isLoadingStats ? 'Refreshing...' : 'Refresh Stats'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Rewards</CardTitle>
              <CardDescription>
                Claim your earned referral rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRewards ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading rewards...</p>
                </div>
              ) : pendingRewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending rewards</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start referring friends to earn rewards!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {parseFloat(formatEther(BigInt(reward.amount))).toFixed(4)} ETH
                        </p>
                        <p className="text-sm text-muted-foreground">
                          From event #{reward.eventId} • {new Date(reward.timestamp).toLocaleDateString()}
                        </p>
                        <Badge variant={reward.status === 'pending' ? 'secondary' : 'default'}>
                          {reward.status}
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => handleClaimReward(reward.id)}
                        disabled={reward.status !== 'pending' || claimingRewards[reward.id]}
                        size="sm"
                      >
                        {claimingRewards[reward.id] ? 'Claiming...' : 'Claim'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Codes</CardTitle>
              <CardDescription>
                These are your active referral codes for events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading referral codes...</p>
                </div>
              ) : !userStats?.activeReferralCodes || userStats.activeReferralCodes.length === 0 ? (
                <div className="text-center py-8">
                  <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active referral codes</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit events to generate referral codes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userStats.activeReferralCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-mono text-sm">{code}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyReferralCode(code)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
