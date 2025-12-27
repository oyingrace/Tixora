"use client"

import { cn } from "@/lib/utils"

type Step = {
  id: string
  label: string
  description: string
}

type EventFormProgressProps = {
  steps: Step[]
  currentStep: number
  className?: string
}

export function EventFormProgress({ steps, currentStep, className }: EventFormProgressProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={cn(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
            {stepIdx < currentStep ? (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-primary" aria-hidden="true" />
                )}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <svg
                        className="h-5 w-5 text-primary-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-foreground">{step.label}</span>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </span>
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-muted" aria-hidden="true" />
                )}
                <div className="group relative flex items-start" aria-current="step">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-primary">{step.label}</span>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </span>
                </div>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-muted" aria-hidden="true" />
                )}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background group-hover:border-foreground/50">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-foreground/50" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{step.label}</span>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </span>
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
    id: 'details',
    label: 'Event Details',
    description: 'Basic information about your event',
  },
  {
    id: 'tickets',
    label: 'Ticket Setup',
    description: 'Configure ticket types and pricing',
  },
  {
    id: 'review',
    label: 'Review & Create',
    description: 'Verify your event details',
  },
]
