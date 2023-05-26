const fs = require("fs");

console.log(1);
setTimeout(() => console.log("2"));
setImmediate(() => console.log("3"));
process.nextTick(() => console.log("4"));
fs.readFile(__filename, () => {
  console.log(2);
  setTimeout(() => console.log("5"));
  setImmediate(() => console.log("6"));
  process.nextTick(() => console.log("7"));
});

setTimeout(() => console.log("8"));
setImmediate(() => {
  console.log("9");
  process.nextTick(() => console.log("11"));
});
setImmediate(() => {
  console.log("12");
});
process.nextTick(() => console.log("10"));


// first my answer is    ==> 1, 4, 10, 2, 8, 2, 7, 5, 6, 3, 9, 11, 12
// after understanding)) ==> 1, 4, 10, 2, 8, 3, 9, 11, 12, 2, 7, 5, 6
// the correct answer is ==> 1, 4, 10, 2, 8, 3, 9, 11, 12, 2, 7, 6, 5

/*
  Because the synchron code is executed first, console.log<1> will be executed first
  setTimeout<2>, setTimeout<3> and setTimeout<8> are added to the timer phase
  setImmediate<3>, setImmediate<9> and setImmediate<12> are added to the check phase
  process.nextTick<4> and process.nextTick<10>  are added to the nextTick phase of microtask
  fs.readFile<2> is added to the panding(pall) phase
  at first the callbacks inside of the microtask queue are executed in sequence
  therefore executes process.nextTick<4> and after that process.nextTick<10>
  and since the callbacks in the timer phase are executed first in the macrotask, therefore setTimeout<2> is executed first, then setTimeout<8>
  because fs.readFile<2> is not ready yet, the callbacks in the check phase are executed
  setImmediate<3> is executed first, then console.log<9> in setImmediate<9> , and since process.nextTick<11> is a microtask, it moves it to the microtask queue, 
    executes immediately process.nextTick<11> and returns to the check phase callbacks
  and finally entered the pending phase to execute fs.readFile<2>
  here console.log<2> is executed first, and timer phase is added to setTimeout<5>, check phase to setImmediate<6>, and by moving process.nextTick<7> to microtask queue, 
    it is executed immediately and returns to the macrotask queue, after which I think setTimeout<5> will be executed, and then setImmediate<6>, but when running the code, it prints the opposite
*/