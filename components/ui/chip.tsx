"use client"
import { X, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChipProps {
  label: string
  icon?: LucideIcon
  selected?: boolean
  onSelect?: () => void
  onRemove?: () => void
  variant?: "default" | "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Chip({
  label,
  icon: Icon,
  selected = false,
  onSelect,
  onRemove,
  variant = "default",
  size = "md",
  className,
}: ChipProps) {
  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-5 text-base gap-2.5",
  }

  const variantClasses = {
    default: selected
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-background text-foreground border-border hover:border-primary/50",
    primary: selected
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    secondary: selected
      ? "bg-secondary text-secondary-foreground border-secondary"
      : "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20",
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {Icon && <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 rounded-full hover:bg-black/10 p-0.5 transition-colors"
        >
          <X className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
        </button>
      )}
    </button>
  )
}
