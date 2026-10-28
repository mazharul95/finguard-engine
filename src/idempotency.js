// src/idempotency.js

class IdempotencyManager {
    constructor() {
        // প্রোডাকশনে এটি Redis বা ডেটাবেস টেবিল (Unique constraint সহ) হতে পারে
        this.store = new Map();
    }

    execute(idempotencyKey, operationHandler) {
        if (!idempotencyKey) {
            // যদি কি না থাকে, সরাসরি অপারেশন রান করবে
            return {
                isCached: false,
                result: operationHandler()
            };
        }

        // যদি পূর্বে একই কি দিয়ে রিকোয়েস্ট এসে থাকে, ক্যাশড রেসপন্স রিটার্ন করুন
        if (this.store.has(idempotencyKey)) {
            return {
                isCached: true,
                result: this.store.get(idempotencyKey)
            };
        }

        // নতুন রিকোয়েস্ট হলে অপারেশন সম্পন্ন করে ফলাফল সেভ করে রাখুন
        const result = operationHandler();
        this.store.set(idempotencyKey, result);

        return {
            isCached: false,
            result
        };
    }
}

module.exports = { IdempotencyManager };