'use client'
import { useState, useEffect, useMemo } from "react"
import { Calendar, QrCode, Send, ExternalLink, Copy, Search, MoreVertical, Download, Eye, RefreshCw, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useAccount, usePublicClient } from 'wagmi'
import { WalletConnectButton } from "@/components/wallet-connect-button"
import Link from "next/link"
import { Abi, Address, formatEther } from 'viem'
import QRCode from 'qrcode';
import { useEventTicketingGetters } from "@/hooks/useEventTicketing"
import { getContractAddresses, ChainId, eventTicketingAbi } from "@/lib/addressAndAbi"
import { useResaleMarketSetters } from "@/hooks/useResaleMarket"
import { ListTicketModal } from "@/components/list-ticket-modal"
import { TransferTicketModal } from "@/components/transfer-ticket-modal"

interface NFTTicketDisplay {
  id: string
  tokenId: bigint
  eventTitle: string
  eventTimestamp: number
  location: string
  status: 'upcoming' | 'past'
  qrCode: string
  price: string
  purchaseDate: string
  txHash: string | null
}

type TicketAction = "view" | "transfer" | "qr" | "resale" | null

export default function TicketsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedTicket, setSelectedTicket] = useState<NFTTicketDisplay | null>(null)
    const [currentAction, setCurrentAction] = useState<TicketAction>(null)
    const [ticketTransactions, setTicketTransactions] = useState<Record<string, string>>({})
  
    const { isConnected, address, chain } = useAccount()
    const publicClient = usePublicClient()
    
    const { useGetRecentTickets } = useEventTicketingGetters()
    const { listTicket, isPending: isListing, isConfirmed: isListingConfirmed } = useResaleMarketSetters()
    
    // Fetch all recent tickets
    const { data: allTickets = [] } = useGetRecentTickets()
    
    // Resolve contract address for current chain
    const { eventTicketing: eventTicketingAddress } = useMemo(() => {
      const chainId = chain?.id || ChainId.CELO_SEPOLIA
      return getContractAddresses(chainId)
    }, [chain])

    // Registration status map for quick lookup
    const [registrationMap, setRegistrationMap] = useState<Record<string, boolean>>({})

    // Fetch registration status for all tickets for the connected user
    useEffect(() => {
      const fetchRegistrationStatuses = async () => {
        if (!publicClient || !address || !allTickets?.length || !eventTicketingAddress) return

        try {
          const results = await Promise.allSettled(
            allTickets.map((t: any) =>
              publicClient.readContract({
                address: eventTicketingAddress as `0x${string}`,
                abi: eventTicketingAbi as unknown as Abi,
                functionName: 'isRegistered',
                args: [BigInt(t.id), address as `0x${string}`],
              })
            )
          )

          const map: Record<string, boolean> = {}
          results.forEach((res, idx) => {
            const id = allTickets[idx].id.toString()
            map[id] = res.status === 'fulfilled' ? Boolean(res.value) : false
          })
          setRegistrationMap(map)
        } catch (e) {
          console.error('Failed to fetch registration statuses', e)
          setRegistrationMap({})
        }
      }

      fetchRegistrationStatuses()
    }, [publicClient, address, allTickets, eventTicketingAddress])
  
    // Filter tickets to only include those registered by the user
    const userTickets = useMemo(() => {
      if (!allTickets) return []

      return allTickets
        .filter((ticket: any) => registrationMap[ticket.id.toString()] === true)
        .map((ticket: any) => {
          const now = Math.floor(Date.now() / 1000)
          const isPast = Number(ticket.eventTimestamp) < now
  
          return {
            id: ticket.id.toString(),
            tokenId: BigInt(ticket.id),
            eventTitle: ticket.eventName,
            eventTimestamp: Number(ticket.eventTimestamp),
            location: ticket.location,
            status: isPast ? "past" as const : "upcoming" as const,
            qrCode: ticket.id.toString(),
            price: formatEther(ticket.price) + " CELO",
            purchaseDate: new Date(Number(ticket.eventTimestamp) * 1000).toISOString(),
            txHash: ticketTransactions[ticket.id.toString()] || null,
          } satisfies NFTTicketDisplay
        })
    }, [allTickets, registrationMap, ticketTransactions])
  
    // Fetch transaction hashes for registered tickets
    useEffect(() => {
      const fetchTransactionHashes = async () => {
        if (!allTickets || !publicClient || !address || !eventTicketingAddress) {
          console.log('Missing dependencies for transaction fetch:', {
            allTickets: !!allTickets,
            publicClient: !!publicClient,
            address: !!address,
            eventTicketingAddress: !!eventTicketingAddress,
          })
          return
        }
  
        const registeredTickets = allTickets.filter((t: any) => registrationMap[t.id.toString()] === true)
  
        console.log('Fetching transactions for registered tickets:', registeredTickets.length)
  
        const txHashes: Record<string, string> = {}
        
        for (const ticket of registeredTickets) {
          try {
            console.log(`Fetching transaction for ticket ${ticket.id}...`)
            
            // Get logs for TicketRegistered event
            // Get logs for Registered event
            const logs = await publicClient.getLogs({
              address: eventTicketingAddress as `0x${string}`,
              event: {
                type: 'event',
                name: 'Registered',
                inputs: [
                  { type: 'uint256', indexed: true, name: 'ticketId' },
                  { type: 'address', indexed: true, name: 'registrant' },
                  { type: 'uint256', indexed: false, name: 'nftTokenId' }
                ]
              },
              args: {
                ticketId: BigInt(ticket.id),
                registrant: address as `0x${string}`
              },
              fromBlock: 'earliest',
              toBlock: 'latest'
            })
            
            console.log(`Found ${logs.length} registration logs for ticket ${ticket.id}`)
            
            if (logs.length > 0) {
              // Get the most recent registration
              const latestLog = logs[logs.length - 1]
              txHashes[ticket.id.toString()] = latestLog.transactionHash
              console.log(`Found registration transaction for ticket ${ticket.id}:`, latestLog.transactionHash)
            } else {
              // Fallback to mock hash if no logs found (for development only)
              const mockTxHash = `0x${ticket.id.toString().padStart(64, '0')}`
              txHashes[ticket.id.toString()] = mockTxHash
              console.warn(`No registration logs found for ticket ${ticket.id}, using mock hash`)
            }
          } catch (error) {
            console.error(`Failed to fetch transaction for ticket ${ticket.id}:`, error)
            // In case of error, still set a mock hash to prevent UI issues
            const mockTxHash = `0x${ticket.id.toString().padStart(64, '0')}`
            txHashes[ticket.id.toString()] = mockTxHash
          }
        }
        
        console.log('Setting ticket transactions:', txHashes)
        setTicketTransactions(txHashes)
      }
  
      fetchTransactionHashes()
    }, [allTickets, registrationMap, publicClient, address, eventTicketingAddress])
  
    // Handle listing confirmation
    useEffect(() => {
      if (isListingConfirmed) {
        toast.success('Ticket listed for resale!', {
          description: 'Your ticket is now available on the resale market.',
        });
        setCurrentAction(null)
      }
    }, [isListingConfirmed])
  
  
    const filteredTickets = userTickets.filter((ticket) => {
      const matchesSearch = ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "upcoming" && ticket.status === "upcoming") ||
        (selectedCategory === "past" && ticket.status === "past")
  
      return matchesSearch && matchesCategory
    })  
  
    const handleTicketAction = (ticket: NFTTicketDisplay, action: TicketAction) => {
      setSelectedTicket(ticket)
      setCurrentAction(action)
    }
  
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    }
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case "upcoming":
          return "bg-green-500 text-white"
        case "past":
          return "bg-gray-500 text-white"
        default:
          return "bg-purple-500 text-white"
      }
    }
  
    const downloadQRCode = async (ticket: NFTTicketDisplay) => {
      try {
        const canvas = document.createElement('canvas');
        const qrData = [
          `ID:${ticket.id}`,
          `Event:${ticket.eventTitle.substring(0, 30)}${ticket.eventTitle.length > 30 ? '...' : ''}`,
          `Date:${new Date(ticket.eventTimestamp * 1000).toLocaleDateString()}`,
          `Loc:${ticket.location.substring(0, 20)}`,
          `Price:${ticket.price}`,
          `Purchase Date:${ticket.purchaseDate}`,
          `TxHash:${ticket.txHash}`
        ].join('\n');
  
        await QRCode.toCanvas(canvas, qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
  
        return new Promise<void>((resolve) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              toast.error('Failed to generate QR code');
              return;
            };
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${ticket.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('QR code downloaded successfully!');
            resolve();
          }, 'image/png');
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
      }
    };
  
    const handleRefresh = async () => {
      // Implement refresh logic if needed, or remove this function if not used
    }
  
    if (!isConnected) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground">
          <div className="container mx-auto px-4 py-16 pt-24">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-slate-300">Connect your Web3 wallet to view and manage your NFT tickets.</p>
              </div>
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-foreground px-10">
  
        <div className="container mx-auto px-4 py-8 pt-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Tickets
              </h1>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                title="Refresh tickets"
              >
                <RefreshCw className="h-5 w-5 text-purple-400" />
              </Button>
            </div>
  
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{userTickets.length}</p>
                      <p className="text-sm text-slate-400">Total Tickets</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {userTickets.filter(t => t.status === "upcoming").length}
                      </p>
                      <p className="text-sm text-slate-400">Upcoming Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{userTickets.length}</p>
                      <p className="text-sm text-slate-400">Transferable</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets by event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white text-sm font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={
                    selectedCategory === "all"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === "upcoming" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("upcoming")}
                  className={
                    selectedCategory === "upcoming"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                >
                  Upcoming
                </Button>
                <Button
                  variant={selectedCategory === "past" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("past")}
                  className={
                    selectedCategory === "past"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-600 text-slate-300 hover:border-purple-500"
                  }
                >
                  Past
                </Button>
              </div>
            </div>
  
            {/* Tickets Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-purple-500/50"
                >
                  <div className="relative">
                    <div className="w-full h-38 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-purple-400" />
                    </div>
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(ticket.status)}`}>
                      {ticket.status === "upcoming" ? "Valid" : "Used"}
                    </Badge>
                    <div className="absolute bottom-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="bg-slate-700 hover:bg-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, "view")}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, "qr")}>
                            <QrCode className="w-4 h-4 mr-2" />
                            Show QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, "transfer")}>
                            <Send className="w-4 h-4 mr-2" />
                            Transfer Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket, "resale")}>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            List for Resale
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => ticket.txHash && window.open(
                              chain?.id === ChainId.CELO_SEPOLIA
                              ? `https://celo-sepolia.blockscout.com//tx/${ticket.txHash}`
                              : chain?.id === ChainId.BASE_SEPOLIA
                              ? `https://celo-alfajores.blockscout.com//tx/${ticket.txHash}`
                              : `https://celo.blockscout.com//tx/${ticket.txHash}`
                            , "_blank" 
                            )}
                            disabled={!ticket.txHash}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Explorer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 text-white">{ticket.eventTitle}</CardTitle>
                  </CardHeader>
  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(ticket.purchaseDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
  
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-xs text-slate-400">Ticket ID</p>
                        <p className="font-mono text-sm text-purple-300">#{ticket.qrCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Paid</p>
                        <p className="font-medium text-purple-400">{ticket.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
  
            {filteredTickets.length === 0 && (
              <div className="text-center py-16">
                <QrCode className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Tickets Found</h3>
                <p className="text-slate-400 mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "No tickets match your current filters."
                    : "You don't have any tickets yet. Visit the marketplace to purchase some!"}
                </p>
                <Link href="/marketplace">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    {searchQuery || selectedCategory !== "all" ? "Clear Filters" : "Discover Events"}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
  
        {/* Ticket Details Dialog */}
        <Dialog open={currentAction === "view"} onOpenChange={() => setCurrentAction(null)}>
          <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700">
            {selectedTicket && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-white">{selectedTicket.eventTitle}</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    View detailed information about your ticket including QR code, transaction details, and event information.
                  </DialogDescription>
                </DialogHeader>
  
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="rounded-lg flex items-center justify-center p-2 bg-white">
                      {/* <QrCode className="w-16 h-16 text-purple-400" /> */}
                      {selectedTicket && (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          [
                            `ID:${selectedTicket.id}`,
                            `Event:${selectedTicket.eventTitle.substring(0, 30)}`,
                            `Date:${new Date(selectedTicket.eventTimestamp * 1000).toLocaleDateString()}`,
                            `Loc:${selectedTicket.location.substring(0, 20)}`,
                            `Price:${selectedTicket.price}`,
                            `Purchase Date:${selectedTicket.purchaseDate}`,
                            `TxHash:${selectedTicket.txHash}`
                          ].join("\n")
                        )}`} 
                        alt="Ticket QR Code"
                        className="w-auto h-auto p-4"
                      />
                    )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ticket ID</span>
                        <span className="font-mono text-purple-300">#{selectedTicket.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Purchase Price</span>
                        <span className="font-medium text-purple-400">{selectedTicket.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Purchase Date</span>
                        <span className="text-white">{new Date(selectedTicket.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {selectedTicket.status === "upcoming" ? "Valid" : "Used"}
                        </Badge>
                      </div>
                    </div>
                  </div>
  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Transaction Details</h4>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-700 p-2 rounded flex-1 truncate text-slate-300">
                          {selectedTicket.txHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectedTicket.txHash && copyToClipboard(selectedTicket.txHash)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => selectedTicket.txHash && window.open(
                      chain?.id === ChainId.CELO_SEPOLIA
                      ? `https://celo-sepolia.blockscout.com//tx/${selectedTicket.txHash}`
                      : chain?.id === ChainId.BASE_SEPOLIA
                      ? `https://celo-alfajores.blockscout.com//tx/${selectedTicket.txHash}`
                      : `https://celo.blockscout.com//tx/${selectedTicket.txHash}`
                    , "_blank" 
                  )}
                        
                    disabled={!selectedTicket.txHash}
                    className="border-slate-600 text-slate-300 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                  <Button
                    onClick={() => handleTicketAction(selectedTicket, "qr")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
  
        {/* QR Code Dialog */}
        <Dialog open={currentAction === "qr"} onOpenChange={() => setCurrentAction(null)}>
          <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
            {selectedTicket && (
              <div className="text-center space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-white">Entry QR Code</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Scan this QR code at the event venue for entry verification.
                  </DialogDescription>
                </DialogHeader>
  
                <div className="space-y-4">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto p-4">
                    {selectedTicket && (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          [
                            `ID:${selectedTicket.id}`,
                            `Event:${selectedTicket.eventTitle.substring(0, 30)}`,
                            `Date:${new Date(selectedTicket.eventTimestamp * 1000).toLocaleDateString()}`,
                            `Loc:${selectedTicket.location.substring(0, 20)}`,
                            `Price:${selectedTicket.price}`,
                            `Purchase Date:${selectedTicket.purchaseDate}`,
                            `TxHash:${selectedTicket.txHash}`
                          ].join("\n")
                        )}`} 
                        alt="Ticket QR Code"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{selectedTicket.eventTitle}</p>
                    <p className="text-sm text-slate-400">Ticket #{selectedTicket.id}</p>
                  </div>
                  <p className="text-xs text-slate-400">Show this QR code at the event entrance for verification</p>
                </div>
  
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:border-purple-500 bg-transparent"
                    onClick={() => selectedTicket && downloadQRCode(selectedTicket)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => setCurrentAction(null)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
  
        {/* Transfer Ticket Modal */}
        {selectedTicket && (
          <TransferTicketModal
            isOpen={currentAction === "transfer"}
            onClose={() => setCurrentAction(null)}
            tokenId={selectedTicket.tokenId}
            eventName={selectedTicket.eventTitle}
            onTransferSuccess={() => {
              toast.success('Ticket transferred successfully!')
              setCurrentAction(null)
            }}
          />
        )}

        {/* List for Resale Modal */}
        {selectedTicket && (
          <ListTicketModal
            isOpen={currentAction === "resale"}
            onClose={() => setCurrentAction(null)}
            tokenId={selectedTicket.tokenId}
            eventName={selectedTicket.eventTitle}
            originalPrice={BigInt(parseFloat(selectedTicket.price.replace(' CELO', '')) * 1e18)}
            onListSuccess={() => {
              // Optionally refresh tickets or show success message
              toast.success('Ticket listed successfully!')
            }}
          />
        )}
      </div>
    )
  }
