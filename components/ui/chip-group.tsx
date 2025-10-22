"use client"
import type { LucideIcon } from "lucide-react"
import { Chip } from "./chip"
import { cn } from "@/lib/utils"

export interface ChipOption {
  id: string
  label: string
  icon?: LucideIcon
}

export interface ChipGroupProps {
  options: ChipOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  label?: string
  variant?: "default" | "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  multiSelect?: boolean
  className?: string
}

export function ChipGroup({
  options,
  value = [],
  onChange,
  label,
  variant = "default",
  size = "md",
  multiSelect = true,
  className,
}: ChipGroupProps) {
  const handleSelect = (optionId: string) => {
    if (multiSelect) {
      const newValue = value.includes(optionId) ? value.filter((id) => id !== optionId) : [...value, optionId]
      onChange?.(newValue)
    } else {
      onChange?.(value.includes(optionId) ? [] : [optionId])
    }
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            icon={option.icon}
            selected={value.includes(option.id)}
            onSelect={() => handleSelect(option.id)}
            variant={variant}
            size={size}
          />
        ))}
      </div>
    </div>
  )
}
