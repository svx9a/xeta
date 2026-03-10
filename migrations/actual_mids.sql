-- Insert Actual Merchant IDs (MID) provided by merchant
INSERT INTO providers (id, name, type)
VALUES ('SCB_CC', 'SCB Credit Card (CC)', 'CREDIT_CARD');
INSERT INTO providers (id, name, type)
VALUES (
        'SCB_IPP',
        'SCB Installment (IPP)',
        'INSTALLMENT'
    );
INSERT INTO providers (id, name, type)
VALUES ('SCB_PGW', 'SCB Gateway (PGW)', 'GATEWAY');
INSERT INTO providers (id, name, type)
VALUES ('SCB_QR_CC', 'SCB QR Credit Card', 'QR_SCAN');
-- Link them to Merchant (merchant_01)
INSERT INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        credentials_ref,
        active
    )
VALUES (
        'acc_cc_01',
        'merchant_01',
        'SCB_CC',
        '010000000003869437',
        1
    );
INSERT INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        credentials_ref,
        active
    )
VALUES (
        'acc_ipp_01',
        'merchant_01',
        'SCB_IPP',
        '010000000006011382',
        1
    );
INSERT INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        credentials_ref,
        active
    )
VALUES (
        'acc_pgw_01',
        'merchant_01',
        'SCB_PGW',
        '014012024004153',
        1
    );
INSERT INTO provider_accounts (
        id,
        merchant_id,
        provider_id,
        credentials_ref,
        active
    )
VALUES (
        'acc_qrcc_01',
        'merchant_01',
        'SCB_QR_CC',
        '014000007538200',
        1
    );
-- General MID for the merchant core
UPDATE merchants
SET status = '010000000003869396'
WHERE id = 'merchant_01';
-- Using status or adding a field, but for now I'll just keep it in mind.
-- Update settlement rules
-- 시스템에서 "โอนเงินเข้าบัญชีอัตโนมัติในวันถัดไป" (T+1 Settlement)를 명시함
UPDATE merchants
SET settlement_bank = 'SCB Auto-Settlement (T+1)'
WHERE id = 'merchant_01';