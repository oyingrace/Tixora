import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Ticket, Loader2, DollarSign, TrendingUp, X } from "lucide-react"
import Image from "next/image"
import { useAccount } from "wagmi"
import { toast } from "react-toastify"
import { Address, formatEther } from "viem"
import { useResaleMarketSetters } from "@/hooks/useResaleMarket"

interface ResaleTicket {
  tokenId: bigint
  ticketId: bigint
  seller: Address
  price: bigint
  active: boolean
  eventName: string
  eventDate: string
  location: string
  image: string
  originalPrice: bigint
}

interface ResaleTicketCardProps {
  ticket: ResaleTicket
  onPurchaseSuccess?: () => void
}

export function ResaleTicketCard({ ticket, onPurchaseSuccess }: ResaleTicketCardProps) {
  const { address, isConnected } = useAccount()
  const [imageError, setImageError] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  
  const {
    buyTicket,
    cancelListing,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useResaleMarketSetters()

  const isOwner = address?.toLowerCase() === ticket.seller.toLowerCase()
  const priceInEther = formatEther(ticket.price)
  const originalPriceInEther = formatEther(ticket.originalPrice)
  const priceMarkup = ((Number(ticket.price) - Number(ticket.originalPrice)) / Number(ticket.originalPrice) * 100).toFixed(1)

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed && (isPurchasing || isCanceling)) {
      if (isPurchasing) {
        toast.success("Ticket purchased successfully!")
      } else {
        toast.success("Listing canceled successfully!")
      }
      setIsPurchasing(false)
      setIsCanceling(false)
      onPurchaseSuccess?.()
    }
  }, [isConfirmed, isPurchasing, isCanceling, onPurchaseSuccess])

  // Handle transaction error
  useEffect(() => {
    if (error) {
      toast.error(`Transaction failed: ${error.message}`)
      setIsPurchasing(false)
      setIsCanceling(false)
    }
  }, [error])

  const handleBuyTicket = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (isOwner) {
      toast.info("You cannot buy your own ticket")
      return
    }

    setIsPurchasing(true)

    try {
      buyTicket(ticket.tokenId, ticket.price)
    } catch (err: any) {
      toast.error(`Failed to purchase: ${err.message}`)
      setIsPurchasing(false)
    }
  }

  const handleCancelListing = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!isOwner) {
      toast.error("You can only cancel your own listings")
      return
    }

    setIsCanceling(true)

    try {
      cancelListing(ticket.tokenId)
    } catch (err: any) {
      toast.error(`Failed to cancel: ${err.message}`)
      setIsCanceling(false)
    }
  }

  return (
    <Card className="group overflow-hidden bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {!imageError ? (
            <Image
              src={ticket.image || "/placeholder-event.jpg"}
              alt={ticket.eventName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Ticket className="w-16 h-16 text-white/50" />
            </div>
          )}
          
          {/* Price Markup Badge */}
          {Number(priceMarkup) > 0 && (
            <Badge className="absolute top-3 right-3 bg-green-500 text-white flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{priceMarkup}%
            </Badge>
          )}
          {Number(priceMarkup) < 0 && (
            <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
              {priceMarkup}%
            </Badge>
          )}
          
          {/* Owner Badge */}
          {isOwner && (
            <Badge className="absolute top-3 left-3 bg-purple-500 text-white">
              Your Listing
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {ticket.eventName}
            </h3>
            <div className="flex items-center text-sm text-slate-400 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              {ticket.eventDate}
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <MapPin className="w-4 h-4 mr-1" />
              {ticket.location}
            </div>
          </div>

          {/* Price Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Resale Price</span>
              <span className="text-xl font-bold text-purple-400 flex items-center">
                <DollarSign className="w-5 h-5" />
                {priceInEther} CELO
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Original Price</span>
              <span className="text-slate-500">{originalPriceInEther} CELO</span>
            </div>
          </div>

          {/* Seller Information */}
          <div className="text-xs text-slate-500 truncate">
            Seller: {ticket.seller.slice(0, 6)}...{ticket.seller.slice(-4)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isOwner ? (
              <Button
                onClick={handleCancelListing}
                disabled={isPending || isConfirming || isCanceling}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {(isPending || isConfirming) && isCanceling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Listing
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleBuyTicket}
                disabled={isPending || isConfirming || isPurchasing || !ticket.active}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {(isPending || isConfirming) && isPurchasing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isPending ? "Confirming..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4 mr-2" />
                    Buy Ticket
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
