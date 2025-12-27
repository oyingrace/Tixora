"use client"

import { useAccount } from "wagmi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type ProfileStats = {
  totalTickets: number
  upcomingEvents: number
  pastEvents: number
}

type ProfileHeaderProps = {
  stats: ProfileStats
  isLoading?: boolean
}

export function ProfileHeader({ stats, isLoading = false }: ProfileHeaderProps) {
  const { address } = useAccount()
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex space-x-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} />
            <AvatarFallback>USR</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">{shortAddress}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalTickets}</p>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.pastEvents}</p>
                <p className="text-sm text-muted-foreground">Past Events</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
