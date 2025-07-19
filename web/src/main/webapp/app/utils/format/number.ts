/**
 * Number formatting utilities
 */

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

export const formatChange = (value: number): { text: string; color: string } => {
  const isPositive = value >= 0;
  const text = `${isPositive ? '+' : ''}${value.toFixed(1)}%`;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  return { text, color };
};

export const formatWeight = (weight: number): string => {
  return `${formatNumber(weight)} lbs`;
};

export const formatDistance = (miles: number): string => {
  return `${formatNumber(miles)} mi`;
};