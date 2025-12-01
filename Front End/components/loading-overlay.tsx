import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  label?: string
  className?: string
  spinnerClassName?: string
  backdropClassName?: string
}

export function LoadingOverlay({
  isLoading,
  label = "Loading...",
  className,
  spinnerClassName,
  backdropClassName,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        backdropClassName
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-lg bg-background p-6 shadow-lg",
          className
        )}
      >
        <Loader2 className={cn("h-8 w-8 animate-spin text-primary", spinnerClassName)} />
        {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    </div>
  )
}
