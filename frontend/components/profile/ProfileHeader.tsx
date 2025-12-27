"use client"

import { useAccount } from "wagmi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type ProfileStats = {
  totalTickets: number
  upcomingEvents: number
  pastEvents: number
}

type ProfileHeaderProps = {
  stats: ProfileStats
  isLoading?: boolean
  className?: string
}

export function ProfileHeader({ stats, isLoading = false, className }: ProfileHeaderProps) {
  const { address } = useAccount()
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  const StatItem = ({ value, label }: { value: React.ReactNode; label: string }) => (
    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg transition-all hover:bg-muted/50">
      <span className="text-2xl font-bold text-primary">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden border-border/50 shadow-sm", className)}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} 
                  alt="User Avatar"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                  {shortAddress.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                My Tickets
              </h1>
              <p className="text-muted-foreground font-mono text-sm mt-1">{shortAddress}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatItem 
              value={stats.totalTickets} 
              label="Total Tickets" 
            />
            <StatItem 
              value={stats.upcomingEvents} 
              label="Upcoming Events" 
            />
            <StatItem 
              value={stats.pastEvents} 
              label="Past Events" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
