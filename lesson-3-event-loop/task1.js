const fs = require("fs");

fs.readFile(__filename, () => {
  console.log("1");
  setImmediate(() => console.log("2"));
  process.nextTick(() => console.log("3"));
  Promise.resolve().then(() => console.log("4"));
});

process.nextTick(() => console.log("5"));
Promise.resolve().then(() => console.log("6"));
setTimeout(() => console.log("7"));

for (let i = 0; i < 2000000000; i++) {}

// my answer is ==> 5, 6, 7, 1, 3, 4, 2
// the correct answer is ==> 5, 6, 7, 1, 3, 4, 2

/*
  the callback of readFile enters the pending phase
  process.nextTick <5> enters the nextTick phase of microtask
  Promise.resolve <6> enters the promise phase of microtask
  and setTimeout <7> enters the timers phase
  and because microtask's code has an adventage over macrotask
  therefore the microtask's code will be executed first
  and in turn, nextTick has advantage over promise
  therefor, it should be done in the following order
  first process.nextTick <5>
  second Promise.resolve <6>

  then executes the code in the macrotask
  in here timer phase has adventage over readFile
  therefore at first executes setTimeout <7> and after that callback of readFile
  first run console.log <1>, because it's done at once
  then setImmediate <2> added in the check phase
  and since there is a microtasks in the macrotask, it will stop the operation in the macrotask,
  move to microtask queue, execute the callbacks of microtask queue, and only return to the macrotask after finishing
  therefore at first executes process.nextTick <3>, after that Promise.resolve <4>
  and after completing the callbacks in the microtask queue, returns to the macrotask and executes setImmediate <2> which was in the check phase
*/