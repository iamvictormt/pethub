"use client"
import { cn } from "@/lib/utils"

export interface SliderInputProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  unit?: string
  className?: string
}

export function SliderInput({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = "",
  className,
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("w-full space-y-3", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-foreground">{label}</label>}
          {showValue && (
            <span className="text-sm font-medium text-foreground">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, oklch(var(--primary)) 0%, oklch(var(--primary)) ${percentage}%, oklch(var(--muted)) ${percentage}%, oklch(var(--muted)) 100%)`,
          }}
        />
      </div>
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: oklch(var(--primary));
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: oklch(var(--primary));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
