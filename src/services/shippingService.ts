interface ShippingQuoteParams {
  from: string;
  to: string;
  weight: number;
  value: number;
}

export const getShippingQuotes = async (params: ShippingQuoteParams) => {
  // Simple mock shipping quotes
  return [
    { provider: 'XETA Logics', service: 'Express', price: 150 + params.weight * 20, eta: '1-2 days' },
    { provider: 'Flash Global', service: 'Standard', price: 80 + params.weight * 15, eta: '3-5 days' },
    { provider: 'Thai Post', service: 'EMS', price: 120 + params.weight * 18, eta: '2-3 days' }
  ];
};
