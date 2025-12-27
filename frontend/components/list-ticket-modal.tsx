import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, DollarSign } from "lucide-react"
import { useResaleMarketSetters } from "@/hooks/useResaleMarket"
import { toast } from "react-toastify"
import { parseEther, formatEther } from "viem"

interface ListTicketModalProps {
  isOpen: boolean
  onClose: () => void
  tokenId: bigint
  eventName: string
  originalPrice?: bigint
  onListSuccess?: () => void
}

export function ListTicketModal({
  isOpen,
  onClose,
  tokenId,
  eventName,
  originalPrice,
  onListSuccess
}: ListTicketModalProps) {
  const [priceInput, setPriceInput] = useState("")
  const [isListing, setIsListing] = useState(false)
  
  // Resale market hooks
  const {
    listTicket,
    isPending: isListPending,
    isConfirming: isListConfirming,
    isConfirmed: isListConfirmed,
    error: listError
  } = useResaleMarketSetters()

  // Handle undefined originalPrice by defaulting to 0
  const safeOriginalPrice = originalPrice || BigInt(0)
  const originalPriceInEther = formatEther(safeOriginalPrice)

  // Handle listing success
  useEffect(() => {
    if (isListConfirmed && isListing) {
      toast.success("Ticket listed successfully!")
      setIsListing(false)
      setPriceInput("")
      onListSuccess?.()
      onClose()
    }
  }, [isListConfirmed, isListing, onListSuccess, onClose])

  // Handle listing error
  useEffect(() => {
    if (listError) {
      toast.error(`Failed to list ticket: ${listError.message}`)
      setIsListing(false)
    }
  }, [listError])

  const handleListTicket = async () => {
    if (!priceInput || parseFloat(priceInput) <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    try {
      const priceInWei = parseEther(priceInput)
      setIsListing(true)
      listTicket(tokenId, priceInWei)
    } catch (err: any) {
      toast.error(`Invalid price: ${err.message}`)
      setIsListing(false)
    }
  }

  const handleClose = () => {
    const isProcessing = isListPending || isListConfirming
    if (!isProcessing) {
      setPriceInput("")
      onClose()
    }
  }

  const calculateMarkup = () => {
    if (!priceInput || parseFloat(priceInput) <= 0) return null
    const markup = ((parseFloat(priceInput) - parseFloat(originalPriceInEther)) / parseFloat(originalPriceInEther) * 100).toFixed(1)
    return markup
  }

  const markup = calculateMarkup()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">List Ticket for Resale</DialogTitle>
          <DialogDescription className="text-slate-400">
            Set your price for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Original Price Info */}
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Original Price</span>
              <span className="text-lg font-semibold text-white">
                {originalPriceInEther} CELO
              </span>
            </div>
          </div>

          {/* Price Input */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">
              Resale Price (CELO)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price in CELO"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                disabled={isListPending || isListConfirming}
              />
            </div>
            
            {/* Price Markup Indicator */}
            {markup !== null && (
              <div className="text-sm">
                {Number(markup) > 0 ? (
                  <span className="text-green-400">
                    +{markup}% above original price
                  </span>
                ) : Number(markup) < 0 ? (
                  <span className="text-blue-400">
                    {markup}% below original price
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Same as original price
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isListPending || isListConfirming}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleListTicket}
            disabled={isListPending || isListConfirming || !priceInput || parseFloat(priceInput) <= 0}
            className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isListPending || isListConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isListPending ? "Confirming..." : "Listing..."}
              </>
            ) : (
              "List Ticket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
