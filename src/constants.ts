import { Payment, ActivityLog, Payout, User } from './types';

// Get API base URL from environment, fallback to default
const defaultApiUrl = 'https://f7429329.xetapay-9jp.pages.dev';
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || defaultApiUrl;


export const NAV_LINKS = [
  { id: 'home', tKey: 'home', icon: 'HomeIcon' },
  { id: 'payments', tKey: 'payments', icon: 'CreditCardIcon' },
  { id: 'payouts', tKey: 'payouts', icon: 'PayoutsIcon' },
  { id: 'plugins', tKey: 'plugins', icon: 'PluginIcon' },
  { id: 'developer', tKey: 'developer', icon: 'CodeIcon' },
  { id: 'reports', tKey: 'reports', icon: 'ReportsIcon' },
  { id: 'settings', tKey: 'settings', icon: 'SettingsIcon' },
  { id: 'account', tKey: 'account', icon: 'UserIcon' },
  { id: 'routing', label: 'Routing Engine', icon: 'Zap' },
] as const;

export const NAV_GROUPS = [
  {
    title: 'Dashboard',
    items: [{ id: 'home', tKey: 'home' }],
  },
  {
    title: 'Network Overview',
    items: [
      { id: 'shipping_analytics', label: 'Logistics Intel' },
      { id: 'reports', tKey: 'reports' },
    ],
  },
  {
    title: 'Money',
    items: [{ id: 'payments', tKey: 'payments' }, { id: 'payouts', tKey: 'payouts' }],
  },
  {
    title: 'Analytics',
    items: [{ id: 'routing', label: 'Routing Engine' }],
  },
  {
    title: 'Developers',
    items: [{ id: 'plugins', tKey: 'plugins' }, { id: 'developer', label: 'API / Developer' }],
  },
  {
    title: 'Experience Preview',
    items: [{ id: 'checkout', label: 'Payment Gateway UX' }],
  },
  {
    title: 'System',
    items: [{ id: 'settings', tKey: 'settings' }, { id: 'account', tKey: 'account' }],
  },
] as const;

export const MOCK_PAYMENTS: Payment[] = [
  // captured (was succeeded)
  { id: 'pay_1', date: new Date().toISOString(), orderId: 'ORD-240721-001', amount: 1250.00, currency: 'THB', paymentMethod: 'credit_card', status: 'captured', customer: { name: 'Somchai Jaidee', email: 'somchai.j@example.com' }, card: { last4: '4242', brand: 'Visa' }, amountCapturable: 0, capturedAmount: 1250.00, amountRefundable: 1250.00, refundedAmount: 0, fulfillmentStatus: 'shipped', shippingMethod: 'Kerry Express', shippingAddress: '123 Sukhumvit Road, Bangkok', items: [{ id: 'it_1', name: 'XETA Core V1', quantity: 1, price: 1250, weight: 1.2 }] },
  // PromptPay payment
  { id: 'pay_8', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240722-002', amount: 450.00, currency: 'THB', paymentMethod: 'promptpay', status: 'captured', customer: { name: 'Wichai S.', email: 'wichai.s@example.com' }, card: { last4: '-', brand: 'PromptPay' }, amountCapturable: 0, capturedAmount: 450.00, amountRefundable: 450.00, refundedAmount: 0, fulfillmentStatus: 'unfulfilled', items: [{ id: 'it_2', name: 'Asset Key 9', quantity: 1, price: 450, weight: 0.1 }] },
  // Vietnam payment
  { id: 'pay_9', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240722-003', amount: 500000.00, currency: 'VND', paymentMethod: 'qr_code', status: 'captured', customer: { name: 'Nguyen Van A', email: 'nguyen.a@example.com' }, card: { last4: '-', brand: 'MoMo' }, amountCapturable: 0, capturedAmount: 500000.00, amountRefundable: 500000.00, refundedAmount: 0, fulfillmentStatus: 'shipped', shippingMethod: 'Viettel Post', items: [{ id: 'it_3', name: 'Global Token', quantity: 2, price: 250000, weight: 0.5 }] },
  // Indonesia payment
  { id: 'pay_10', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240721-004', amount: 150000.00, currency: 'IDR', paymentMethod: 'bank_transfer', status: 'captured', customer: { name: 'Budi Santoso', email: 'budi.s@example.com' }, card: { last4: '-', brand: 'BCA' }, amountCapturable: 0, capturedAmount: 150000.00, amountRefundable: 150000.00, refundedAmount: 0, fulfillmentStatus: 'unfulfilled', items: [{ id: 'it_4', name: 'ID Registry', quantity: 1, price: 150000, weight: 0.8 }] },
  // Malaysia payment
  { id: 'pay_11', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240720-006', amount: 120.00, currency: 'MYR', paymentMethod: 'credit_card', status: 'captured', customer: { name: 'Ahmad bin Ali', email: 'ahmad.a@example.com' }, card: { last4: '8888', brand: 'Mastercard' }, amountCapturable: 0, capturedAmount: 120.00, amountRefundable: 120.00, refundedAmount: 0, fulfillmentStatus: 'shipped', shippingMethod: 'J&T Express', items: [{ id: 'it_5', name: 'Cloud Node', quantity: 1, price: 120, weight: 0.3 }] },
  // New: authorized payment, ready to be captured or voided
  { id: 'pay_7', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240722-001', amount: 3500.00, currency: 'THB', paymentMethod: 'credit_card', status: 'authorized', customer: { name: 'Araya Sukhum', email: 'araya.s@example.com' }, card: { last4: '1111', brand: 'Mastercard' }, amountCapturable: 3500.00, capturedAmount: 0, amountRefundable: 0, refundedAmount: 0, fulfillmentStatus: 'unfulfilled', items: [{ id: 'it_6', name: 'Executive Suite', quantity: 1, price: 3500, weight: 2.0 }] },
  // New: partially refunded
  { id: 'pay_2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240721-002', amount: 890.50, currency: 'THB', paymentMethod: 'credit_card', status: 'partially_refunded', customer: { name: 'Jane Doe', email: 'jane.d@example.com' }, card: { last4: '1111', brand: 'Mastercard' }, amountCapturable: 0, capturedAmount: 890.50, amountRefundable: 490.50, refundedAmount: 400.00, fulfillmentStatus: 'unfulfilled', items: [{ id: 'it_7', name: 'Refurbished Unit', quantity: 1, price: 890, weight: 1.5 }] },
  // refunded
  { id: 'pay_3', date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240720-005', amount: 3200.00, currency: 'THB', paymentMethod: 'credit_card', status: 'refunded', customer: { name: 'Peter Jones', email: 'peter.j@example.com' }, card: { last4: '4242', brand: 'Visa' }, amountCapturable: 0, capturedAmount: 3200.00, amountRefundable: 0, refundedAmount: 3200.00, fulfillmentStatus: 'fulfilled', items: [{ id: 'it_8', name: 'Legacy Asset', quantity: 1, price: 3200, weight: 5.0 }] },
  // failed
  { id: 'pay_4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240720-004', amount: 500.00, currency: 'THB', paymentMethod: 'credit_card', status: 'failed', customer: { name: 'Manee Piti', email: 'manee.p@example.com' }, card: { last4: '0002', brand: 'Visa' }, amountCapturable: 0, capturedAmount: 0, amountRefundable: 0, refundedAmount: 0, items: [] },
  // captured (was succeeded)
  { id: 'pay_5', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240719-011', amount: 175.00, currency: 'THB', paymentMethod: 'credit_card', status: 'captured', customer: { name: 'John Smith', email: 'john.s@example.com' }, card: { last4: '4242', brand: 'Visa' }, amountCapturable: 0, capturedAmount: 175.00, amountRefundable: 175.00, refundedAmount: 0, fulfillmentStatus: 'unfulfilled', items: [{ id: 'it_9', name: 'Starter Pack', quantity: 1, price: 175, weight: 0.2 }] },
  // voided
  { id: 'pay_6', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), orderId: 'ORD-240718-008', amount: 5500.00, currency: 'THB', paymentMethod: 'credit_card', status: 'voided', customer: { name: 'Chujai Rakdee', email: 'chujai.r@example.com' }, card: { last4: '4242', brand: 'Visa' }, amountCapturable: 0, capturedAmount: 0, amountRefundable: 0, refundedAmount: 0, items: [] },
];

export const MOCK_CHART_DATA = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];


export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'log_2', event: 'payment.authorized', status: 'succeeded', orderId: 'ORD-240722-001', timestamp: '2024-07-22T10:00:00.000Z', description: 'Authorized ฿3500.00' },
  { id: 'log_6', event: 'payout.created', status: 'pending', orderId: '-', timestamp: '2024-07-22T08:00:00.000Z', description: 'Payout of ฿15,250.00 initiated.' },
  { id: 'log_1', event: 'payment.captured', status: 'succeeded', orderId: 'ORD-240721-001', timestamp: '2024-07-21T14:48:05.000Z', description: 'Captured ฿1250.00' },
  { id: 'log_3', event: 'refund.created', status: 'succeeded', orderId: 'ORD-240721-002', timestamp: '2024-07-21T12:35:00.000Z', description: 'Refunded ฿400.00' },
  { id: 'log_4', event: 'payment.failed', status: 'failed', orderId: 'ORD-240720-004', timestamp: '2024-07-20T09:05:00.000Z', description: 'Payment failed: Insufficient funds.' },
  { id: 'log_5', event: 'payment.voided', status: 'succeeded', orderId: 'ORD-240718-008', timestamp: '2024-07-18T11:22:00.000Z', description: 'Authorization for ฿5500.00 voided.' },
];

export const MOCK_PAYOUTS: Payout[] = [
  { id: 'po_1', date: '2024-07-15T10:00:00.000Z', amount: 15250.75, currency: 'THB', status: 'completed', destination: '******7890', transactionCount: 12 },
  { id: 'po_2', date: '2024-07-08T10:00:00.000Z', amount: 12100.00, currency: 'THB', status: 'completed', destination: '******7890', transactionCount: 9 },
  { id: 'po_3', date: '2024-07-01T10:00:00.000Z', amount: 18540.25, currency: 'THB', status: 'completed', destination: '******7890', transactionCount: 18 },
  { id: 'po_4', date: '2024-06-24T10:00:00.000Z', amount: 9870.50, currency: 'THB', status: 'completed', destination: '******7890', transactionCount: 7 },
];

export const MOCK_USER: User = {
  name: 'XETA Corp.',
  email: 'admin@xetapay.com',
  role: 'Provider Admin',
  avatar: 'X',
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};
