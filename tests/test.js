const { accounts, createAccount } = require('../src/accounts');
const { ledger, getTransactionsByAccount } = require('../src/ledger');
const { processDoubleEntryTransfer } = require('../src/transfer');

console.log("--- 1. Account Creation Test ---");
const newAcc = createAccount(accounts, 3000);
console.log("New Account Created:", newAcc);
console.log("All Accounts:", accounts);

console.log("\n--- 2. Double-Entry Transfer Test ---");
const transferResult = processDoubleEntryTransfer(accounts, ledger, "ACC-001", "ACC-003", 2000);
console.log("Transfer Result:", JSON.stringify(transferResult, null, 2));

console.log("\n--- 3. Updated Accounts State ---");
console.log("Accounts:", accounts);

console.log("\n--- 4. Ledger History ---");
console.log("Ledger:", JSON.stringify(ledger, null, 2));