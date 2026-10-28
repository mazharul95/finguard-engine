const accounts = [
    { id: "ACC-001", balance: 8000 },
    { id: "ACC-002", balance: 5000 }
];

function findAccount(accounts, accountId) {
    return accounts.find(acc => acc.id === accountId);
}

// নতুন অ্যাকাউন্ট ডাইনামিকভাবে তৈরি করার ফাংশন
function createAccount(accounts, initialBalance = 0) {
    const newIdNum = accounts.length + 1;
    const newId = `ACC-${String(newIdNum).padStart(3, '0')}`;

    const newAccount = {
        id: newId,
        balance: initialBalance
    };

    accounts.push(newAccount);
    return newAccount;
}

module.exports = { accounts, findAccount, createAccount };

