export type Page = 
  'home' | 
  'payments' | 
  'quotation' |
  'payouts' |
  'integrations' |
  'developer' | 
  'reports' |
  'settings' |
  'account';

// Updated to match Shopify's payment lifecycle
export type PaymentStatus = 'authorized' | 'captured' | 'refunded' | 'partially_refunded' | 'voided' | 'failed';

export type PaymentMethod = 'credit_card' | 'promptpay' | 'qr_code' | 'bank_transfer';

export interface Payment {
    id: string;
    date: string;
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    risk?: 'Low' | 'Medium' | 'High' | null;
    riskReason?: string;
    status: PaymentStatus;
    customer: {
        name: string;
        email: string;
    };
    card: {
        last4: string;
        brand: string;
    };
    // New fields for capture/refund management
    amountCapturable: number;
    amountRefundable: number;
    capturedAmount: number;
    refundedAmount: number;
}

export type ActivityLogStatus = 'succeeded' | 'failed' | 'pending';

export interface ActivityLog {
  id: string;
  event: string;
  status: ActivityLogStatus;
  orderId: string;
  timestamp: string;
  description: string;
}

export type PayoutStatus = 'completed' | 'in_transit' | 'pending' | 'failed';

export interface Payout {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  destination: string;
  transactionCount: number;
}

export interface User {
  name: string;
  email: string;
  role: 'Provider Admin' | 'Developer';
  avatar: string;
  lastLogin: string;
}