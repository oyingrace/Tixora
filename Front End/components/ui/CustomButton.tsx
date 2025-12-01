"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const customButtonVariants = cva(
  "inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-150 ease-in-out h-11 min-w-[120px] px-5 text-[0.9375rem]",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, asChild = false, icon, iconPosition = "left", children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Button
        className={cn(customButtonVariants({ variant, className }))}
        ref={ref}
        asChild={asChild}
        {...props}
      >
        <Comp>
          {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </Comp>
      </Button>
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, customButtonVariants }