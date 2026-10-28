const test = require('node:test');
const assert = require('node:assert/strict');
const { IdempotencyManager } = require('../src/idempotency');

test('idempotency manager caches response and prevents duplicate execution on retry', () => {
    const manager = new IdempotencyManager();
    const key = "idempotency-key-abc-123";

    let executionCount = 0;
    const mockPaymentHandler = () => {
        executionCount++;
        return { status: "APPROVED", transactionId: "TXN-999", amount: 1000 };
    };

    const firstAttempt = manager.execute(key, mockPaymentHandler);
    assert.equal(firstAttempt.isCached, false);
    assert.equal(firstAttempt.result.status, "APPROVED");
    assert.equal(executionCount, 1);

    const secondAttempt = manager.execute(key, mockPaymentHandler);
    assert.equal(secondAttempt.isCached, true);
    assert.equal(secondAttempt.result.transactionId, "TXN-999");
    assert.equal(executionCount, 1);
});