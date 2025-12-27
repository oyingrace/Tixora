"use client"

import { Calendar, MapPin, FileText, Coins, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type ReviewData = {
  title: string
  description: string
  date: string
  time: string
  location: string
  price: string
  totalSupply: string
}

type ReviewStepProps = {
  data: ReviewData
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  className?: string
}

export function ReviewStep({ data, onBack, onSubmit, isSubmitting, className }: ReviewStepProps) {
  const formatDate = (dateString: string, timeString: string) => {
    try {
      const date = new Date(`${dateString}T${timeString}`)
      return format(date, "MMMM d, yyyy 'at' h:mm a")
    } catch (e) {
      return `Invalid date ${e}`
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Review & Create Event</h2>
        <p className="text-muted-foreground">Please review your event details before creating</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Event Details</h3>
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{data.title}</p>
                <p className="text-sm text-muted-foreground">{data.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(data.date, data.time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{data.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Ticket Information</h3>
          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Price per ticket</p>
                  <p className="text-sm text-muted-foreground">{parseFloat(data.price).toFixed(2)} CELO</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Tickets</p>
                  <p className="text-sm text-muted-foreground">{data.totalSupply} tickets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </Button>
      </div>
    </div>
  )
}
