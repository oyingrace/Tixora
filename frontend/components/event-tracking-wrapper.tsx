'use client'

import { useEffect } from 'react'
import { useEventTracking } from '@/lib/divvi-provider'

interface EventTrackingWrapperProps {
  eventId?: string
  trackView?: boolean
  trackInteraction?: boolean
  children: React.ReactNode
}

export function EventTrackingWrapper({ 
  eventId, 
  trackView = false, 
  trackInteraction = false,
  children 
}: EventTrackingWrapperProps) {
  const { trackEventView } = useEventTracking()

  useEffect(() => {
    if (trackView && eventId) {
      trackEventView(eventId)
    }
  }, [eventId, trackView, trackEventView])

  const handleInteraction = () => {
    if (trackInteraction && eventId) {
      // Track interaction event
      console.log('Tracking interaction for event:', eventId)
    }
  }

  if (trackInteraction) {
    return (
      <div onClick={handleInteraction} onMouseEnter={handleInteraction}>
        {children}
      </div>
    )
  }

  return <>{children}</>
}
