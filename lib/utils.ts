import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPhoneBR = (value: string) => {
  let digits = value.replace(/\D/g, "");

  if (digits.length > 11) digits = digits.slice(0, 11);

  if (digits.length > 6) {
    digits = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (digits.length > 2) {
    digits = digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    digits = digits.replace(/(\d*)/, "($1");
  }

  return digits;
};
