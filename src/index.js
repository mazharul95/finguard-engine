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



// 3 //এবার তোমার code-এ এমন একটি function লেখো, যা transfer-এর amount এবং account balance যাচাই করে একটি status object return করবে.
const appName = "Financial Risk Engine";
const developer = "Mazharul Islam";

const account= {
    id: "ACC-001",
    owner: "Mazharul Islam",
    balance: 10000,
    currency: "BDT",
}

const transfer = {
    from: "ACC-001",
    to: "ACC-002",
    amount: 15000,
    status: "PENDING",
}

function checkTransferStatus(amount, balance) {
  if (amount <= 0) {
    return {
      success: false,
      status: "REJECTED",
      reason: "INVALID_AMOUNT"
    };
  }

    if (amount > balance ) {
    return {
      success: false,
      status: "REJECTED",
      reason: "INSUFFICIENT_BALANCE"
    };
  } 
    return {
      success: true,
      status: "APPROVED",
      reason: "TRANSFER_ALLOWED"
    };

}

console.log("App Name:", appName);
console.log("Developer:", developer);
console.log("Account id:", account.id);
console.log("Account balance:", account.balance);

const result = checkTransferStatus(15000, -100);
console.log("Transfer Status:", result);




