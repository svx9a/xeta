-- Use INSERT OR IGNORE to safely seed without failing on existing records
-- Seed Tenants
INSERT
    OR IGNORE INTO tenants (id, name, status)
VALUES ('tenant_01', 'XETA Main', 'ACTIVE');
-- Seed Merchants
INSERT
    OR IGNORE INTO merchants (id, tenant_id, name, status)
VALUES (
        'merchant_01',
        'tenant_01',
        'XETA Alpha',
        'ACTIVE'
    );
-- Seed Providers
INSERT
    OR IGNORE INTO providers (id, name, type)
VALUES ('PROMPT_PAY', 'PromptPay', 'BANK_TRANSFER');
INSERT
    OR IGNORE INTO providers (id, name, type)
VALUES ('LINE_PAY', 'LINE Pay', 'WALLET');
INSERT
    OR IGNORE INTO providers (id, name, type)
VALUES ('PAYPAL', 'PayPal', 'WALLET');
INSERT
    OR IGNORE INTO providers (id, name, type)
VALUES ('SCB_CC', 'SCB Credit Card (CC)', 'CREDIT_CARD');
INSERT
    OR IGNORE INTO providers (id, name, type)
VALUES (
        'SCB_IPP',
        'SCB Installment (IPP)',
        'INSTALLMENT'
    );
-- Seed Provider Accounts
INSERT
    OR IGNORE INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        fee_pct,
        fee_fixed,
        success_rate,
        active
    )
VALUES (
        'acc_pp_01',
        'merchant_01',
        'PROMPT_PAY',
        0.015,
        0.0,
        0.995,
        1
    );
INSERT
    OR IGNORE INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        fee_pct,
        fee_fixed,
        success_rate,
        active
    )
VALUES (
        'acc_lp_01',
        'merchant_01',
        'LINE_PAY',
        0.025,
        3.0,
        0.98,
        1
    );
INSERT
    OR IGNORE INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        fee_pct,
        fee_fixed,
        success_rate,
        active
    )
VALUES (
        'acc_pal_01',
        'merchant_01',
        'PAYPAL',
        0.035,
        11.0,
        0.96,
        1
    );
INSERT
    OR IGNORE INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        fee_pct,
        fee_fixed,
        success_rate,
        active
    )
VALUES (
        'acc_scb_01',
        'merchant_01',
        'SCB_CC',
        0.023,
        0.0,
        0.999,
        1
    );
-- Seed some LIVE Test Ticket Orders
INSERT
    OR IGNORE INTO ticket_orders (
        id,
        tenant_id,
        merchant_id,
        seat_zone,
        qty,
        price_thb,
        channel,
        status,
        created_at
    )
VALUES (
        'ORD-1001',
        'tenant_01',
        'merchant_01',
        'A1',
        1,
        12500.00,
        'Lumpini',
        'CAPTURED',
        '2026-03-09 10:00:00'
    );
INSERT
    OR IGNORE INTO ticket_orders (
        id,
        tenant_id,
        merchant_id,
        seat_zone,
        qty,
        price_thb,
        channel,
        status,
        created_at
    )
VALUES (
        'ORD-1002',
        'tenant_01',
        'merchant_01',
        'B2',
        2,
        45000.00,
        'Shopify',
        'CAPTURED',
        '2026-03-09 11:30:00'
    );
INSERT
    OR IGNORE INTO ticket_orders (
        id,
        tenant_id,
        merchant_id,
        seat_zone,
        qty,
        price_thb,
        channel,
        status,
        created_at
    )
VALUES (
        'ORD-1003',
        'tenant_01',
        'merchant_01',
        'C3',
        1,
        99.00,
        'Lazada',
        'PENDING',
        '2026-03-09 15:45:00'
    );
INSERT
    OR IGNORE INTO ticket_orders (
        id,
        tenant_id,
        merchant_id,
        seat_zone,
        qty,
        price_thb,
        channel,
        status,
        created_at
    )
VALUES (
        'ORD-1004',
        'tenant_01',
        'merchant_01',
        'VVIP',
        5,
        1500000.00,
        'Direct',
        'CAPTURED',
        '2026-03-08 20:00:00'
    );
INSERT
    OR IGNORE INTO ticket_orders (
        id,
        tenant_id,
        merchant_id,
        seat_zone,
        qty,
        price_thb,
        channel,
        status,
        created_at
    )
VALUES (
        'ORD-1005',
        'tenant_01',
        'merchant_01',
        'D4',
        1,
        88000.00,
        'Web',
        'CAPTURED',
        '2026-03-08 22:15:00'
    );