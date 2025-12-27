"use client"

import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { TicketActions } from "./TicketActions"
import type { NFTTicketDisplay } from "@/app/profile/page"

type TicketCardProps = {
  ticket: NFTTicketDisplay
  onAction: (action: string, ticket: NFTTicketDisplay) => void
  isLoading?: boolean
}

export function TicketCard({ ticket, onAction, isLoading = false }: TicketCardProps) {
  const eventDate = new Date(ticket.eventTimestamp * 1000)
  const isUpcoming = ticket.status === 'upcoming'
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Card className="h-full flex flex-col">
          <div className="h-40 bg-muted/50 rounded-t-lg" />
          <CardHeader>
            <div className="h-6 bg-muted/50 rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted/50 rounded w-1/2" />
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            <div className="h-4 bg-muted/50 rounded w-5/6" />
            <div className="h-4 bg-muted/50 rounded w-2/3" />
            <div className="h-4 bg-muted/50 rounded w-3/4 mt-4" />
          </CardContent>
          <CardFooter className="justify-between">
            <div className="h-9 w-24 bg-muted/50 rounded" />
            <div className="h-9 w-24 bg-muted/50 rounded" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-primary/10 to-muted/50 flex items-center justify-center">
          <div className="text-4xl font-bold text-muted-foreground/30">
            {ticket.eventTitle.charAt(0).toUpperCase()}
          </div>
        </div>
        <Badge 
          variant={isUpcoming ? "default" : "secondary"} 
          className="absolute top-2 right-2"
        >
          {isUpcoming ? 'Upcoming' : 'Past'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2">{ticket.eventTitle}</CardTitle>
        <div className="text-sm text-muted-foreground">{ticket.location}</div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-2 text-sm">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(eventDate, 'PPP')}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{format(eventDate, 'p')}</span>
        </div>
        <div className="flex items-start">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{ticket.location}</span>
        </div>
        
        {ticket.txHash && (
          <div className="pt-2 mt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => window.open(`https://explorer.celo.org/tx/${ticket.txHash}`, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              View on Explorer
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between pt-4">
        <div className="text-sm font-medium">
          <div className="text-muted-foreground text-xs">Price</div>
          <div>{ticket.price}</div>
        </div>
        
        <TicketActions 
          isUpcoming={isUpcoming} 
          onAction={(action) => onAction(action, ticket)}
        />
      </CardFooter>
    </Card>
  )
}
