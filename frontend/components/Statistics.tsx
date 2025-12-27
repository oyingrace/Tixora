import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { useEventTicketingGetters } from '../hooks/useEventTicketing'
import { useConnection } from 'wagmi'
import { Calendar, DollarSign, Plus, Users } from 'lucide-react'
import { formatEther } from 'viem'
import { ChainId } from '@/lib/addressAndAbi'

function Statistics() {
  
  const [userStats, setUserStats] = useState({
    attendedEvents: 0,
    totalSpent: "0",
    createdEvents: 0,
    totalRevenue: "0"
  })
  
  const { address, chain } = useConnection()
  const { useGetRecentTickets } = useEventTicketingGetters()
  const chainId = chain?.id || ChainId.BASE;

    const { data: recentTicketsData } = useGetRecentTickets()

    useEffect(() => {
        if (!recentTicketsData || !address) return
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tickets = recentTicketsData as any[]

        // Calculate events created by user
        const createdByUser = tickets.filter(ticket => 
          ticket.creator.toLowerCase() === address.toLowerCase()
        )
        
        // Calculate total revenue from created events
        const totalRevenue = createdByUser.reduce((sum, ticket) => 
          sum + Number(ticket.totalCollected), 0
        )
        
        // Calculate events attended (rough estimation - in real app you'd track registrations)
        const attendedEvents = tickets.filter(ticket => 
          ticket.sold > 0 && !ticket.canceled
        ).length
            
        // Calculate estimated spending (this would need actual registration tracking)
        const estimatedSpent = attendedEvents * 0.01 // Rough estimation
            
        setUserStats({
          attendedEvents: attendedEvents,
          totalSpent: estimatedSpent.toString(),
          createdEvents: createdByUser.length,
          totalRevenue: formatEther(BigInt(totalRevenue))
        })

    }, [recentTicketsData, address])

    const price = chainId === ChainId.BASE ? "BASE" : "CELO"

    const stats = useMemo(() => [
        {
          label: "Events Attended",
          value: userStats.attendedEvents.toString(),
          change: userStats.attendedEvents > 0 ? "Based on ticket ownership" : "Connect to see your events",
          icon: Calendar,
          color: "from-[#51a2ff] to-[#1c398e]"
        },
        {
          label: "Total Spent",
          value: `${userStats.totalSpent} ${price}`,
          change: userStats.attendedEvents > 0 ? "Estimated spending" : "No purchases yet",
          icon: DollarSign,
          color: "from-[#1c398e] to-[#0f172b]"
        },
        {
          label: "Events Created",
          value: userStats.createdEvents.toString(),
          change: userStats.createdEvents > 0 ? 
            `${userStats.createdEvents} events launched` : "Create your first event",
          icon: Plus,
          color: "from-[#51a2ff] to-[#1c398e]"
        },
        {
          label: "Revenue Earned",
          value: `${userStats.totalRevenue} ${price}`,
          change: userStats.createdEvents > 0 ? 
            `From ${userStats.createdEvents} events` : "No revenue yet",
          icon: Users,
          color: "from-[#1c398e] to-[#0f172b]"
        },
      ], [userStats, price])

      // Platform stats
        const platformStats = useMemo(() => {
          if (!recentTicketsData) return null
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tickets = recentTicketsData as any[]
          const activeEvents = tickets.filter(t => !t.closed && !t.canceled).length
          const totalSold = tickets.reduce((sum, t) => sum + Number(t.sold), 0)
          const totalRevenue = tickets.reduce((sum, t) => sum + Number(t.totalCollected), 0)
          
          return {
            totalEvents: tickets.length,
            activeEvents,
            totalTicketsSold: totalSold,
            totalPlatformRevenue: formatEther(BigInt(totalRevenue))
          }
        }, [recentTicketsData])
      

    return (
        <div>
            {/* Platform Overview */}
            {platformStats && (
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-3 text-white">
                        Platform Overview
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-[#1c398e]/20 border-[#1c398e]/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.totalEvents}</p>
                                <p className="text-[#a1a1a1] text-sm">Total Events</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#1c398e]/20 border-[#1c398e]/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.activeEvents}</p>
                                <p className="text-[#a1a1a1] text-sm">Active Events</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#1c398e]/20 border-[#1c398e]/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.totalTicketsSold}</p>
                                <p className="text-[#a1a1a1] text-sm">Tickets Sold</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#1c398e]/20 border-[#1c398e]/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{Number(platformStats.totalPlatformRevenue).toFixed(2)}</p>
                                <p className="text-[#a1a1a1] text-sm">Platform Revenue ({price})</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Personal Stats */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                    Your Stats
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <Card key={index} className="bg-[#1c398e]/10 border-[#1c398e]/30 hover:border-[#51a2ff]/50 transition-colors">
                                <CardContent className="py-4 px-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${stat.color} flex items-center justify-center`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-[#a1a1a1] font-medium text-sm mb-1">{stat.label}</p>
                                        <p className="text-[#51a2ff] text-xs font-medium">{stat.change}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Statistics