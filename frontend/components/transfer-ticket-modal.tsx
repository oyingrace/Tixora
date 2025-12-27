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
import { Loader2, Send, AlertCircle } from "lucide-react"
import { useTicketNFTSetters } from "@/hooks/useTicketNft"
import { toast } from "react-toastify"
import { Address, isAddress } from "viem"
import { useConnection } from "wagmi"

interface TransferTicketModalProps {
  isOpen: boolean
  onClose: () => void
  tokenId: bigint
  eventName: string
  isActive: boolean
  onTransferSuccess?: () => void
}

export function TransferTicketModal({
  isOpen,
  onClose,
  tokenId,
  eventName,
  isActive,
  onTransferSuccess
}: TransferTicketModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [addressError, setAddressError] = useState("")
  
  const { address: userAddress } = useConnection()
  
  const {
    safeTransferFrom,
    isPending,
    isConfirming,
    isConfirmed,
    error
  } = useTicketNFTSetters()

  // Validate address as user types
  useEffect(() => {
    if (recipientAddress) {
      if (!isAddress(recipientAddress)) {
        setAddressError("Invalid Ethereum address")
      } else if (recipientAddress.toLowerCase() === userAddress?.toLowerCase()) {
        setAddressError("Cannot transfer to yourself")
      } else {
        setAddressError("")
      }
    } else {
      setAddressError("")
    }
  }, [recipientAddress, userAddress])

  // Handle transfer success
  useEffect(() => {
    if (isConfirmed && isTransferring) {
      toast.success("Ticket transferred successfully!")
      setIsTransferring(false)
      setRecipientAddress("")
      onTransferSuccess?.()
      onClose()
    }
  }, [isConfirmed, isTransferring, onTransferSuccess, onClose])

  // Handle transfer error
  useEffect(() => {
    if (error) {
      console.error("Transfer error details:", error)
      toast.error(`Transfer failed: ${error.message}`)
      setIsTransferring(false)
    }
  }, [error])

  const handleTransfer = () => {
    if (!isActive) {
      toast.error("Cannot transfer an inactive or expired ticket")
      return
    }

    if (!recipientAddress || addressError) {
      toast.error("Please enter a valid recipient address")
      return
    }

    if (!userAddress) {
      toast.error("Wallet not connected")
      return
    }

    try {
      setIsTransferring(true)
      safeTransferFrom(userAddress as Address, recipientAddress as Address, tokenId)
    } catch (err: any) {
      console.error("Transfer error:", err)
      toast.error(`Transfer failed: ${err.message}`)
      setIsTransferring(false)
    }
  }

  const handleClose = () => {
    if (!isPending && !isConfirming) {
      setRecipientAddress("")
      setAddressError("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Transfer Ticket</DialogTitle>
          <DialogDescription className="text-slate-400">
            {isActive 
              ? `Transfer your ticket for ${eventName} to another address`
              : `This ticket for ${eventName} is no longer active and cannot be transferred.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Warning Message */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-xs text-yellow-400">
                This action is permanent. Make sure you trust the recipient and have verified their address.
              </p>
            </div>
          </div>

          {/* Recipient Address Input */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-white">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 ${
                addressError ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              disabled={isPending || isConfirming}
            />
            {addressError && (
              <p className="text-xs text-red-400">{addressError}</p>
            )}
          </div>

          {/* Info Box */}toString
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Event</span>
                <span className="text-white font-medium">{eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Token ID</span>
                <span className="text-white font-mono">#{String(tokenId)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPending || isConfirming}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!isActive || isPending || isConfirming || !recipientAddress || !!addressError}
            className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:pointer-events-none"
            title={!isActive ? "This ticket is no longer active and cannot be transferred" : undefined}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Confirming..." : "Transferring..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Transfer Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
