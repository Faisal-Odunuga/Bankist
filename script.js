'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LOGIN TEST

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const body = document.querySelector('body');
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// START: App Functionalities
const generateUserName = function (accounts) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
generateUserName(accounts);

const showHistory = function (acc, sort = false) {
  containerMovements.textContent = '';
  const movs = sort ? acc.slice().sort((a, b) => a - b) : acc;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
     <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov.toFixed(2)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
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

  labelSumInterest.textContent = `${interest
    .toFixed(3)
    .padStart(6, '0')
    .toFixed(2)}€`;
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
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateDashboard(currentAccount);
  }
};

btnLogin.addEventListener('click', login);
//END:

// START -  Transfer Money
const transfer = function (e) {
  e.preventDefault();
  let recepient = accounts.find(
    (acc) => inputTransferTo.value === acc.userName
  );
  let amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';
  if (accounts.map((acc) => acc.userName).includes(recepient?.userName)) {
    if (
      amount > 0 &&
      currentAccount.balance >= amount &&
      recepient?.userName !== currentAccount.userName
    ) {
      alertMessage(
        'success',
        `You have successfully sent <b>$ ${amount}</b> to <b>${recepient.owner}.</b>`
      );
      recepient?.movements.push(amount);
      currentAccount.movements.push(-amount);
      updateDashboard(currentAccount);
    } else if (amount > 0) {
      alertMessage('error', `Enter valid amount!`);
    } else if (currentAccount.balance >= amount) {
      alertMessage('error', `Insufficient Funds!`);
    } else if (recepient?.userName !== currentAccount.userName) {
      alertMessage('error', `You can't transfer money to yourself!`);
    }
  } else {
    alertMessage('error', `Invalid User!`);
  }

  // console.log(recepient, amount, recepient.movements, currentAccount.movements);
};

btnTransfer.addEventListener('click', transfer);
//END:

// START - Close Account
btnClose.addEventListener('click', function (e) {
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
  inputCloseUsername.value = inputClosePin.value = '';
});
// END

// START - ALERT MESSAGE
const alertMessage = function (type, errormessage) {
  const html = `
      <div class="error-box">
      <img src="${
        type == 'error' ? 'error-alert.svg' : 'success-alert.svg'
      }" alt="" />
      <p>
        ${errormessage}
      </p>
      <button class="form__btn dismiss__btn">Dismiss</button>
    </div>
    `;
  body.insertAdjacentHTML('afterbegin', html);
  containerApp.style.opacity = 0.3;
  document.querySelector('.error-box').style.opacity = 1000;
  document
    .querySelector('.dismiss__btn')
    .addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.error-box').style.display = 'none';
      containerApp.style.opacity = 100;
    });
};
// END

// START - LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Math.floor(Number(inputLoanAmount.value));
  if (amount > 0) {
    if (currentAccount.movements.some((mov) => mov >= 0.1 * amount)) {
      alertMessage(
        'success',
        `You\'ve been granted a loan of <b>$ ${amount}</b>`
      );
      currentAccount.movements.push(amount);
      updateDashboard(currentAccount);
    } else {
      alertMessage(
        'error',
        "You don't have the capacity to take a loan of this amount"
      );
    }
  } else {
    alertMessage('error', 'Enter valid amount!');
  }
  inputLoanAmount.value = '';
});
// END

//START
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  showHistory(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// ///////////////////////////////////////////////
/////////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

//
const account = accounts.find((acc) => acc.owner === 'Sarah Smith');

const deposits = movements.filter((mov, i) => mov > 0);
const withdrawals = movements.filter((mov) => !(mov > 0));

let final = 0;
for (const curr of movements) final += curr;

const largest = movements.reduce(
  (acc, cur) => (acc > cur ? acc : cur),
  movements[0]
);
// console.log(movements, largest);
console.log(accounts);

// let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
// // Slice
// console.log(arr.slice(2));

// // Splice
// console.log(arr.splice(2, 3));
// console.log(arr);

// // Reverse

// const arr2 = arr.slice();
// console.log(arr2.reverse());

// for (const [index, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`You deposited
//
//
//  ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// function dog_test(dogsJulia, dogsKate) {
//   const julia_new = dogsJulia.slice(1, -2);
//   const dogs = julia_new.concat(dogsKate);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// }

// // dog_test([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// dog_test([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter((age) => age >= 18);
  const humanAgesAverage =
    adults.reduce((acc, curr) => acc + curr, 0) / adults.length;
  // console.log(humanAgesAverage);
};

// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// [16, 6, 10, 5, 6, 1, 4][(5, 2, 4, 1, 15, 8, 3)];

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const finalMoney = movements
  .filter((map) => map > 0)
  .map((mov) => mov * 1.08)
  .reduce((acc, curr) => acc + curr, 0);

const calcAverageHumanAge2 = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));

// Flat Method
const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, curr) => acc + curr, 0);
console.log(overallBalance);

// Flat Map Method
const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, curr) => acc + curr, 0);
console.log(overallBalance2);

// Sort for Strings
const owners = ['Umar', 'Shiola', 'Aba', 'Zaria'];
console.log(owners.sort());

// Sort for Number (Ascending)
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
movements.sort((a, b) => a - b);
console.log(movements);

// Sort for Number (Descending);
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});

movements.sort((a, b) => b - a);

console.log(movements);
const x = new Array(7);

x.fill(1, 3);
console.log(x);

const y = Array.from({ length: 7 }, () => 1);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const convertCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['is', 'a', 'the', 'a', 'an', 'but', 'or', 'in'];
  const words = title
    .toLowerCase()
    .split(' ')
    .map((word) => (!exceptions.includes(word) ? capitalize(word) : word))
    .join(' ');
  return capitalize(words);
};

console.log(convertCase('hello a boy is here'));
