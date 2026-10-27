// const accounts = [
//     { id: "ACC-001", balance: 10000 },
//     { id: "ACC-002", balance: 5000 }
// ];

// // নির্দিষ্ট অ্যাকাউন্ট খুঁজে বের করার হেল্পার ফাংশন
// function findAccount(accounts, accountId) {
//     return accounts.find(acc => acc.id === accountId);
// }

// // ট্রান্সফার ভ্যালিডেশন ফাংশন
// function validateTransfer(accounts, fromId, toId, amount) {
//   const sender = findAccount(accounts, fromId);
//   const receiver = findAccount(accounts, toId);

//   // ১. Sender বা Receiver অ্যাকাউন্ট না পাওয়া গেলে reject করা
//   if (!sender || !receiver) {
//     return "REJECTED";
//   }

//   // ২. Amount শূন্য বা negative হলে reject করা
//   if (amount <= 0) {
//     return "REJECTED";
//   }

//   // ৩. Sender-এর balance যথেষ্ট না হলে (transfer amount থেকে কম হলে) reject করা
//   if (sender.balance < amount) {
//     return "REJECTED";
//   }

//   // ৪. সব শর্ত ঠিক থাকলে "APPROVED" return করা
//   return "APPROVED";
// }


// // টেস্ট ১: ACC-001 থেকে ACC-002 এ 2500 টাকা ট্রান্সফার
// console.log(validateTransfer(accounts, "ACC-001", "ACC-002", 2500)); 
// // Expected: APPROVED

// // টেস্ট ২: ACC-001 থেকে অস্তিত্বহীন অ্যাকাউন্ট ACC-999 এ 2500 টাকা ট্রান্সফার
// console.log(validateTransfer(accounts, "ACC-001", "ACC-999", 2500)); 
// // Expected: REJECTED

// // টেস্ট ৩: ACC-002 থেকে ACC-001 এ 6000 টাকা ট্রান্সফার (যেহেতু ACC-002 এর ব্যালেন্স 5000, তাই অপর্যাপ্ত ব্যালেন্স)
// console.log(validateTransfer(accounts, "ACC-002", "ACC-001", 6000)); 
// // Expected: REJECTED

const accounts = [
    { id: "ACC-001", balance: 8000 },
    { id: "ACC-002", balance: 5000 }
];

const ledger = [];

function findAccount(accounts, accountId) {
    return accounts.find(acc => acc.id === accountId);
}

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

function processTransfer(accounts, ledger, fromId, toId, amount) {
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

    const transactionRecord = {
        id: transactionId,
        status: "APPROVED",
        amount: amount,
        from: fromId,
        to: toId,
        timestamp: new Date().toISOString()
    };
    
    ledger.push(transactionRecord);

    return transactionRecord;
}

// --- Clean Test Executions ---

console.log("--- Test 1: Successful Transfer ---");
console.log(processTransfer(accounts, ledger, "ACC-001", "ACC-002", 2000));
console.log("Updated Accounts:", accounts);

console.log("\n--- Test 2: Invalid Amount & Security Tests ---");
console.log("Zero Amount:", processTransfer(accounts, ledger, "ACC-001", "ACC-002", 0));
console.log("Negative Amount:", processTransfer(accounts, ledger, "ACC-001", "ACC-002", -500));
console.log("NaN Amount:", processTransfer(accounts, ledger, "ACC-001", "ACC-002", NaN));
console.log("Infinity Amount:", processTransfer(accounts, ledger, "ACC-001", "ACC-002", Infinity));
console.log("String Amount:", processTransfer(accounts, ledger, "ACC-001", "ACC-002", "1000"));

console.log("\n--- Final System State ---");
console.log("Accounts:", accounts);
console.log("Ledger History:", ledger);

// Balance invariant check
const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0
);

console.log("Total Balance:", totalBalance);
console.log("Expected Total Balance:", 13000);
console.log("Balance Invariant:", totalBalance === 13000);

// Ledger check
console.log("Ledger Count:", ledger.length);
console.log("Ledger Check:", ledger.length === 1);