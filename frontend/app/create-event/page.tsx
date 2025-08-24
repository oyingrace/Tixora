"use client"

import { useState, useEffect } from "react"
import { useAccount } from 'wagmi'
import { useRouter } from "next/navigation"
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import Image from "next/image"
import Link from "next/link"
import { Upload } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { eventTicketingAddress, eventTicketingAbi } from "@/lib/addressAndAbi"

export default function CreateEvent() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalSupply: "",
    bannerImage: null as File | null,
  })

  const { writeContract, data: hash, isPending: isSubmitting, error: writeError } = useWriteContract()

  const { isLoading: isTransactionPending, isSuccess: isTransactionSuccess, error: transactionError } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSubmitting) {
      toast.info("Creating event on blockchain...")
    }
  }, [isSubmitting]) 

  useEffect(() => {
    if (isTransactionPending) {
      toast.info("Transaction is being processed...")
    }
  }, [isTransactionPending])

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("🎉 Event created successfully on blockchain!")
      router.push("/marketplace")
      toast.success(`Ticket hash is: ${hash}`)
    }
  }, [isTransactionSuccess, router])

  useEffect(() => {
    if (writeError) {
      toast.error(`Transaction denied`)
    }
  }, [writeError])

  useEffect(() => {
    if (transactionError) {
      toast.error(`Transaction failed: ${transactionError.message}`)
    }
  }, [transactionError])

  const createTicket = () => {
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.price || !formData.totalSupply) {
      toast.error("Please fill in all required fields")
      return
    }

    const price = parseFloat(formData.price)
    const totalSupply = parseInt(formData.totalSupply)
    
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price greater than 0")
      return
    }
    
    if (isNaN(totalSupply) || totalSupply <= 0) {
      toast.error("Please enter a valid total supply greater than 0")
      return
    }

    writeContract({
      address: eventTicketingAddress as `0x${string}`,
      abi: eventTicketingAbi,
      functionName: 'createTicket',
      args: [
        BigInt(Math.floor(price * 10**18)), // Convert to wei
        formData.title,
        formData.description,
        BigInt(new Date(`${formData.date}T${formData.time}`).getTime() / 1000), // Convert to Unix timestamp
        BigInt(totalSupply),
        JSON.stringify({ // Metadata as JSON string
          bannerImage: formData.bannerImage ? formData.bannerImage.name : "",
          date: formData.date,
          time: formData.time
        }),
        formData.location
      ],
    })
  }

  if (!isConnected) {
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createTicket()
  }

  const totalRevenue =
    formData.price && formData.totalSupply
      ? (Number.parseFloat(formData.price) * Number.parseInt(formData.totalSupply)).toFixed(2)
      : "0"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pb-16 px-4 pt-12">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text">Create Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Details */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/20 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white gradient-text">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-purple-200">
                      Event Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Amazing Web3 Conference"
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-purple-200">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your event..."
                      rows={8}
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-purple-200">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-purple-200">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-purple-200">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Miami Beach, FL"
                      required
                      className="bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Configuration */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-cyan-900/20 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white gradient-text">Ticket Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price" className="text-cyan-200">
                      Price per Ticket (CELO)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25.00"
                      required
                      className="bg-slate-800/80 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalSupply" className="text-cyan-200">
                      Total Tickets to Mint (Total Supply)
                    </Label>
                    <Input
                      id="totalSupply"
                      type="number"
                      value={formData.totalSupply}
                      onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                      placeholder="1000"
                      required
                      className="bg-slate-800/80 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-white mb-2 gradient-text">Revenue Calculation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-purple-200">
                        <span>Price per ticket:</span>
                        <span>{formData.price || "0"} CELO</span>
                      </div>
                      <div className="flex justify-between text-cyan-200">
                        <span>Total tickets:</span>
                        <span>{formData.totalSupply || "0"}</span>
                      </div>
                      <div className="flex justify-between font-medium text-white border-t border-purple-500/30 pt-2">
                        <span>Total Revenue:</span>
                        <span className="gradient-text text-lg">{totalRevenue} CELO</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="banner" className="text-cyan-200">
                      Banner Image
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-cyan-500/50 rounded-lg p-6 text-center bg-gradient-to-br from-cyan-900/10 to-purple-900/10">
                      <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <p className="text-sm text-cyan-200">Click to upload or drag and drop</p>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/30">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || isTransactionPending}
                  className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                >
                  {isSubmitting || isTransactionPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Event & Minting NFTs...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
