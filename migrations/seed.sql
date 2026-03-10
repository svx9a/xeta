-- Seed Tenants
INSERT INTO tenants (id, name, status)
VALUES ('tenant_01', 'XETA Main', 'ACTIVE');
-- Seed Merchants
INSERT INTO merchants (id, tenant_id, name, status)
VALUES (
        'merchant_01',
        'tenant_01',
        'XETA Alpha',
        'ACTIVE'
    );
-- Seed Providers
INSERT INTO providers (id, name, type)
VALUES ('PROMPT_PAY', 'PromptPay', 'BANK_TRANSFER');
INSERT INTO providers (id, name, type)
VALUES ('LINE_PAY', 'LINE Pay', 'WALLET');
INSERT INTO providers (id, name, type)
VALUES ('PAYPAL', 'PayPal', 'WALLET');
-- Seed Provider Accounts
INSERT INTO provider_accounts (
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
INSERT INTO provider_accounts (
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
INSERT INTO provider_accounts (
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