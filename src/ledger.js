const ledger = [];

// নির্দিষ্ট অ্যাকাউন্টের লেনদেন ফিল্টার বা সার্চ করার ফাংশন
function getTransactionsByAccount(ledger, accountId) {
    return ledger.filter(txn => txn.from === accountId || txn.to === accountId);
}

module.exports = { ledger, getTransactionsByAccount };