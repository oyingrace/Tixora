"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { eventTicketingAbi, eventTicketingAddress } from "@/lib/addressAndAbi"
import { Abi, formatEther, parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Ticket, Loader2, ArrowLeft, Shield } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"
import { useEventRegistration } from "@/hooks/use-event-registration"

interface EventData {
  id: number
  creator: string
  price: string
  eventName: string
  description: string
  date: string
  location: string
  closed: boolean
  canceled: boolean
  status: 'upcoming' | 'canceled' | 'closed' | 'passed' | 'sold_out' | 'active' | 'registered'
  image: string
  maxSupply: number
  sold: number
  ticketsLeft: number
  eventTimestamp?: number
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, address } = useAccount()
  const [isLoading, setIsLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const { writeContract, isPending, data: hash } = useWriteContract()
  const [events, setEvents] = useState<EventData | null>(null)

  const { isRegistered, isLoading: checkingRegistration } = useEventRegistration(events?.id || 0, address)

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash, 
  })

  // Fetch event data
  const { data: eventData, error: contractError } = useReadContract({
    address: eventTicketingAddress,
    abi: eventTicketingAbi,
    functionName: 'tickets',
    args: [BigInt(params.id as string || '0')],
    query: {
      enabled: !!params.id,
    },
  })



  useEffect(() => {
    if (!isConnected) {
      router.push("/")
      return
    }

    const processEventData = async () => {
      console.log('Raw eventData:', eventData)  
      console.log('Type of eventData:', typeof eventData)  
      
      if (!eventData) {
        console.log('No event data received from contract')
        return
      }
      
      try {
        // Check if eventData is an object with the expected properties
        if (typeof eventData === 'object' && eventData !== null) {
          const [
            id,
            creator,
            price,
            eventName,
            description,
            eventTimestamp,
            location,
            closed,
            canceled,
            metadata,
            maxSupply,
            sold,
            totalCollected,
            proceedsWithdrawn
          ] = eventData as any  

          console.log('Parsed event data:', {
            id,
            creator,
            eventName,
            eventTimestamp: Number(eventTimestamp),
            location,
            closed,
            canceled,
            maxSupply: Number(maxSupply),
            sold: Number(sold)
          })

          if (!eventName) {
            throw new Error('Event data is incomplete or invalid')
          }

          // Convert timestamp to milliseconds and create Date object
          const timestampMs = Number(eventTimestamp) * 1000
          const eventDate = new Date(timestampMs)
          const now = new Date()
          
          // Calculate status conditions
          const isPassed = eventDate < now
          const ticketsLeft = Number(maxSupply) - Number(sold)
          
          // Format the date for display
          let formattedDate = 'Date not available'
          try {
            if (!isNaN(eventDate.getTime())) {
              formattedDate = format(eventDate, 'PPPppp')
            }
          } catch (err) {
            console.log('Error formatting date:', err)
          }

          // Debug logs
          console.log('Event Status Debug:', {
            currentTime: now.toISOString(),
            eventTime: eventDate.toISOString(),
            timestamp: timestampMs,
            isPassed,
            closed,
            canceled,
            ticketsLeft,
            maxSupply: Number(maxSupply),
            sold: Number(sold)
          })

          // Determine status
          let status: EventData['status'] = 'upcoming'
          if (canceled) status = 'canceled'
          else if (closed) status = 'closed'
          else if (isPassed) status = 'passed'
          else if (ticketsLeft === 0) status = 'sold_out'
          else status = 'active'

          console.log('Final Status:', status)

          setEvents({
            id: id,
            creator,
            price: formatEther(price),
            eventName,
            description,
            date: formattedDate,
            location,
            closed,
            canceled,
            status,
            image: "/metaverse-fashion-show.png",
            maxSupply: Number(maxSupply),
            sold: Number(sold),
            ticketsLeft,
            eventTimestamp: Number(eventTimestamp)
          })
        } else {
          console.error('Invalid event data structure:', eventData)
        }
      } catch (err) {
        console.error("Error parsing event data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    processEventData()
  }, [eventData, isConnected, router, params.id])

  if (!isConnected) {
    return null // Redirecting, no need to render anything
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-purple-500/30 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading event details...</p>
        </div>
      </div>
    )
  }

  const handleBuyTicket = async () => {
    if (!events) {
      toast.error("Event data not available")
      return
    }

    setPurchasing(true)

    try {
      const confirmed = true
      toast.info(`Purchasing ticket for "${events.eventName}", click Confirm in your wallet to approve the transaction...`)

      if (!confirmed) {
        setPurchasing(false)
        return
      }

      // Convert price from ETH to Wei for the contract call
      const priceInWei = parseEther(events.price)
      
      writeContract({
        address: eventTicketingAddress as `0x${string}`,
        abi: eventTicketingAbi as Abi,
        functionName: 'register',
        args: [BigInt(events.id)],
        value: priceInWei,
      })
    } catch (error) {
      console.error("Purchase error:", error)
      toast.error("Transaction failed. Please check your wallet and try again.")
      setPurchasing(false)
    }
  }

  if (isSuccess) {
    setPurchasing(false)
    // Refresh the page to show updated data
    window.location.reload()
    toast.success("Ticket purchased successfully!")
  }

  const isProcessing = purchasing || isPending || isConfirming

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => router.back()}
          variant="ghost" 
          className="mb-6 text-slate-300 hover:bg-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Image
                src={events?.image || '/metaverse-fashion-show.png'}
                alt={events?.eventName || 'Event Image'}
                width={800}
                height={450}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              {/* Status Badge */}
              {events?.status === 'canceled' && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  Canceled
                </Badge>
              )}
              {events?.status === 'closed' && (
                <Badge variant="secondary" className="absolute top-4 left-4">
                  Closed
                </Badge>
              )}
              {events?.status === 'sold_out' && (
                <Badge variant="secondary" className="absolute top-4 left-4">
                  Sold Out
                </Badge>
              )}
              {events?.status === 'passed' && (
                <Badge variant="outline" className="absolute top-4 left-4">
                  Event Ended
                </Badge>
              )}
              {events?.status === 'active' && events?.ticketsLeft > 0 && (
                <Badge variant="secondary" className="absolute top-4 left-4">
                  {events?.ticketsLeft} {events?.ticketsLeft === 1 ? 'ticket' : 'tickets'} left
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{events?.eventName}</h1>

              <div className="flex flex-wrap gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{events?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{events?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{events?.sold} attending</span>
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">About this event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{events?.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Event Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {events?.creator?.slice(0, 3) || '??'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Event Creator</p>
                      <p className="text-sm text-slate-400 font-mono">
                        {events?.creator || 'Unknown creator'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ticket Purchase */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-300">Price per ticket</p>
                      <p className="text-2xl font-bold text-white">{events?.price} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-300">Available</p>
                      <p className="text-white font-medium">{events?.ticketsLeft} / {events?.maxSupply}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <Button 
                      onClick={handleBuyTicket}
                      className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base"
                      disabled={events?.status === 'canceled' || events?.status === 'closed' || events?.ticketsLeft === 0 || events?.status === 'passed' || events?.status === 'registered' || isProcessing }
                    >
                      {events?.status === 'canceled' ? 'Event Canceled' : 
                       events?.status === 'closed' ? 'Sales Ended' :
                       events?.status === 'sold_out' ? 'Sold Out' : 
                       events?.status === 'passed' ? 'Event Ended' : 
                       events?.status === 'registered' ? 'Registered' :
                       events?.status === 'active' ? 'Buy Ticket' : 'Event Canceled'}
                    </Button>
                    
                    {events?.ticketsLeft && events.ticketsLeft < 10 && (
                      <p className="mt-2 text-sm text-amber-400 text-center">
                        Only {events.ticketsLeft} {events.ticketsLeft === 1 ? 'ticket' : 'tickets'} left!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Event ID</p>
                  <p className="text-white">{events?.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Contract Address</p>
                  <p className="text-white font-mono text-sm">{eventTicketingAddress}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
