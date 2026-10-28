function evaluateRisk(ledger, accountId, amount) {
    let riskScore = 0;
    const reasons = [];

    // ১. Amount Anomaly Check (যেমন: ৫০,০০০ টাকার বেশি হলে হাই রিস্ক)
    if (amount > 50000) {
        riskScore += 50;
        reasons.push("Unusually large transaction amount");
    }

    // ২. Velocity Check (অ্যাকাউন্ট থেকে সাম্প্রতিক ট্রানজেকশনের সংখ্যা গণনা)
    const recentTxns = ledger.filter(txn => {
        if (!txn.legs) return false;
        return txn.legs.some(leg => leg.accountId === accountId && leg.type === "DEBIT");
    });

    if (recentTxns.length >= 3) {
        riskScore += 30;
        reasons.push("High transaction velocity detected");
    }

    // ৩. রিস্ক ডিসিশন নির্ধারণ
    let decision = "ALLOW";
    if (riskScore >= 50 && riskScore < 80) {
        decision = "REVIEW"; // ম্যানুয়াল রিভিউ কিউতে পাঠানো হবে
    } else if (riskScore >= 80) {
        decision = "BLOCK";  // সরাসরি ব্লক করা হবে
    }

    return {
        riskScore,
        decision,
        reasons
    };
}

module.exports = { evaluateRisk };