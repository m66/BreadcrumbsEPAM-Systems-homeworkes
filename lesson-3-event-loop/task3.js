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


// my answer is ==> 1, 4, 10, 2, 8, 2, 7, 5, 6, 3, 9, 11, 12
// [1] [4, 10] [2, 8] [2, 7, 5, 6] [3, 9, 11, 12]
// the correct answer is ==> 1, 4, 10, 2, 8, 3, 9, 11, 12, 2, 7, 6, 5

/*
  execution satges as my opinion

  sync => [1]
  Microtask
    nextTick => [4, 10]
    Promise => []
  Macrotask
    timer => [2, 8]
    I/O callbacks => {
      sync => [2]
      Microtask
        nextTick => [7]
      Macrotask
        setTimeout => [5]
        setImediate => [6]
    }
    setImediate => [3, 9, 11, 12]
    close => []
*/