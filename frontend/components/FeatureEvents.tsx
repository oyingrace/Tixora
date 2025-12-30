"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useConnection, useReadContract } from 'wagmi'
import { ChainId, eventTicketingAbi, getContractAddresses } from "@/lib/addressAndAbi"
import { Address, formatEther } from "viem"
import { EventCard } from "@/components/event-card"

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

function FeatureEvents() {
    const router = useRouter();
    const { chain } = useConnection()
    const [events, setEvents] = useState<MarketplaceEvent[]>([])
    const [loading, setLoading] = useState(true)
    const chainId = chain?.id || ChainId.CELO_SEPOLIA;
    const { eventTicketing } = getContractAddresses(chainId)

    // Read recent tickets from the contract
    const { data: recentTickets } = useReadContract({
      address: eventTicketing as Address,
      abi: eventTicketingAbi,
      functionName: 'getRecentTickets',
    })

    // Transform blockchain data into display-ready events
    useEffect(() => {
      if (!recentTickets || !Array.isArray(recentTickets)) {
        setLoading(false)
        return
      }

      const transformed: MarketplaceEvent[] = recentTickets.map((ticket: TicketData) => {
        const eventDate = new Date(Number(ticket.eventTimestamp) * 1000)
        const now = new Date()
        const isPassed = eventDate < now
        const isCanceled = ticket.canceled
        const isClosed = ticket.closed
        const ticketsLeft = Number(ticket.maxSupply - ticket.sold)

        let status = "upcoming"
        if (isCanceled) status = "canceled"
        else if (isClosed) status = "closed"
        else if (isPassed) status = "passed"
        else if (ticketsLeft === 0) status = "sold_out"

        let category = "Event"
        let image = "/placeholder.svg"
        try {
          if (ticket.metadata) {
            const metadata = JSON.parse(ticket.metadata)
            category = metadata.category || "Event"
            image = metadata.image || "/placeholder.svg"
          }
        } catch {
          // ignore metadata parse errors for now
        }

        return {
          id: Number(ticket.id),
          eventTitle: ticket.eventName,
          price: `${formatEther(ticket.price)} ${chainId === ChainId.CELO_SEPOLIA || chainId === ChainId.CELO ? "CELO" : "ETH"}`,
          date: eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          location: ticket.location,
          image,
          attendees: Number(ticket.maxSupply),
          ticketsLeft,
          status,
          category,
          trending: ticket.sold > (ticket.maxSupply * BigInt(7)) / BigInt(10),
          createdAt: eventDate.toISOString(),
          originalPrice: ticket.price,
        }
      })

      setEvents(transformed)
      setLoading(false)
    }, [recentTickets, chainId])

    // Filter to show only upcoming events, sorted by trending first, then take top 4
    const featuredEvents = events
      .filter(event => event.status === "upcoming")
      .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
      .slice(0, 4)

  return (
    <section id="featured-events" className="bg-slate-900/30 px-15 md:px-20 lg:px-24 md:pt-[calc(100vh-42rem)] pt-[calc(100vh-65rem)] pb-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Featured Events
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              Discover amazing events from top organizers around the world
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-4" />
                <p className="text-slate-400">Loading featured events...</p>
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 mb-4">No upcoming events available at the moment.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/marketplace')}
                  className="border-purple-500/50 hover:bg-purple-500/10"
                >
                  Browse All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/marketplace')}
              className="px-8 py-4 text-lg hover:scale-105 transition-all duration-300 border-primary/50 hover:bg-primary/10"
            >
              View All Events <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
  )
}

export default FeatureEvents;