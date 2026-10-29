const crypto = require('crypto');

function generateWebhookSignature(payload, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');
}

async function sendWebhookNotification(endpointUrl, eventPayload, secretKey) {
    const signature = generateWebhookSignature(eventPayload, secretKey);

    const webhookMessage = {
        eventId: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: eventPayload.type || "TRANSACTION_COMPLETED",
        data: eventPayload
    };

    try {
        // প্রোডাকশনে এখানে fetch() ব্যবহার করে এক্সটার্নাল ইউআরএলে রিকোয়েস্ট পাঠানো হবে
        console.log(`[WEBHOOK] Dispatched to ${endpointUrl}`);
        console.log(`[SIGNATURE] X-Fintech-Signature: ${signature}`);
        console.log(`[PAYLOAD]:`, JSON.stringify(webhookMessage, null, 2));

        return {
            success: true,
            signature,
            payload: webhookMessage
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { generateWebhookSignature, sendWebhookNotification };