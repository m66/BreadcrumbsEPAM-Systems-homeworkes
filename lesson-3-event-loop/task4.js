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
  first fs.readFile<0> is added to the pending phase, 
  then setImmediate<1>, setImmediate<2>, setImmediate<3>, setImmediate<4>, 
    setImmediate<6>, setImmediate<7>, setImmediate<8> are added to the check phase, 
  and since setTimeout<9> will be executed after 1 second, that is,setTimeout<9> 
    will be increased in the timer phase with a delay of 1 second, 
  therefore chack callbacks in phase and pending phase will be executed sooner.
  During the sequential execution of setImmediates, upon reaching setImmediate<4>, 
    the Promise.resolve<5> in it is transferred to the microtask queue and executed immediately, 
    after which it returns to the check phase in the macrotask queue and continues the եxecuting setImmediates sequentially
  and finally setTimeout<9> is just executed
*/