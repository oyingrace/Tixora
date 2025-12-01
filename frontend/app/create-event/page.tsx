"use client"

import { useState, useEffect } from "react"
import { useConnection } from 'wagmi'
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { Calendar, MapPin, Users, DollarSign, Sparkles, ArrowLeft, Clock, FileText, Coins } from "lucide-react"
import Link from "next/link"
import { useEventTicketingSetters } from '../../hooks/useEventTicketing'

export default function CreateEvent() {
  const { address, isConnected } = useConnection()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalSupply: "",
    // bannerImage: null as File | null, // Temporarily disabled as per issue #63
  })
  const { createTicket, hash, error, isPending, isConfirming, isConfirmed } = useEventTicketingSetters()

  useEffect(() => {
    if (isPending) {
      toast.info("Creating event on blockchain...")
    }
  }, [isPending]) 

  useEffect(() => {
    if (isConfirming) {
      toast.info("Transaction is being processed...")
    }
  }, [isConfirming])

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Event created successfully on blockchain!")
      router.push("/marketplace")
    }
  }, [isConfirmed, router])

  useEffect(() => {
    if (error) {
      toast.error("Transaction denied")
    }
  }, [error])

  const createEvent = () => {
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

    // Check if event date is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`)
    if (eventDateTime <= new Date()) {
      toast.error("Event date must be in the future")
      return
    }

    createTicket(
        BigInt(Math.floor(price * 10**18)),
        formData.title,
        formData.description,
        BigInt(eventDateTime.getTime() / 1000),
        BigInt(totalSupply),
        JSON.stringify({
          // bannerImage: formData.bannerImage ? formData.bannerImage.name : "", // Temporarily disabled as per issue #63
          bannerImage: "",
          date: formData.date,
          time: formData.time
        }),
        formData.location
      )
  }

  if (!isConnected) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
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

    // Check if event date is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`)
    if (eventDateTime <= new Date()) {
      toast.error("Event date must be in the future")
      return
    }

    // Create the ticket
    createTicket(
      BigInt(Math.floor(price * 10**18)),
      formData.title,
      formData.description,
      BigInt(Math.floor(eventDateTime.getTime() / 1000)),
      BigInt(totalSupply),
      JSON.stringify({
        bannerImage: "",
        date: formData.date,
        time: formData.time
      }),
      formData.location
    )
  }
  }

  const totalRevenue = formData.price && formData.totalSupply
    ? (Number.parseFloat(formData.price) * Number.parseInt(formData.totalSupply)).toFixed(2)
    : "0"

  const platformFee = formData.price && formData.totalSupply
    ? (Number.parseFloat(totalRevenue) * 0.025).toFixed(2) // 2.5% platform fee
    : "0"

  const yourEarnings = formData.price && formData.totalSupply
    ? (Number.parseFloat(totalRevenue) - Number.parseFloat(platformFee)).toFixed(2)
    : "0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900">
      <div className="pb-8 sm:pb-16 px-3 sm:px-4 pt-6 sm:pt-8">
        <div className="container mx-auto max-w-6xl px-2 sm:px-4">
          {/* Header with back button */}
          <div className="mb-8 sm:mb-12">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
              style={{ minHeight: '44px' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Create Your Event
                </h1>
                <p className="text-slate-300 text-sm sm:text-base mt-1 sm:mt-2">Launch your next amazing event on the blockchain</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - Event Details */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Basic Information */}
                <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/20 border-purple-500/30 shadow-2xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-xl sm:text-2xl">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-purple-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Sparkles className="h-4 w-4 flex-shrink-0" />
                        Event Title *
                      </Label>
                      <div className="relative">
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Web3 Innovation Summit 2024"
                          required
                          className="w-full bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 h-12 text-base sm:text-lg"
                          style={{ paddingRight: '2.5rem' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-purple-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        Description *
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Join us for an incredible journey into the future of Web3 technology. Connect with industry leaders, discover innovative projects, and shape the decentralized future..."
                          rows={8}
                          required
                          className="w-full bg-slate-800/80 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 text-sm sm:text-base resize-none min-h-[12rem] sm:min-h-[16rem]"
                        />
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm">Tell people what makes your event special</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Details */}
                <Card className="bg-gradient-to-br from-slate-800/90 to-blue-900/20 border-blue-500/30 shadow-2xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-xl sm:text-2xl">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                      Event Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-blue-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          Date *
                        </Label>
                        <div className="relative">
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="w-full bg-slate-800/80 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400/20 h-12 [&::-webkit-calendar-picker-indicator]:invert"
                            style={{ paddingRight: '1rem' }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-blue-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          Time *
                        </Label>
                        <div className="relative">
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                            className="w-full bg-slate-800/80 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400/20 h-12"
                            style={{ paddingRight: '1rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-blue-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        Location *
                      </Label>
                      <div className="relative">
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Convention Center, Miami Beach, FL"
                          required
                          className="w-full bg-slate-800/80 border-blue-500/30 text-white focus:border-blue-400 focus:ring-blue-400/20 h-12 text-base sm:text-lg"
                          style={{ paddingRight: '2.5rem' }}
                        />
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm">Where will your event take place?</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Ticket Configuration & Summary */}
              <div className="space-y-8">
                {/* Ticket Configuration */}
                <Card className="bg-gradient-to-br from-slate-800/90 to-green-900/20 border-green-500/30 shadow-2xl">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-xl sm:text-2xl">
                      <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-green-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        Price per Ticket *
                      </Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="25.00"
                          required
                          className="w-full bg-slate-800/80 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20 h-12 text-base sm:text-lg pl-8"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm">Price per ticket in ETH</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalSupply" className="text-green-200 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        Number of Tickets *
                      </Label>
                      <div className="relative">
                        <Input
                          id="totalSupply"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={formData.totalSupply}
                          onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                          placeholder="100"
                          required
                          className="w-full bg-slate-800/80 border-green-500/30 text-white focus:border-green-400 focus:ring-green-400/20 h-12 text-base sm:text-lg"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                        />
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm">Maximum number of tickets available</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Summary */}
                <Card className="bg-linear-to-br from-slate-800/90 to-yellow-900/20 border-yellow-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white text-2xl">
                      <DollarSign className="h-6 w-6 text-yellow-400" />
                      Revenue Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-green-500/20">
                      <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                        <span className="text-slate-300">Total Revenue</span>
                        <span className="text-green-400 font-medium">${totalRevenue}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm text-slate-400">
                        <span>Platform Fee (2.5%)</span>
                        <span>${platformFee}</span>
                      </div>
                      <div className="border-t border-green-500/20 my-2"></div>
                      <div className="flex justify-between items-center font-medium text-sm sm:text-base">
                        <span className="text-green-200">Your Earnings</span>
                        <span className="text-lg sm:text-xl text-green-400">${yourEarnings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Create Button */}
                <Card className="bg-linear-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 shadow-2xl">
                  <CardContent className="p-6">
                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-[1.02] active:scale-95"
                      disabled={isPending || isConfirming}
                      style={{ minHeight: '56px' }}
                    >
                      {isPending || isConfirming ? (
                        <span className="flex items-center gap-2 text-sm sm:text-base">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isPending ? 'Creating...' : 'Confirming...'}
                        </span>
                      ) : (
                        <span className="px-2">Create Event & Mint Tickets</span>
                      )}
                    </Button>
                    <p className="text-slate-400 text-xs sm:text-sm text-center mt-3">
                      Your event will be deployed to the blockchain
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}