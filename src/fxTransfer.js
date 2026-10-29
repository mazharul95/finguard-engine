// src/fxTransfer.js
const { findAccount } = require('./accounts');

// সিমুলেটেড ফরেক্স রেট প্রোভাইডার
const EXCHANGE_RATES = {
    "USD_TO_BDT": 120.0,
    "BDT_TO_USD": 0.0083
};

function processMultiCurrencyTransfer(accounts, ledger, fromId, toId, sourceAmount, sourceCurrency, targetCurrency) {
    const sender = findAccount(accounts, fromId);
    const receiver = findAccount(accounts, toId);

    if (!sender || !receiver) {
        return { status: "REJECTED", reason: "Account not found" };
    }

    if (sender.balance < sourceAmount) {
        return { status: "REJECTED", reason: "Insufficient balance in source account" };
    }

    // ১. এক্সচেঞ্জ রেট হিসাব করা
    const rateKey = `${sourceCurrency}_TO_${targetCurrency}`;
    const exchangeRate = EXCHANGE_RATES[rateKey];

    if (!exchangeRate) {
        return { status: "REJECTED", reason: `Exchange rate not available for ${rateKey}` };
    }

    const convertedAmount = sourceAmount * exchangeRate;

    // ২. অ্যাকাউন্ট ব্যালেন্স আপডেট
    sender.balance -= sourceAmount;
    receiver.balance += convertedAmount;

    // ৩. জার্নাল এন্ট্রি তৈরি (Dual-Leg for Multi-Currency Balance)
    const transactionId = `FX-TXN-${String(ledger.length + 1).padStart(3, '0')}`;

    const rawJournalEntry = {
        id: transactionId,
        type: "FX_TRANSFER",
        status: "APPROVED",
        exchangeRate,
        timestamp: new Date().toISOString(),
        legs: [
            // Sender Leg (Source Currency)
            { accountId: fromId, type: "DEBIT", amount: sourceAmount, currency: sourceCurrency },
            { accountId: `FX_CLEARING_${sourceCurrency}`, type: "CREDIT", amount: sourceAmount, currency: sourceCurrency },

            // Receiver Leg (Target Currency)
            { accountId: `FX_CLEARING_${targetCurrency}`, type: "DEBIT", amount: convertedAmount, currency: targetCurrency },
            { accountId: toId, type: "CREDIT", amount: convertedAmount, currency: targetCurrency }
        ]
    };

    // ৪. ইমিউটেবিলিটি নিশ্চিত করা
    const frozenLegs = rawJournalEntry.legs.map(leg => Object.freeze({ ...leg }));
    const immutableEntry = Object.freeze({
        ...rawJournalEntry,
        legs: Object.freeze(frozenLegs)
    });

    ledger.push(immutableEntry);

    return {
        status: "APPROVED",
        convertedAmount,
        exchangeRate,
        transaction: immutableEntry
    };
}

module.exports = { processMultiCurrencyTransfer };