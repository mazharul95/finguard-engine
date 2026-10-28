const { findAccount } = require('./accounts');

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

    sender.balance -= amount;
    receiver.balance += amount;

    const transactionId = `TXN-${String(ledger.length + 1).padStart(3, '0')}`;

    const rawJournalEntry = {
        id: transactionId,
        type: "TRANSFER",
        status: "APPROVED",
        timestamp: new Date().toISOString(),
        legs: [
            { accountId: fromId, type: "DEBIT", amount: amount },
            { accountId: toId, type: "CREDIT", amount: amount }
        ]
    };

    const totalDebits = rawJournalEntry.legs.filter(l => l.type === "DEBIT").reduce((s, l) => s + l.amount, 0);
    const totalCredits = rawJournalEntry.legs.filter(l => l.type === "CREDIT").reduce((s, l) => s + l.amount, 0);

    if (totalDebits !== totalCredits) {
        throw new Error("CRITICAL: Double-entry invariant violated!");
    }

    const frozenLegs = rawJournalEntry.legs.map(leg => Object.freeze({...leg}));
    const immutableEntry = Object.freeze({
        ...rawJournalEntry,
        legs: Object.freeze(frozenLegs)
    });

    ledger.push(immutableEntry);
    return immutableEntry;
}

function reverseDoubleEntryTransaction(accounts, ledger, originalTxnId) {
    const originalTxn = ledger.find(txn => txn.id === originalTxnId);

    if (!originalTxn) {
        return { success: false, reason: "Original transaction not found" };
    }

    if (originalTxn.status !== "APPROVED") {
        return { success: false, reason: "Only APPROVED transactions can be reversed" };
    }

    const alreadyReversed = ledger.some(txn => txn.type === "REVERSAL" && txn.originalTxnId === originalTxnId);
    if (alreadyReversed) {
        return { success: false, reason: "Transaction is already reversed" };
    }

    const senderLeg = originalTxn.legs.find(l => l.type === "DEBIT");
    const receiverLeg = originalTxn.legs.find(l => l.type === "CREDIT");

    const originalSender = findAccount(accounts, senderLeg.accountId);
    const originalReceiver = findAccount(accounts, receiverLeg.accountId);

    if (!originalSender || !originalReceiver) {
        return { success: false, reason: "Associated accounts not found for reversal" };
    }

    if (originalReceiver.balance < originalTxn.legs[0].amount) {
        return { success: false, reason: "Receiver has insufficient balance for reversal/refund" };
    }

    const amount = originalTxn.legs[0].amount;

    originalReceiver.balance -= amount;
    originalSender.balance += amount;

    const reversalTxnId = `TXN-${String(ledger.length + 1).padStart(3, '0')}`;

    const rawReversalEntry = {
        id: reversalTxnId,
        type: "REVERSAL",
        status: "APPROVED",
        originalTxnId: originalTxnId,
        timestamp: new Date().toISOString(),
        legs: [
            { accountId: originalReceiver.id, type: "DEBIT", amount: amount },
            { accountId: originalSender.id, type: "CREDIT", amount: amount }
        ]
    };

    const revDebits = rawReversalEntry.legs.filter(l => l.type === "DEBIT").reduce((s, l) => s + l.amount, 0);
    const revCredits = rawReversalEntry.legs.filter(l => l.type === "CREDIT").reduce((s, l) => s + l.amount, 0);

    if (revDebits !== revCredits) {
        throw new Error("CRITICAL: Reversal double-entry invariant violated!");
    }

    const frozenRevLegs = rawReversalEntry.legs.map(leg => Object.freeze({...leg}));
    const immutableReversalEntry = Object.freeze({
        ...rawReversalEntry,
        legs: Object.freeze(frozenRevLegs)
    });

    ledger.push(immutableReversalEntry);

    return {
        success: true,
        message: `Transaction ${originalTxnId} successfully reversed via ${reversalTxnId}`,
        reversalEntry: immutableReversalEntry
    };
}

// Payouts Logic: Move funds from internal account to external bank destination
function processPayout(accounts, ledger, fromAccountId, externalDestination, amount) {
    const sender = findAccount(accounts, fromAccountId);

    if (!sender) {
        return { status: "REJECTED", reason: "Internal source account not found" };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        return { status: "REJECTED", reason: "Invalid payout amount" };
    }

    if (sender.balance < amount) {
        return { status: "REJECTED", reason: "Insufficient balance for payout" };
    }

    if (!externalDestination || !externalDestination.accountNumber || !externalDestination.bankName) {
        return { status: "REJECTED", reason: "Invalid external bank destination details" };
    }

    // Deduct balance from internal account
    sender.balance -= amount;

    const payoutId = `POUT-${String(ledger.length + 1).padStart(3, '0')}`;

    const rawPayoutEntry = {
        id: payoutId,
        type: "PAYOUT",
        status: "APPROVED",
        externalDestination: {
            bankName: externalDestination.bankName,
            accountNumber: externalDestination.accountNumber,
            beneficiaryName: externalDestination.beneficiaryName
        },
        timestamp: new Date().toISOString(),
        legs: [
            { accountId: fromAccountId, type: "DEBIT", amount: amount },
            { accountId: `EXT-${externalDestination.accountNumber}`, type: "CREDIT", amount: amount, isExternal: true }
        ]
    };

    // Invariant check
    const totalDebits = rawPayoutEntry.legs.filter(l => l.type === "DEBIT").reduce((s, l) => s + l.amount, 0);
    const totalCredits = rawPayoutEntry.legs.filter(l => l.type === "CREDIT").reduce((s, l) => s + l.amount, 0);

    if (totalDebits !== totalCredits) {
        throw new Error("CRITICAL: Payout double-entry invariant violated!");
    }

    const frozenLegs = rawPayoutEntry.legs.map(leg => Object.freeze({...leg}));
    const immutablePayoutEntry = Object.freeze({
        ...rawPayoutEntry,
        legs: Object.freeze(frozenLegs)
    });

    ledger.push(immutablePayoutEntry);

    return {
        status: "APPROVED",
        payoutRecord: immutablePayoutEntry
    };
}

module.exports = {
    validateTransfer,
    processDoubleEntryTransfer,
    reverseDoubleEntryTransaction,
    processPayout
};