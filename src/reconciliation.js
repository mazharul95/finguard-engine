// src/reconciliation.js

function reconcileLedger(accounts, ledger) {
    const discrepancies = [];
    let totalSystemDebits = 0;
    let totalSystemCredits = 0;

    // ১. প্রতিটি ট্রানজেকশনের নিজস্ব ডেবিট ও ক্রেডিট লেগ সমান আছে কি না এবং গ্লোবাল সাম চেক
    ledger.forEach(txn => {
        if (!txn.legs) return;

        const txnDebits = txn.legs
            .filter(l => l.type === "DEBIT")
            .reduce((sum, l) => sum + l.amount, 0);

        const txnCredits = txn.legs
            .filter(l => l.type === "CREDIT")
            .reduce((sum, l) => sum + l.amount, 0);

        totalSystemDebits += txnDebits;
        totalSystemCredits += txnCredits;

        if (txnDebits !== txnCredits) {
            discrepancies.push({
                type: "TXN_IMBALANCE",
                transactionId: txn.id,
                message: `Transaction ${txn.id} legs are imbalanced. Debits: ${txnDebits}, Credits: ${txnCredits}`
            });
        }
    });

    // ২. সিস্টেমের গ্লোবাল ডেবিট ও ক্রেডিট সমান কি না চেক করা
    if (totalSystemDebits !== totalSystemCredits) {
        discrepancies.push({
            type: "GLOBAL_SYSTEM_IMBALANCE",
            message: `Global ledger imbalance detected! Total Debits: ${totalSystemDebits}, Total Credits: ${totalSystemCredits}`
        });
    }

    return {
        isBalanced: discrepancies.length === 0,
        totalSystemDebits,
        totalSystemCredits,
        discrepancies
    };
}

module.exports = { reconcileLedger };