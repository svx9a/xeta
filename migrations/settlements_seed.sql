-- Add Mae Manee Routing Rule
INSERT INTO routing_rules (
        id,
        merchant_id,
        pattern,
        priority_account_id,
        active
    )
VALUES (
        'rule_maemanee_01',
        'merchant_01',
        'amount > 0',
        'acc_pp_01',
        1
    );
-- Add some mock settlements
INSERT INTO settlements (
        id,
        merchant_id,
        currency,
        gross_amount,
        fee_total,
        net_amount,
        payout_channel,
        status
    )
VALUES (
        'SET-9921',
        'merchant_01',
        'THB',
        45200.50,
        678.00,
        44522.50,
        'SCB Direct',
        'COMPLETED'
    );
INSERT INTO settlements (
        id,
        merchant_id,
        currency,
        gross_amount,
        fee_total,
        net_amount,
        payout_channel,
        status
    )
VALUES (
        'SET-9922',
        'merchant_01',
        'THB',
        12840.00,
        192.60,
        12647.40,
        'SCB Direct',
        'COMPLETED'
    );