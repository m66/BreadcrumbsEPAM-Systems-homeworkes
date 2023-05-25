const fs = require("fs");
fs.readFile(__filename, () => {
  console.log(0);
});

setImmediate(() => {
  console.log(1);
});
setImmediate(() => {
  console.log(2);
});
setImmediate(() => {
  console.log(3);
});
setImmediate(() => {
  console.log(4);
  Promise.resolve(5).then((res) => {
    console.log(res);
  });
});

setImmediate(() => {
  console.log(6);
});
setImmediate(() => {
  console.log(7);
});
setImmediate(() => {
  console.log(8);
});

setTimeout(() => {
  console.log(9);
}, 1000);


// my answer is ==> 1, 2, 3, 4, 5, 6, 7, 8, 0, 9
// the correct answer is ==> 1, 2, 3, 4, 5, 6, 7, 8, 0, 9

/*
  execution stages

  setImmediate => [1, 2, 3, 4, 5 (microtasks executed immediately), 6, 7, 8]
  readFile => [0]   ** In the documentation given that the I/O callbacks are executed firs, 
                    ** but from the previous examples I made sure that this is not that case
  setTimeout => [9]
*/