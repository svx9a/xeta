type AseanCountry = 'Brunei' | 'Cambodia' | 'Indonesia' | 'Laos' | 'Malaysia' | 'Myanmar' | 'Philippines' | 'Singapore' | 'Thailand' | 'Vietnam';

const SHIPPING_BASE_RATES: Record<AseanCountry, number> = {
  Brunei: 8, Cambodia: 7, Indonesia: 6, Laos: 7, Malaysia: 5,
  Myanmar: 9, Philippines: 6, Singapore: 4, Thailand: 4, Vietnam: 5,
};

const LOGISTICS_PARTNERS: Record<AseanCountry, string[]> = {
  Brunei: ['DHL','Aramex'], Cambodia: ['J&T Express','DHL'],
  Indonesia: ['JNE','J&T Express','SiCepat','DHL'], Laos: ['DHL','EMS'],
  Malaysia: ['Pos Laju','J&T Express','DHL'], Myanmar: ['DHL','EMS'],
  Philippines: ['LBC','J&T Express','DHL'], Singapore: ['SingPost','Ninja Van','DHL'],
  Thailand: ['Thailand Post','Flash Express','Kerry','DHL'], Vietnam: ['VNPost','GHTK','Ninja Van','DHL'],
};

export type Address = string;

export interface ShippingQuoteRequest {
  from: Address;
  to: Address;
  weight: number;
  value: number;
}

export interface ShippingQuote {
  carrier: string;
  price: number;
  basePrice: number;
  weightSurcharge: number;
  premiumFee: number;
  estimatedDelivery: string;
  confidence: number;
  logs: string[];
}

export const getShippingQuotes = async (req: ShippingQuoteRequest): Promise<ShippingQuote[]> => {
  // Simulate network latency for AI/Carrier API scan
  await new Promise(resolve => setTimeout(resolve, 800));

  // Determine destination country from address string (mock logic)
  let destination: AseanCountry = 'Thailand';
  if (req.to.toLowerCase().includes('vietnam')) destination = 'Vietnam';
  if (req.to.toLowerCase().includes('malaysia')) destination = 'Malaysia';
  if (req.to.toLowerCase().includes('indonesia')) destination = 'Indonesia';
  if (req.to.toLowerCase().includes('singapore')) destination = 'Singapore';

  const baseRate = SHIPPING_BASE_RATES[destination] || 50; // Use a reasonable default in local currency
  const partners = LOGISTICS_PARTNERS[destination] || ['Kerry', 'DHL'];

  const calculateDeliveryDate = (carrier: string, idx: number) => {
    const date = new Date();
    const offset = carrier.includes('DHL') ? 1 : carrier.includes('Kerry') ? 2 : 3 + idx;
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  };

  return partners.map((carrier, idx) => {
    const basePrice = baseRate;
    const weightSurcharge = +(req.weight * 12).toFixed(2);
    const isPremium = carrier.includes('DHL') || carrier.includes('Kerry');
    const premiumFee = isPremium ? 15.00 : 0;
    const price = +(basePrice + weightSurcharge + premiumFee).toFixed(2);

    const logs = [
      `[DEBUG] INITIATING_NODE_QUERY: ${carrier.toUpperCase()}_API_V2`,
      `[TRACE] LATENCY_CHECK: 42ms (BANGKOK_NORTH_HUB)`,
      `[INFO] CALCULATING_VECTORS: weight=${req.weight}kg, value=฿${req.value}`,
      `[DEBUG] LOAD_BALANCE: Node ${Math.floor(Math.random() * 99)} selected`,
      `[SUCCESS] QUOTE_OBTAINED: ${price.toFixed(2)} THB`
    ];

    return {
      carrier,
      price,
      basePrice,
      weightSurcharge,
      premiumFee,
      estimatedDelivery: calculateDeliveryDate(carrier, idx),
      confidence: +(0.85 + (Math.random() * 0.14)).toFixed(2),
      logs
    };
  });
};
