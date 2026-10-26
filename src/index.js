//1  // const projectName = "Financial Risk Engine";

// const account = {
//   id: "ACC-001",
//   owner: "Mazharul Islam",
//   balance:10000,
//   currency: "BDT",
// };


// const transfer = {
//      from: "ACC-001",
//      to: "ACC-002",
//      amount: 5000,
//      status: "PENDING",
// }


// function validateTransfer(amount, balance) {
//     if (amount <= 0) {
//         return "INVALID_AMOUNT";
//     }
    
//     if (amount > balance ){
//         return "Insufficient funds for the transfer.";  
//     }
//     return "VALID_TRANSFER";
// }

// console.log("Project:", projectName);
// console.log("Account:", account);
// console.log("Transfer:", transfer);
// console.log(
//   "Validation:",
//   validateTransfer(transfer.amount, account.balance)
// );



//2 // const appName = "Financial Risk Engine";
// const developer = "Mazharul Islam";

// const account1 ={
//     id: "ACC-001",
//     owner: "Mazharul Islam",
//     balance: 10000,
//     currency: "BDT",
// }

// function checkBalance(balance) {
//   if (balance >= 5000) {
//     return "Sufficient Balance";
//   } else {
//     return "Low Balance";
//   }
// }


// console.log("App Name:", appName);
// console.log("Developer:", developer);
// console.log("Account id:", account1.id);
// console.log("Account balance:", account1.balance);
// console.log(checkBalance(2000));



// 3 //Now write a function in your code that validates the transfer amount and account balance, and returns a status object."
// const appName = "Financial Risk Engine";
// const developer = "Mazharul Islam";

// const account= {
//     id: "ACC-001",
//     owner: "Mazharul Islam",
//     balance: 10000,
//     currency: "BDT",
// }

// const transfer = {
//     from: "ACC-001",
//     to: "ACC-002",
//     amount: 15000,
//     status: "PENDING",
// }

// function checkTransferStatus(amount, balance) {
//   if (amount <= 0) {
//     return {
//       success: false,
//       status: "REJECTED",
//       reason: "INVALID_AMOUNT"
//     };
//   }

//     if (amount > balance ) {
//     return {
//       success: false,
//       status: "REJECTED",
//       reason: "INSUFFICIENT_BALANCE"
//     };
//   } 
//     return {
//       success: true,
//       status: "APPROVED",
//       reason: "TRANSFER_ALLOWED"
//     };

// }

// console.log("App Name:", appName);
// console.log("Developer:", developer);
// console.log("Account id:", account.id);
// console.log("Account balance:", account.balance);

// const result = checkTransferStatus(15000, -100);
// console.log("Transfer Status:", result);



//Day 2 — JavaScript Objects, Arrays & Functions


//In a financial system, there can be many accounts. So we will use an array.
const accounts = [
  {
    id: "ACC-001",
    owner: "Mazharul Islam",
    balance: 10000,
    currency: "BDT",
  },
  
  {
    id: "ACC-002",
    owner: "John Doe",
    balance: 5000,
    currency: "BDT",
  },
  
  {
    id: "ACC-003",
    owner: "John Smith",
    balance: 3000,
    currency: "BDT",
  },
  {
    id: "ACC-004",
    owner: "Jack  Daniels",
    balance: 1500,
    currency: "BDT",
  }
];    

// console.log("Total accounts:", accounts.length);
// console.log("First account:", accounts[0]);
// console.log("Second account ID:", accounts[1].id);
// console.log("Third account ID:", accounts[2].id);


//Step 2 — find() দিয়ে account খোঁজো

function findAccount(accounts,accountId) {
  return accounts.find((account) => account.id === accountId);
}
// console.log(findAccount("ACC-001"));
// console.log(findAccount("ACC-002"));
// console.log(findAccount("ACC-003"));


// Step 3 — map() দিয়ে account list দেখাও

const accountIds = accounts.map((account) => {
  return {
    id:account.id,
    owner:account.owner,
    balance:account.balance,
  }
});

// console.log("Account List:", accountIds);



//Step 4 — filter() দিয়ে rejected transactions বের করো

const transactions = [
  {
    id: "TXN-001",
    amount: 5000,
    status: "APPROVED",
  },
  {
    id: "TXN-002",
    amount: 10000,
    status: "REJECTED",
  },
   {
    id: "TXN-003",
    amount: 1000,
    status: "APPROVED",
  },
  {
    id: "TXN-004",
    amount: 20000,
    status: "REJECTED",
  },
  {
    id: "TXN-005",
    amount: 25000,
    status: "REJECTED",
  },
  {
    id: "TXN-006",
    amount: 21000,
    status: "REJECTED",
  },
];

const rejectedTransactions = transactions.filter((transaction) => transaction.status === "REJECTED");
// console.log("Rejected Transactions:", rejectedTransactions);
// console.log("Total Rejected Transactions:", rejectedTransactions.length);



//Problem 1.Account SearchfindAccount() দিয়ে ACC-003 খুঁজে তার owner-এর নাম print করো।
// Solution: 

//An array holding account data along with the owner's name
const systemAccounts = [
    { id: "ACC-001", owner: "Masum Ahmed", balance: 5000 },
    { id: "ACC-002", owner: "Mazharul islam", balance: 1200 },
    { id: "ACC-003", owner: "Mahirul Arham", balance: 3500 }
];

// নির্দিষ্ট অ্যাকাউন্ট খুঁজে বের করার ফাংশন
function findAccount(accounts, accountId) {
    return accounts.find(acc => acc.id === accountId);
}

// ACC-003 অ্যাকাউন্টটি খোঁজা হচ্ছে
const targetAccount = findAccount(systemAccounts, "ACC-003");

// ফলাফল প্রিন্ট করা
if (targetAccount) {
    console.log(`Account Owner: ${targetAccount.owner}`);
} else {
    console.log("Account not found.");
}

//02. Calculate the total balance of all accounts using reduce().
const totalBalance = accounts.reduce( (total, account) =>{
  return total + account.balance;
}, 

0 
);
console.log("Total balance:", totalBalance);

// 03 Filter out and create a new array containing only the APPROVED transactions.
const approvedTransactions = transactions.filter((transaction) => transaction.status === "APPROVED");
 console.log("Approved Transactions:", approvedTransactions);
 console.log("Total Approved Transactions:", approvedTransactions.length);