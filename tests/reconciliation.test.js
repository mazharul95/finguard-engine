const test = require('node:test');
const assert = require('node:assert/strict');
const { reconcileLedger } = require('../src/reconciliation');

test('reconciliation passes for balanced ledger entries', () => {
    const accounts = [
        { id: "ACC-001", balance: 5000 },
        { id: "ACC-002", balance: 5000 }
    ];

    const ledger = [
        {
            id: "TXN-001",
            status: "APPROVED",
            legs: [
                { accountId: "ACC-001", type: "DEBIT", amount: 1000 },
                { accountId: "ACC-002", type: "CREDIT", amount: 1000 }
            ]
        }
    ];

    const report = reconcileLedger(accounts, ledger);

    assert.equal(report.isBalanced, true);
    assert.equal(report.totalSystemDebits, 1000);
    assert.equal(report.totalSystemCredits, 1000);
    assert.equal(report.discrepancies.length, 0);
});

test('reconciliation detects discrepancy if ledger legs are tampered or imbalanced', () => {
    const accounts = [
        { id: "ACC-001", balance: 5000 }
    ];

    const ledger = [
        {
            id: "TXN-CORRUPT",
            status: "APPROVED",
            legs: [
                { accountId: "ACC-001", type: "DEBIT", amount: 2000 },
                { accountId: "ACC-002", type: "CREDIT", amount: 1000 }
            ]
        }
    ];

    const report = reconcileLedger(accounts, ledger);

    assert.equal(report.isBalanced, false);
    assert.equal(report.discrepancies.length, 1);
    assert.equal(report.discrepancies[0].type, "TXN_IMBALANCE");
});