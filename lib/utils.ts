import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneBR(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "")

  // Limit to 11 digits (Brazilian phone format)
  const limited = numbers.slice(0, 11)

  // Format based on length
  if (limited.length <= 2) {
    return limited
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
  }
}