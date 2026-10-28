const { findAccount } = require('../src/accounts');

function validateTransfer(accounts, fromId, toId, amount) {
    const sender = findAccount(accounts, fromId);
    const receiver = findAccount(accounts, toId);

    if (!sender || !receiver) {
        return { valid: false, reason: "Account not found" };
    }

    if (fromId === toId) {
        return { valid: false, reason: "Cannot transfer to the same account" };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return { valid: false, reason: "Invalid transfer amount" };
    }

    if (sender.balance < amount) {
        return { valid: false, reason: "Insufficient balance" };
    }

    return { valid: true, sender, receiver };
}

function processDoubleEntryTransfer(accounts, ledger, fromId, toId, amount) {
    const validation = validateTransfer(accounts, fromId, toId, amount);

    if (!validation.valid) {
        return {
            status: "REJECTED",
            reason: validation.reason
        };
    }

    const { sender, receiver } = validation;

    // অ্যাকাউন্ট ব্যালেন্স আপডেট
    sender.balance -= amount;
    receiver.balance += amount;

    const transactionId = `TXN-${String(ledger.length + 1).padStart(3, '0')}`;

    // ডাবল-এন্ট্রি জার্নাল এন্ট্রি তৈরি (Debit & Credit Legs)
    const journalEntry = {
        id: transactionId,
        status: "APPROVED",
        timestamp: new Date().toISOString(),
        legs: [
            { accountId: fromId, type: "CREDIT", amount: amount },
            { accountId: toId, type: "DEBIT", amount: amount }
        ]
    };

    // ডাবল-এন্ট্রি ইনভ্যারিয়েন্ট চেক: Total Debits === Total Credits
    const totalDebits = journalEntry.legs
        .filter(leg => leg.type === "DEBIT")
        .reduce((sum, leg) => sum + leg.amount, 0);

    const totalCredits = journalEntry.legs
        .filter(leg => leg.type === "CREDIT")
        .reduce((sum, leg) => sum + leg.amount, 0);

    if (totalDebits !== totalCredits) {
        throw new Error("CRITICAL: Double-entry invariant violated! Debits must equal Credits.");
    }

    ledger.push(journalEntry);

    return journalEntry;
}

module.exports = {
    validateTransfer,
    processDoubleEntryTransfer
};