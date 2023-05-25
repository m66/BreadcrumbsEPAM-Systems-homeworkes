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
  ( 1 level ) microtasks are executed first = [nextTick, Promise] => 5, 6
  ( 1 level ) macrotasks are execute second = [setTimeout, readFile] => 7
    ( 2 level ) sync are executed first = [console.log] => 1
    ( 2 level )  microtasks are executed second = [nextTick, Promise] => 3, 4
    ( 2 level ) macrotasks are execute third = [setImmediate] => 2
*/
