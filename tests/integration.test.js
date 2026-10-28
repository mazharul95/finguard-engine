const test = require('node:test');
const assert = require('node:assert/strict');
const { createAccount } = require('../src/accounts');
const { processDoubleEntryTransfer, processPayout } = require('../src/transfer');
const { evaluateRisk } = require('../src/risk');
const { IdempotencyManager } = require('../src/idempotency');
const { reconcileLedger } = require('../src/reconciliation');

test('fintech backend end-to-end integration flow passes all checks', () => {
    const accounts = [];
    const ledger = [];
    const idempotencyManager = new IdempotencyManager();

    const acc1 = createAccount(accounts, 10000);
    const acc2 = createAccount(accounts, 5000);

    assert.equal(acc1.id, "ACC-001");
    assert.equal(acc2.id, "ACC-002");

    const transferKey = "txn-key-001";
    const transferAttempt = idempotencyManager.execute(transferKey, () => {
        const risk = evaluateRisk(ledger, acc1.id, 2000);
        assert.equal(risk.decision, "ALLOW");

        return processDoubleEntryTransfer(accounts, ledger, acc1.id, acc2.id, 2000);
    });

    assert.equal(transferAttempt.isCached, false);
    assert.equal(transferAttempt.result.status, "APPROVED");
    assert.equal(acc1.balance, 8000);
    assert.equal(acc2.balance, 7000);

    const retryAttempt = idempotencyManager.execute(transferKey, () => {
        return processDoubleEntryTransfer(accounts, ledger, acc1.id, acc2.id, 2000);
    });

    assert.equal(retryAttempt.isCached, true);
    assert.equal(acc1.balance, 8000);

    const payoutResult = processPayout(accounts, ledger, acc2.id, {
        bankName: "Global City Bank",
        accountNumber: "987654321",
        beneficiaryName: "John Doe"
    }, 1500);

    assert.equal(payoutResult.status, "APPROVED");
    assert.equal(acc2.balance, 5500);

    const reconReport = reconcileLedger(accounts, ledger);
    assert.equal(reconReport.isBalanced, true);
    assert.equal(reconReport.discrepancies.length, 0);
});