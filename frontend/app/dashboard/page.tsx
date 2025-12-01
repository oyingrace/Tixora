"use client"

import { useConnection } from "wagmi"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ShoppingBag, TicketIcon, Activity } from "lucide-react"
import Link from "next/link"
import { useMemo, useEffect } from "react"
import { Address, formatEther } from "viem"
import { ChainId, eventTicketingAbi, getContractAddresses } from "@/lib/addressAndAbi"
import { useReadContract } from "wagmi"
import Statistics from "@/components/Statistics"

export default function Dashboard() {
  const { address, isConnected, chain } = useConnection()
  const router = useRouter()

  const chainId = chain?.id || ChainId.CELO_SEPOLIA;
  const { eventTicketing } = getContractAddresses(chainId)

  // Get recent tickets data
  const { data: recentTicketsData } = useReadContract({
    address: eventTicketing as Address,
    abi: eventTicketingAbi,
    functionName: 'getRecentTickets',
  })

  // Generate recent activity from tickets data
  const recentActivity = useMemo(() => {
    if (!recentTicketsData || !address) return []
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tickets = recentTicketsData as any[]

    const price = chainId === ChainId.BASE || chainId === ChainId.BASE_SEPOLIA ? "BASE" : "CELO"
    
    return tickets
      .filter(ticket => ticket.creator.toLowerCase() === address.toLowerCase())
      .sort((a, b) => Number(b.eventTimestamp) - Number(a.eventTimestamp)) // Sort by timestamp in descending order
      .slice(0, 5)
      .map((ticket) => ({
        id: Number(ticket.id),
        action: ticket.canceled ? `Canceled ${ticket.eventName}` : `Created ${ticket.eventName}`,
        timestamp: Number(ticket.eventTimestamp), // Keep timestamp for reference
        time: new Date(Number(ticket.eventTimestamp) * 1000).toLocaleDateString(),
        amount: `${formatEther(ticket.price)} ${price}`,
        type: ticket.canceled ? "cancel" : "create",
        status: ticket.closed ? "Closed" : ticket.canceled ? "Canceled" : "Active",
        sold: Number(ticket.sold),
        maxSupply: Number(ticket.maxSupply)
      }))
  }, [recentTicketsData, address, chainId])

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  const quickActions = [
    {
      title: "Marketplace",
      description: "Browse and purchase event tickets",
      icon: ShoppingBag,
      href: "/marketplace",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      title: "My Tickets",
      description: "View and manage your NFT tickets",
      icon: TicketIcon,
      href: "/tickets",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Create Event",
      description: "Launch your own ticketed event",
      icon: Plus,
      href: "/create-event",
      gradient: "from-purple-600 to-pink-500",
    },
  ]

  if (!isConnected) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 text-foreground pt-12 px-4 md:px-8 lg:px-20">
      <div className="pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-10 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Welcome back, {" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {shortAddress}
              </span>
            </h1>
            <p className="text-slate-300 text-base">Manage your events and tickets on the decentralized web</p>
          </div>

          <Statistics />

          {/* Quick Action Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-slate-200">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-8 px-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <Card className="group cursor-pointer bg-slate-800/50 border-slate-700/50 overflow-hidden relative hover:border-slate-600/60 transition-all duration-300">
                      <div className={`absolute inset-0 bg-linear-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <CardContent className="p-6 text-center relative z-10">
                        <div
                          className={`w-15 h-15 rounded-full bg-linear-to-br ${action.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{action.title}</h3>
                        <p className="text-slate-300 text-sm">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="px-6">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white text-xl">
                  <Activity className="h-6 w-6 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between py-4 px-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.type === 'cancel' ? 'bg-red-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="text-white font-medium text-md">{activity.action}</p>
                            <p className="text-slate-400 text-sm">{activity.time}</p>
                            <p className="text-slate-500 text-xs">
                              {activity.sold}/{activity.maxSupply} tickets sold
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant="outline"
                            className={`border-purple-500/50 px-2 py-1 text-xs ${
                              activity.status === 'Active' 
                                ? 'text-green-300 bg-green-500/10 border-green-500/50'
                                : activity.status === 'Canceled'
                                ? 'text-red-300 bg-red-500/10 border-red-500/50'
                                : 'text-gray-300 bg-gray-500/10 border-gray-500/50'
                            }`}
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-purple-300 font-mono text-xs">
                            {activity.amount}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No recent activity. Create your first event to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}