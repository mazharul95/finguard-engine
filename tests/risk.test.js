const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateRisk } = require('../src/risk');

test('risk evaluation allows normal low-value transactions', () => {
    const ledger = [];
    const accountId = "ACC-001";
    const amount = 5000;

    const result = evaluateRisk(ledger, accountId, amount);

    assert.equal(result.decision, 'ALLOW');
    assert.equal(result.riskScore, 0);
    assert.equal(result.reasons.length, 0);
});

test('risk evaluation triggers review for unusually large amounts', () => {
    const ledger = [];
    const accountId = "ACC-001";
    const amount = 60000;

    const result = evaluateRisk(ledger, accountId, amount);

    assert.equal(result.decision, 'REVIEW');
    assert.equal(result.riskScore, 50);
    assert.ok(result.reasons.includes("Unusually large transaction amount"));
});

test('risk evaluation flags high transaction velocity', () => {
    const ledger = [
        { id: "TXN-001", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 1000 }] },
        { id: "TXN-002", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 2000 }] },
        { id: "TXN-003", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 1500 }] }
    ];
    const accountId = "ACC-001";
    const amount = 2000;

    const result = evaluateRisk(ledger, accountId, amount);

    assert.equal(result.riskScore, 30);
    assert.equal(result.decision, 'ALLOW');
    assert.ok(result.reasons.includes("High transaction velocity detected"));
});

test('risk evaluation blocks transactions with combined high risk score', () => {
    const ledger = [
        { id: "TXN-001", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 1000 }] },
        { id: "TXN-002", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 2000 }] },
        { id: "TXN-003", legs: [{ accountId: "ACC-001", type: "DEBIT", amount: 1500 }] }
    ];
    const accountId = "ACC-001";
    const amount = 60000;

    const result = evaluateRisk(ledger, accountId, amount);

    assert.equal(result.riskScore, 80);
    assert.equal(result.decision, 'BLOCK');
    assert.equal(result.reasons.length, 2);
});