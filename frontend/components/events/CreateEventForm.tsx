"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEventTicketingSetters } from "@/hooks/useEventTicketing"
import { EventDetailsStep } from "./steps/EventDetailsStep"
import { TicketSetupStep } from "./steps/TicketSetupStep"
import { ReviewStep } from "./steps/ReviewStep"
import { STEPS } from "../events/EventFormProgress"

type FormData = {
  // Event Details
  title: string
  description: string
  date: string
  time: string
  location: string
  
  // Ticket Setup
  price: string
  totalSupply: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

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
    totalSupply: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Handle form data updates
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates)
    const newErrors = { ...errors }
    updatedFields.forEach(field => {
      if (newErrors[field as keyof FormErrors]) {
        delete newErrors[field as keyof FormErrors]
      }
    })
    setErrors(newErrors)
  }

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    
    if (step === 0) {
      // Validate event details
      if (!formData.title.trim()) newErrors.title = "Event title is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (!formData.date) newErrors.date = "Event date is required"
      if (!formData.time) newErrors.time = "Event time is required"
      if (!formData.location.trim()) newErrors.location = "Location is required"
      
      // Validate date is in the future
      if (formData.date && formData.time) {
        const eventDate = new Date(`${formData.date}T${formData.time}`)
        if (eventDate <= new Date()) {
          newErrors.date = "Event date must be in the future"
        }
      }
    } else if (step === 1) {
      // Validate ticket setup
      if (!formData.price) {
        newErrors.price = "Price is required"
      } else if (parseFloat(formData.price) <= 0) {
        newErrors.price = "Price must be greater than 0"
      }
      
      if (!formData.totalSupply) {
        newErrors.totalSupply = "Number of tickets is required"
      } else if (parseInt(formData.totalSupply) <= 0) {
        newErrors.totalSupply = "Must have at least 1 ticket"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation handlers
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  // Form submission
  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
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
      } catch (err) {
        console.error("Error creating event:", err)
        toast.error("Failed to create event. Please try again.")
      }
    }
  }

  // Handle successful creation
  if (isConfirmed) {
    router.push("/profile")
    return null
  }

  // Render current step
  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form steps */}
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
            errors={{
              title: errors.title,
              description: errors.description,
              date: errors.date,
              time: errors.time,
              location: errors.location,
            }}
          />
        )}

        {currentStep === 1 && (
          <TicketSetupStep
            data={{
              price: formData.price,
              totalSupply: formData.totalSupply,
            }}
            onChange={updateFormData}
            errors={{
              price: errors.price,
              totalSupply: errors.totalSupply,
            }}
          />
        )}

        {currentStep === 2 && (
          <ReviewStep
            data={formData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isPending || isConfirming}
          />
        )}
      </div>

      {/* Navigation buttons */}
      {currentStep < 2 && (
        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
