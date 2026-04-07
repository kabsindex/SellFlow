import type { CurrencyCode } from './types';

const formatters: Record<CurrencyCode, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  CDF: new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  FCFA: new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
};

export function formatCurrency(value: number, currency: CurrencyCode = 'USD') {
  return formatters[currency].format(value);
}

export function normalizeAmount(value: number | string) {
  return Number(value);
}

export function formatUsd(value: number) {
  return formatCurrency(value, 'USD');
}
