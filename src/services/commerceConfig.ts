export const ASEAN_COUNTRIES = [
  'Brunei','Cambodia','Indonesia','Laos','Malaysia','Myanmar','Philippines','Singapore','Thailand','Vietnam'
] as const;

export type AseanCountry = typeof ASEAN_COUNTRIES[number];

export const COUNTRY_CURRENCIES: Record<AseanCountry, string> = {
  Brunei: 'BND',
  Cambodia: 'KHR',
  Indonesia: 'IDR',
  Laos: 'LAK',
  Malaysia: 'MYR',
  Myanmar: 'MMK',
  Philippines: 'PHP',
  Singapore: 'SGD',
  Thailand: 'THB',
  Vietnam: 'VND',
};

export const PAYMENT_METHODS: Record<AseanCountry, string[]> = {
  Brunei: ['Cards','FPX','Bank Transfer'],
  Cambodia: ['Bakong','Cards','Bank Transfer'],
  Indonesia: ['GoPay','OVO','Dana','Virtual Account','Cards'],
  Laos: ['QR','Cards','Bank Transfer'],
  Malaysia: ['FPX','GrabPay','Cards','Bank Transfer'],
  Myanmar: ['KBZPay','WavePay','Cards'],
  Philippines: ['GCash','Maya','Bank Transfer','Cards'],
  Singapore: ['PayNow','GrabPay','Cards','Bank Transfer'],
  Thailand: ['PromptPay','LINE Pay','Cards','Bank Transfer'],
  Vietnam: ['MoMo','ZaloPay','Bank Transfer','Cards'],
};

export const TAX_RATES: Record<AseanCountry, { type: 'VAT' | 'GST'; rate: number }> = {
  Brunei: { type: 'GST', rate: 0 },
  Cambodia: { type: 'VAT', rate: 0.10 },
  Indonesia: { type: 'VAT', rate: 0.11 },
  Laos: { type: 'VAT', rate: 0.10 },
  Malaysia: { type: 'GST', rate: 0.06 },
  Myanmar: { type: 'VAT', rate: 0.05 },
  Philippines: { type: 'VAT', rate: 0.12 },
  Singapore: { type: 'GST', rate: 0.09 },
  Thailand: { type: 'VAT', rate: 0.07 },
  Vietnam: { type: 'VAT', rate: 0.10 },
};

export const LOGISTICS_PARTNERS: Record<AseanCountry, string[]> = {
  Brunei: ['DHL','Aramex'],
  Cambodia: ['J&T Express','DHL'],
  Indonesia: ['JNE','J&T Express','SiCepat','DHL'],
  Laos: ['DHL','EMS'],
  Malaysia: ['Pos Laju','J&T Express','DHL'],
  Myanmar: ['DHL','EMS'],
  Philippines: ['LBC','J&T Express','DHL'],
  Singapore: ['SingPost','Ninja Van','DHL'],
  Thailand: ['Thailand Post','Flash Express','Kerry','DHL'],
  Vietnam: ['VNPost','GHTK','Ninja Van','DHL'],
};

export const SHIPPING_BASE_RATES: Record<AseanCountry, number> = {
  Brunei: 8,
  Cambodia: 7,
  Indonesia: 6,
  Laos: 7,
  Malaysia: 5,
  Myanmar: 9,
  Philippines: 6,
  Singapore: 4,
  Thailand: 4,
  Vietnam: 5,
};
