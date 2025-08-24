import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Ticket, Loader2 } from "lucide-react"
import Image from "next/image"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { eventTicketingAbi, eventTicketingAddress } from "@/lib/addressAndAbi"
import { useEventRegistration } from "@/hooks/use-event-registration"
import { useAccount } from "wagmi"
import { toast } from "react-toastify"

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

interface EventCardProps {
  event: MarketplaceEvent
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()
  const { writeContract, isPending, data: hash } = useWriteContract()
  const [purchasing, setPurchasing] = useState(false)
  const { address, isConnected } = useAccount()
  
  const { isRegistered, isLoading: checkingRegistration } = useEventRegistration(event.id, address)
  
  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const getStatusBadge = (event: MarketplaceEvent) => {
    if (event.status === "passed") {
      return <Badge className="bg-gray-500 text-white">Passed</Badge>
    }
    if (event.status === "canceled") {
      return <Badge className="bg-red-500 text-white">Canceled</Badge>
    }
    if (event.status === "closed" || event.status === "sold_out") {
      return <Badge className="bg-orange-500 text-white">Sold Out</Badge>
    }
    return <Badge className="bg-purple-500 text-white">{event.ticketsLeft} left</Badge>
  }

  const handlePurchaseTicket = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (event.ticketsLeft === 0) {
      toast.error("Sorry, this event is sold out!")
      return
    }

    if (isRegistered) {
      toast.info("You are already registered for this event!")
      return
    }

    setPurchasing(true)

    try {
      // Show transaction prompt
      // const confirmed = window.confirm(
      //   `Purchase ticket for "${event.eventTitle}"?\n\nPrice: ${event.price}\nGas fee: ~0.002 CELO\n\nClick OK to approve the transaction in your wallet.`,
      // )

      const confirmed = true
      toast.info(`Purchasing ticket for \"${event.eventTitle}\", click Confirm in your wallet to approve the transaction...`)

      if (!confirmed) {
        setPurchasing(false)
        return
      }

      // Call the smart contract to register for the event
      writeContract({
        address: eventTicketingAddress,
        abi: eventTicketingAbi,
        functionName: 'register',
        args: [BigInt(event.id)],
        value: event.originalPrice,
      })

    } catch (error) {
      console.error("Purchase error:", error)
      toast.error("Transaction failed. Please check your wallet and try again.")
      setPurchasing(false)
    }
  }

  // Handle successful transaction
  if (isSuccess) {
    setPurchasing(false)
    // Refresh the page to show updated data
    window.location.reload()
    toast.success("Ticket purchased successfully!")
  }

  const isProcessing = purchasing || isPending || isConfirming

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the button or its children
    if ((e.target as HTMLElement).closest('button, a, [role="button"]')) {
      return;
    }
    router.push(`/marketplace/${event.id}`)
  }

  return (
    <Card 
      onClick={handleCardClick}
      className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-purple-500/50 backdrop-blur-sm transition-colors"
    >
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={event.image || "/tixora-logo.png"}
            alt={event.eventTitle}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-4 left-4 bg-blue-600">{event.category}</Badge>
          <div className="absolute top-4 right-4">{getStatusBadge(event)}</div>
          {event.trending && (
            <Badge className="absolute bottom-4 left-4 bg-orange-500 text-white">🔥 Trending</Badge>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-white">{event.eventTitle}</h3>

          <div className="space-y-2 text-xs text-slate-400 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-purple-400" />
              {event.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-blue-400" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-purple-400" />
              {event.attendees.toLocaleString()} attendees
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {event.price}
            </span>
            {event.status === "upcoming" && event.ticketsLeft > 0 ? (
              checkingRegistration ? (
                <Button className="bg-slate-600 text-slate-300" disabled>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </Button>
              ) : isRegistered ? (
                <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
                  <Ticket className="h-3 w-3" />
                  Already Registered
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={handlePurchaseTicket}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isConfirming ? "Confirming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Ticket className="h-3 w-3" />
                      Buy Now
                    </>
                  )}
                </Button>
              )
            ) : (
              <Button
                className="bg-slate-600 text-slate-300 cursor-not-allowed"
                disabled
              >
                <Ticket className="h-3 w-3" />
                {event.status === "passed" ? "Event Ended" : 
                 event.status === "canceled" ? "Canceled" : 
                 event.status === "closed" || event.status === "sold_out" ? "Sold Out" : "Unavailable"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
