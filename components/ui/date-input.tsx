'use client';

import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const combinedRef = (el: HTMLInputElement) => {
      inputRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    };

    const today = new Date().toISOString().split('T')[0];

    // Função para validar e corrigir datas passadas
    const validateDate = (value: string) => {
      if (!value || value > today) return today;
      return value;
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      e.target.value = validateDate(e.target.value);
      props.onChange?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
      e.target.value = validateDate(e.target.value);
      props.onBlur?.(e);
    };

    const handleIconClick = () => {
      if (inputRef.current?.showPicker) inputRef.current.showPicker();
      else inputRef.current?.focus();
    };

    return (
      <div className="w-full space-y-2">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}

        <div className="relative w-full">
          <input
            type="date"
            ref={combinedRef}
            max={today}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'w-full rounded-2xl border border-input bg-background px-4 pr-12 py-3 text-base text-left',
              'appearance-none',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              '[&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:width-0 [&::-webkit-calendar-picker-indicator]:height-0',
              '[&::-moz-calendar-picker-indicator]:display-none',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            {...props}
          />

          <Calendar
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
            onClick={handleIconClick}
          />
        </div>

        {(error || helperText) && (
          <p className={cn('text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>{error || helperText}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput };
