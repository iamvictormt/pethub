"use client"
import { cn } from "@/lib/utils"

export interface RadioOption {
  id: string
  label: string
  description?: string
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  className?: string
}

export function RadioGroup({ options, value, onChange, label, className }: RadioGroupProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange?.(option.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
              value === option.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/50",
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                value === option.id ? "border-primary-foreground" : "border-muted-foreground",
              )}
            >
              {value === option.id && <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
            </div>
            <div className="flex-1 space-y-1">
              <p className={cn("text-sm font-medium leading-none", value === option.id && "text-primary-foreground")}>
                {option.label}
              </p>
              {option.description && (
                <p
                  className={cn(
                    "text-sm",
                    value === option.id ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {option.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
