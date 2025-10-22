"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <input
          className={cn(
            "flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-3 text-base transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>{error || helperText}</p>
        )}
      </div>
    )
  },
)
TextInput.displayName = "TextInput"

export { TextInput }
