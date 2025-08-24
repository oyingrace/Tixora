"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAccount, useReadContract } from 'wagmi'
import { Search, Filter, TrendingUp, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { eventTicketingAbi, eventTicketingAddress } from "@/lib/addressAndAbi"
import { formatEther } from "viem"
import { EventCard } from "@/components/event-card"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface TicketData {
  id: number
  creator: string
  price: bigint
  eventName: string
  description: string
  eventTimestamp: bigint
  location: string
  closed: boolean
  canceled: boolean
  metadata: string
  maxSupply: bigint
  sold: bigint
  totalCollected: bigint
  totalRefunded: bigint
  proceedsWithdrawn: boolean
}

interface MarketplaceEvent {
  id: number
  eventTitle: string
  price: string
  date: string
  location: string
  image: string
  attendees: number
  ticketsLeft: number
  status: string
  category: string
  trending: boolean
  createdAt: string
  originalPrice: bigint
}

export default function Marketplace() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("trending")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState<MarketplaceEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Read contract data
  const { data: totalTickets } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getTotalTickets',
  })

  const { data: recentTickets } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'getRecentTickets',
  })



  // Transform blockchain data to marketplace format
  useEffect(() => {
    if (recentTickets && Array.isArray(recentTickets)) {
      const transformedEvents: MarketplaceEvent[] = recentTickets.map((ticket: TicketData, index: number) => {
        const eventDate = new Date(Number(ticket.eventTimestamp) * 1000)
        const now = new Date()
        const isUpcoming = eventDate > now
        const isPassed = eventDate < now
        const isCanceled = ticket.canceled
        const isClosed = ticket.closed
        const ticketsLeft = Number(ticket.maxSupply - ticket.sold)
        
        let status = "upcoming"
        if (isCanceled) status = "canceled"
        else if (isClosed) status = "closed"
        else if (isPassed) status = "passed"
        else if (ticketsLeft === 0) status = "sold_out"

        // Parse metadata for additional info
        let category = "Event"
        let image = "/placeholder.svg"
        try {
          if (ticket.metadata) {
            const metadata = JSON.parse(ticket.metadata)
            category = metadata.category || "Event"
            image = metadata.image || "/placeholder.svg"
          }
        } catch (e) {
          console.log("Could not parse metadata")
        }

        return {
          id: Number(ticket.id),
          eventTitle: ticket.eventName,
          price: `${formatEther(ticket.price)} CELO`,
          date: eventDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          location: ticket.location,
          image: image,
          attendees: Number(ticket.maxSupply),
          ticketsLeft: ticketsLeft,
          status: status,
          category: category,
          trending: ticket.sold > (ticket.maxSupply * BigInt(7)) / BigInt(10), // Trending if 70% sold
          createdAt: eventDate.toISOString(),
          originalPrice: ticket.price,
        }
      })

      setEvents(transformedEvents)
      setLoading(false)
    }
  }, [recentTickets])



  // Redirect to landing page if wallet is not connected
  if (!isConnected) {
    router.push("/")
  }

  const getEventsByTab = () => {
    let filteredEvents = events

    switch (activeTab) {
      case "upcoming":
        filteredEvents = events.filter(event => event.status === "upcoming")
        break
      case "passed":
        filteredEvents = events.filter(event => event.status === "passed")
        break
      case "canceled":
        filteredEvents = events.filter(event => event.status === "canceled")
        break
      case "closed":
        filteredEvents = events.filter(event => event.status === "closed" || event.status === "sold_out")
        break
      default:
        filteredEvents = events.filter(event => event.status === "upcoming")
    }

    // Apply search filter
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    if (sortBy === "recent") {
      filteredEvents = [...filteredEvents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "trending") {
      filteredEvents = [...filteredEvents].sort((a, b) => (a.trending ? 1 : 0) - (b.trending ? 1 : 0))
    }

    return filteredEvents
  }



  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
  //       <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
  //         <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-slate-300">Loading events from blockchain...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground">
      <div className="pb-16 px-4 pt-12">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              Event{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Discover amazing events and secure your NFT tickets on the blockchain. All transactions are verified and
              fraud-proof.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white text-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "trending" ? "default" : "outline"}
                onClick={() => setSortBy("trending")}
                className={`h-10 text-sm
                  ${sortBy === "trending"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                <TrendingUp className="w-4 h-4 mr-0" />
                Trending
              </Button>
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                onClick={() => setSortBy("recent")}
                className={`h-10 text-sm
                  ${sortBy === "recent"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                <Clock className="w-4 h-4 mr-0" />
                Recent
              </Button>
              <Button
                variant={sortBy === "all" ? "default" : "outline"}
                onClick={() => setSortBy("all")}
                className={`h-10 text-sm 
                  ${sortBy === "all"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                <Filter className="w-4 h-4 mr-0" />
                All Events
              </Button>
            </div>
          </div>

          {/* Event Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-700">
              <Button
                variant={activeTab === "upcoming" ? "default" : "ghost"}
                onClick={() => setActiveTab("upcoming")}
                className={`h-10 text-sm
                  ${activeTab === "upcoming"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                Upcoming Events
              </Button>
              <Button
                variant={activeTab === "passed" ? "default" : "ghost"}
                onClick={() => setActiveTab("passed")}
                className={`h-10 text-sm
                  ${activeTab === "passed"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                Passed
              </Button>
              <Button
                variant={activeTab === "canceled" ? "default" : "ghost"}
                onClick={() => setActiveTab("canceled")}
                className={`h-10 text-sm
                  ${activeTab === "canceled"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                Canceled
              </Button>
              <Button
                variant={activeTab === "closed" ? "default" : "ghost"}
                onClick={() => setActiveTab("closed")}
                className={`h-10 text-sm
                  ${activeTab === "closed"
                    ? "bg-slate-600 hover:bg-slate-700"
                    : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                `}
              >
                Closed
              </Button>
            </div>
          </div>

          {/* Events Grid */}

          {loading ? (
              <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Loading events from blockchain...</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getEventsByTab().map((event, index) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {getEventsByTab().length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? `No events match "${searchTerm}"` : `No ${activeTab} events available`}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Empty State */}
          {getEventsByTab().length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ? `No events match "${searchTerm}"` : `No ${activeTab} events available`}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {totalTickets ? Number(totalTickets) : 0}
              </div>
              <div className="text-sm text-slate-400">Total Events Created</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {events.filter(e => e.status === "upcoming").length}
              </div>
              <div className="text-sm text-slate-400">Active Events</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {events.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()}+
              </div>
              <div className="text-sm text-slate-400">Total Capacity</div>
            </Card>
            <Card className="text-center p-6 bg-slate-800/50 border-slate-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Zero
              </div>
              <div className="text-sm text-slate-400">Fraud Cases</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}