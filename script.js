"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LOGIN TEST

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const body = document.querySelector("body");
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// START: App Functionalities
const generateUserName = function (accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
generateUserName(accounts);

const showHistory = function (acc, sort = false) {
  containerMovements.textContent = "";
  const movs = sort ? acc.slice().sort((a, b) => a - b) : acc;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov.toFixed(2)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, cur) => accu + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;
};

const calcDisplaySumarry = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0); // Added 0 as initial value
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outs = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0); // Added 0 as initial value
  labelSumOut.textContent = `${Math.abs(outs).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0); // Added 0 as initial value

  labelSumInterest.textContent = `${interest.toFixed(3).padStart(6, "0")}€`;
};

const updateDashboard = function (acc) {
  showHistory(acc.movements);
  calcBalance(acc);
  calcDisplaySumarry(acc);
};
//END:

// START: User Login
let currentAccount;
const login = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => inputLoginUsername.value === acc.userName
  );
  if (currentAccount && Number(inputLoginPin.value) === currentAccount.pin) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateDashboard(currentAccount);
  }
};

btnLogin.addEventListener("click", login);
//END:

// START -  Transfer Money
const transfer = function (e) {
  e.preventDefault();
  let recepient = accounts.find(
    (acc) => inputTransferTo.value === acc.userName
  );
  let amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = "";
  if (accounts.map((acc) => acc.userName).includes(recepient?.userName)) {
    if (
      amount > 0 &&
      currentAccount.balance >= amount &&
      recepient?.userName !== currentAccount.userName
    ) {
      alertMessage(
        "success",
        `You have successfully sent <b>$ ${amount}</b> to <b>${recepient.owner}.</b>`
      );
      recepient?.movements.push(amount);
      currentAccount.movements.push(-amount);
      updateDashboard(currentAccount);
    } else if (amount > 0) {
      alertMessage("error", `Enter valid amount!`);
    } else if (currentAccount.balance >= amount) {
      alertMessage("error", `Insufficient Funds!`);
    } else if (recepient?.userName !== currentAccount.userName) {
      alertMessage("error", `You can't transfer money to yourself!`);
    }
  } else {
    alertMessage("error", `Invalid User!`);
  }

  // console.log(recepient, amount, recepient.movements, currentAccount.movements);
};

btnTransfer.addEventListener("click", transfer);
//END:

// START - Close Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
// END

// START - ALERT MESSAGE
const alertMessage = function (type, errormessage) {
  const html = `
      <div class="error-box">
      <img src="${
        type == "error" ? "error-alert.svg" : "success-alert.svg"
      }" alt="" />
      <p>
        ${errormessage}
      </p>
      <button class="form__btn dismiss__btn">Dismiss</button>
    </div>
    `;
  body.insertAdjacentHTML("afterbegin", html);
  containerApp.style.opacity = 0.3;
  document.querySelector(".error-box").style.opacity = 1000;
  document
    .querySelector(".dismiss__btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".error-box").style.display = "none";
      containerApp.style.opacity = 100;
    });
};
// END

// START - LOAN
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Math.floor(Number(inputLoanAmount.value));
  if (amount > 0) {
    if (currentAccount.movements.some((mov) => mov >= 0.1 * amount)) {
      alertMessage(
        "success",
        `You\'ve been granted a loan of <b>$ ${amount}</b>`
      );
      currentAccount.movements.push(amount);
      updateDashboard(currentAccount);
    } else {
      alertMessage(
        "error",
        "You don't have the capacity to take a loan of this amount"
      );
    }
  } else {
    alertMessage("error", "Enter valid amount!");
  }
  inputLoanAmount.value = "";
});
// END

//START
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  showHistory(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// ///////////////////////////////////////////////
/////////////////////////////////////////////////

/////////////////////////////////////////////////
