"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  id: number
  name: string
  status: 'complete' | 'current' | 'upcoming'
}

type EventFormProgressProps = {
  steps: Step[]
  currentStep: number
  className?: string
}

export function EventFormProgress({ steps, currentStep, className }: EventFormProgressProps) {
  return (
    <nav className={className} aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li 
            key={step.name} 
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                <div className="absolute left-0 top-0 flex h-10 w-full items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-foreground">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute left-0 top-0 flex h-10 w-full items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <div 
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background"
                  aria-current="step"
                >
                  <span className="text-primary">{step.id}</span>
                  <span className="sr-only">{step.name}</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-primary">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute left-0 top-0 flex h-10 w-full items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-muted" />
                </div>
                <div className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background">
                  <span className="text-muted-foreground">{step.id}</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const STEPS = [
  {
    id: 1,
    name: 'Event Details',
    status: 'upcoming'
  },
  {
    id: 2,
    name: 'Ticket Setup',
    status: 'upcoming'
  },
  {
    id: 3,
    name: 'Review & Create',
    status: 'upcoming'
  },
]
