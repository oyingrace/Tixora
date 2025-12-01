import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin text-foreground",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function LoadingSpinner({
  className,
  size,
  label,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Loader2 className={cn(spinnerVariants({ size }))} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}
