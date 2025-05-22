// // 1
// let num1 = 25;
// if (Math.sqrt(num1) % 1 === 0) {
//   console.log('Number is a Perfect Square');
// } else {
//   console.log('Number is a Not a Perfect Square');
// }

// // 2
// let randomNum = Math.floor(Math.random() * 11);
// if (randomNum <= 3) {
//   console.log(randomNum + ' is a small number');
// } else if (randomNum <= 7) {
//   console.log(randomNum + ' is a medium number');
// } else {
//   console.log('Large Number');
// }

// //3

// // 4
// let number3 = -1;
// if (number3 >= 0) {
//   console.log(Math.pow(number3, 2));
// } else {
//   console.log('Invalid Operation');
// }

// // 5
// let balance = 100;
// let amount = 18;

// if (amount > balance) {
//   console.log('Insufficient funds.');
// } else {
//   let newAmount = Math.floor(amount / 10) * 10;
//   let deductedAmount = Number(newAmount) + 1;
//   if (newAmount > 0 && deductedAmount <= balance) {
//     balance -= deductedAmount;
//     console.log(
//       'Withdrawal of $' +
//         newAmount +
//         ' successful! Fee: $1 | New Balance: $' +
//         balance
//     );
//   } else {
//     console.log('Invalid withdrawal amount.');
//   }
// }

// console.log(balance);

// 1
let sentence = 'This is a boy and a girl';
console.log(sentence.trim().split(' ').length);

// OR

let wordCount = 1;
for (let i = 0; i < sentence.length + 2; i++) {
  if (sentence.at(i) === ' ') {
    wordCount++;
  }
}

console.log(wordCount);

//2
let myName = 'Faisal';
let vowels = 'aeiouAEIOU';
let vowelCount = 0;
for (let i = 0; i < myName.length; i++) {
  if (vowels.includes(myName.at(i))) {
    vowelCount++;
  }
}

console.log(vowelCount);

//3

let str = 'hello';
let reversedStr = '';

for (let i = str.length - 1; i >= 0; i--) {
  if (true) {
    reversedStr += str[i];
  }
}

console.log(reversedStr);

//4
