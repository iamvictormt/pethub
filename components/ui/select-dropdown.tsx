'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  dropup?: boolean;
  disabled?: boolean;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  className,
  dropup = true,
  disabled = false,
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          disabled={disabled}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-2xl border border-input bg-background px-4 py-3 text-base transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
            !selectedOption && 'text-muted-foreground',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180',
              disabled && 'opacity-40'
            )}
          />
        </button>

        {isOpen && !disabled && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div
              className={cn(
                'absolute z-20 w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden',
                dropup ? 'bottom-full mb-2' : 'mt-2'
              )}
            >
              <div
                className={cn(
                  // aplica barra de rolagem se mais de 8 opções
                  options.length > 8 ? 'max-h-72 overflow-y-auto' : ''
                )}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center px-4 py-3 text-left text-sm transition-colors',
                      'hover:bg-accent',
                      value === option.value && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
