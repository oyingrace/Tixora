import React from 'react'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function featureEvents() {

    const router = useRouter();

    // fetch the last four events from the contract

  return (
    <section id="featured-events" className="bg-slate-900/30 px-15 md:px-20 lg:px-24 md:pt-[calc(100vh-42rem)] pt-[calc(100vh-65rem)] pb-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Featured Events
            </h2>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              Discover amazing events from top organizers around the world
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.slice(0, 4).map((event, index) => (
              <Card
                key={event.id}
                className={`group hover:scale-105 transition-all duration-500 cursor-pointer bg-slate-800/90 border-slate-700 hover:border-primary/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 ${
                  index === currentEventIndex % featuredEvents.length ? 'ring-2 ring-primary/50 scale-102' : ''
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={imageErrors[Number(event.id)] ? "/placeholder.svg" : event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => handleImageError(Number(event.id))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                      {event.category}
                    </Badge>
                    <Badge className={`absolute top-3 right-3 backdrop-blur-sm ${
                      event.ticketsLeft <= 10 ? 'bg-red-500/90 animate-pulse' : 'bg-secondary/90'
                    } text-white`}>
                      {event.ticketsLeft} left
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-white line-clamp-2 min-h-[3.5rem]">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-slate-300 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>{event.attendees.toLocaleString()} attendees</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center pt-4 border-t border-slate-700/50">
                      <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {event.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/marketplace')}
              className="px-8 py-4 text-lg hover:scale-105 transition-all duration-300 border-primary/50 hover:bg-primary/10"
            >
              View All Events <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
  )
}

export default featureEvents;