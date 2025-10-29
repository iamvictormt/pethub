export const formatRewardAmount = (value: string, min = 1, max = 10000): string => {
  const numericValue = parseFloat(value.replace(/\D/g, ''));

  if (isNaN(numericValue)) {
    return '';
  }

  const clampedValue = Math.min(Math.max(numericValue, min), max);

  return clampedValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
