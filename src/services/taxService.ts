type AseanCountry = 'Thailand' | 'Vietnam' | 'Indonesia' | 'Singapore' | 'Malaysia';

const VAT_RATES: Record<AseanCountry, number> = {
  Thailand: 0.07,
  Vietnam: 0.10,
  Indonesia: 0.11,
  Singapore: 0.09,
  Malaysia: 0.06,
};

export const calculateTax = (country: AseanCountry, amount: number) => {
  const rate = VAT_RATES[country] || 0.07;
  const tax = +(amount * rate).toFixed(2);
  return {
    subtotal: amount,
    tax,
    total: +(amount + tax).toFixed(2),
    rate: `${(rate * 100).toFixed(0)}%`,
    country
  };
};
