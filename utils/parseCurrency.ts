export const parseCurrencyToNumber = (value: string): number => {
  if (!value) return 0;
  const numericString = value.replace(/\D/g, '');
  return parseFloat(numericString);
};
