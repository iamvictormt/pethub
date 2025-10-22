"use client"
import { cn } from "@/lib/utils"

export interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export function ToggleSwitch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left transition-colors",
        "hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <div className="flex-1 space-y-1">
        {label && <p className="text-sm font-medium leading-none">{label}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("relative h-7 w-12 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}>
        <div
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </div>
    </button>
  )
}
