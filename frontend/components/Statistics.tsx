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
  const chainId = chain?.id || ChainId.CELO_SEPOLIA;

    const { data: recentTicketsData } = useGetRecentTickets()

    useEffect(() => {
        if (!recentTicketsData || !address) return
    
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

    const price = chainId === ChainId.BASE || chainId === ChainId.BASE_SEPOLIA ? "BASE" : "CELO"

    const stats = useMemo(() => [
        {
          label: "Events Attended",
          value: userStats.attendedEvents.toString(),
          change: userStats.attendedEvents > 0 ? "Based on ticket ownership" : "Connect to see your events",
          icon: Calendar,
          color: "from-blue-500 to-cyan-500"
        },
        {
          label: "Total Spent",
          value: `${userStats.totalSpent} ${price}`,
          change: userStats.attendedEvents > 0 ? "Estimated spending" : "No purchases yet",
          icon: DollarSign,
          color: "from-green-500 to-emerald-500"
        },
        {
          label: "Events Created",
          value: userStats.createdEvents.toString(),
          change: userStats.createdEvents > 0 ? 
            `${userStats.createdEvents} events launched` : "Create your first event",
          icon: Plus,
          color: "from-purple-500 to-pink-500"
        },
        {
          label: "Revenue Earned",
          value: `${userStats.totalRevenue} ${price}`,
          change: userStats.createdEvents > 0 ? 
            `From ${userStats.createdEvents} events` : "No revenue yet",
          icon: Users,
          color: "from-orange-500 to-red-500"
        },
      ], [userStats, price])

      // Platform stats
        const platformStats = useMemo(() => {
          if (!recentTicketsData) return null
          
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
                    <h2 className="text-2xl font-semibold mb-3 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Platform Overview
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6 px-6">
                        <Card className="bg-linear-to-br from-slate-800/80 to-purple-900/30 border-purple-500/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.totalEvents}</p>
                                <p className="text-slate-300 text-sm">Total Events</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-linear-to-br from-slate-800/80 to-blue-900/30 border-blue-500/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.activeEvents}</p>
                                <p className="text-slate-300 text-sm">Active Events</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-linear-to-br from-slate-800/80 to-green-900/30 border-green-500/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{platformStats.totalTicketsSold}</p>
                                <p className="text-slate-300 text-sm">Tickets Sold</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-linear-to-br from-slate-800/80 to-orange-900/30 border-orange-500/30">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-white">{Number(platformStats.totalPlatformRevenue).toFixed(2)}</p>
                                <p className="text-slate-300 text-sm">Platform Revenue ({price})</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Personal Stats */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-3 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Your Stats
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 px-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <Card key={index} className="bg-linear-to-br from-slate-800/80 to-purple-900/30 border-purple-500/30 overflow-hidden relative">
                                <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-10`} />
                                <CardContent className="py-3 px-6 relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <Icon className="h-6 w-6 text-purple-400" />
                                        <div className={`w-3 h-3 rounded-full bg-linear-to-r ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white mb-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-slate-300 font-medium mb-1 text-sm">{stat.label}</p>
                                        <p className="text-green-400 text-sm font-medium">{stat.change}</p>
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