"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEventTicketingSetters } from "@/hooks/useEventTicketing"
import { EventFormProgress } from "./EventFormProgress"
import { EventDetailsStep } from "./steps/EventDetailsStep"
import { TicketSetupStep } from "./steps/TicketSetupStep"
import { PricingBreakdownStep } from "./steps/PricingBreakdownStep"
import { ReviewStep } from "./steps/ReviewStep"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FormData = {
  title: string
  description: string
  date: string
  time: string
  location: string
  price: string
  totalSupply: string
}

export function CreateEventForm() {
  const router = useRouter()
  const { createTicket, isPending, isConfirming, isConfirmed, error } = useEventTicketingSetters()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    totalSupply: ""
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const steps = [
    { id: 1, name: 'Event Details', status: 'current' as const },
    { id: 2, name: 'Ticket Setup', status: 'upcoming' as const },
    { id: 3, name: 'Pricing', status: 'upcoming' as const },
    { id: 4, name: 'Review', status: 'upcoming' as const },
  ]

  const updatedSteps = steps.map((step, index) => {
    if (index < currentStep) {
      return { ...step, status: 'complete' as const }
    } else if (index === currentStep) {
      return { ...step, status: 'current' as const }
    } else {
      return { ...step, status: 'upcoming' as const }
    }
  })

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (!formData.date) newErrors.date = "Date is required"
      if (!formData.time) newErrors.time = "Time is required"
      if (!formData.location.trim()) newErrors.location = "Location is required"
    } else if (step === 1) {
      const price = parseFloat(formData.price)
      const totalSupply = parseInt(formData.totalSupply)
      
      if (isNaN(price) || price <= 0) {
        newErrors.price = "Please enter a valid price greater than 0"
      }
      
      if (isNaN(totalSupply) || totalSupply <= 0) {
        newErrors.totalSupply = "Please enter a valid number of tickets"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) return
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return
    
    try {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      
      await createTicket(
        BigInt(Math.floor(parseFloat(formData.price) * 10 ** 18)),
        formData.title,
        formData.description,
        BigInt(Math.floor(eventDateTime.getTime() / 1000)),
        BigInt(parseInt(formData.totalSupply)),
        JSON.stringify({
          date: formData.date,
          time: formData.time,
          location: formData.location
        }),
        formData.location
      )
      
      // Success handling is done via the isConfirmed effect
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Failed to create event. Please try again.")
    }
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  // Handle successful creation
  if (isConfirmed) {
    router.push("/profile")
    return null
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-xl border">
        <EventFormProgress 
          steps={updatedSteps} 
          currentStep={currentStep + 1} 
          className="mb-8" 
        />
        
        <div className="space-y-6">
          {currentStep === 0 && (
            <EventDetailsStep
              data={{
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                location: formData.location,
              }}
              onChange={updateFormData}
              errors={errors}
            />
          )}
          
          {currentStep === 1 && (
            <TicketSetupStep
              data={{
                price: formData.price,
                totalSupply: formData.totalSupply
              }}
              onChange={updateFormData}
              errors={errors}
            />
          )}
          
          {currentStep === 2 && (
            <PricingBreakdownStep
              data={{
                price: formData.price,
                totalSupply: formData.totalSupply
              }}
            />
          )}
          
          {currentStep === 3 && (
            <ReviewStep
              data={formData}
              onSubmit={handleSubmit}
              isSubmitting={isPending || isConfirming}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isPending || isConfirming}
              className={cn(
                currentStep === 0 ? 'invisible' : '',
                "min-w-[100px]"
              )}
            >
              Back
            </Button>
            
            <div className="flex-1 flex justify-end">
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isPending || isConfirming}
                  className="min-w-[120px]"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || isConfirming}
                  className="min-w-[160px]"
                >
                  {isPending || isConfirming ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Event...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Step {currentStep + 1} of {steps.length} • All information can be edited later</p>
      </div>
    </div>
  )
}
