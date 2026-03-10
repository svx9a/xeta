import { TAX_RATES, AseanCountry } from './commerceConfig';

export type TaxResult = {
  country: AseanCountry;
  type: 'VAT' | 'GST';
  rate: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
};

export function calculateTax(country: AseanCountry, amount: number): TaxResult {
  const cfg = TAX_RATES[country];
  const rate = cfg.rate;
  const tax = +(amount * rate).toFixed(2);
  return {
    country,
    type: cfg.type,
    rate,
    taxableAmount: amount,
    taxAmount: tax,
    totalAmount: +(amount + tax).toFixed(2),
  };
}
