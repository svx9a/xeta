export const calculateTax = (country: string, amount: number) => {
  // Simple mock tax calculation
  const rates: Record<string, number> = {
    'Thailand': 0.07,
    'Vietnam': 0.10,
    'Indonesia': 0.11,
    'Malaysia': 0.06,
    'Philippines': 0.12,
  };
  const rate = rates[country] || 0.07;
  return {
    amount,
    taxRate: rate,
    taxAmount: amount * rate,
    total: amount * (1 + rate),
    currency: country === 'Thailand' ? 'THB' : 'USD'
  };
};
