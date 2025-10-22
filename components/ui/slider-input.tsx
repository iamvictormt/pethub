'use client';
import { cn } from '@/lib/utils';

export interface SliderInputProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  className?: string;
}

export function SliderInput({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = '',
  className,
}: SliderInputProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full space-y-3', className)}>
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
      <div className="relative h-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="slider-custom w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(249, 115, 22, 0.1);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.5), 0 0 0 6px rgba(249, 115, 22, 0.15);
        }
        .slider-custom::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4), 0 0 0 4px rgba(249, 115, 22, 0.1);
          transition: all 0.2s ease;
        }
        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.5), 0 0 0 6px rgba(249, 115, 22, 0.15);
        }
      `}</style>
    </div>
  );
}
