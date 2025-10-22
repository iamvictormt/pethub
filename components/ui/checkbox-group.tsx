"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxOption {
  id: string
  label: string
  description?: string
}

export interface CheckboxGroupProps {
  options: CheckboxOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  label?: string
  className?: string
}

export function CheckboxGroup({ options, value = [], onChange, label, className }: CheckboxGroupProps) {
  const handleToggle = (optionId: string) => {
    const newValue = value.includes(optionId) ? value.filter((id) => id !== optionId) : [...value, optionId]
    onChange?.(newValue)
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleToggle(option.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
              value.includes(option.id)
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50",
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors mt-0.5",
                value.includes(option.id)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground",
              )}
            >
              {value.includes(option.id) && <Check className="h-3.5 w-3.5" />}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{option.label}</p>
              {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
