const test = require('node:test');
const assert = require('node:assert/strict');
const { processMultiCurrencyTransfer } = require('../src/fxTransfer');

test('multi-currency transfer correctly converts funds and maintains double-entry per currency', () => {
    const accounts = [
        { id: "ACC-USD", balance: 500, currency: "USD" },
        { id: "ACC-BDT", balance: 1000, currency: "BDT" }
    ];
    const ledger = [];

    // $100 USD -> BDT ট্রান্সফার
    const result = processMultiCurrencyTransfer(accounts, ledger, "ACC-USD", "ACC-BDT", 100, "USD", "BDT");

    assert.equal(result.status, "APPROVED");
    assert.equal(result.convertedAmount, 12000); // 100 * 120
    assert.equal(accounts[0].balance, 400);      // 500 - 100
    assert.equal(accounts[1].balance, 13000);    // 1000 + 12000

    // জার্নাল এন্ট্রির ইনভ্যারিয়েন্ট যাচাই
    const txn = result.transaction;
    const usdDebits = txn.legs.filter(l => l.currency === "USD" && l.type === "DEBIT").reduce((s, l) => s + l.amount, 0);
    const usdCredits = txn.legs.filter(l => l.currency === "USD" && l.type === "CREDIT").reduce((s, l) => s + l.amount, 0);
    assert.equal(usdDebits, usdCredits);

    const bdtDebits = txn.legs.filter(l => l.currency === "BDT" && l.type === "DEBIT").reduce((s, l) => s + l.amount, 0);
    const bdtCredits = txn.legs.filter(l => l.currency === "BDT" && l.type === "CREDIT").reduce((s, l) => s + l.amount, 0);
    assert.equal(bdtDebits, bdtCredits);
});