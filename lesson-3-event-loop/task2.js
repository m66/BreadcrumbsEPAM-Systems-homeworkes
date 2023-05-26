const fs = require("fs");

setTimeout(() => {
  console.log(1);
});

setTimeout(() => {
  console.log(2);

  process.nextTick(() => {
    console.log(3);
  });

  setImmediate(() => {
    console.log(4);
  });
});

setTimeout(() => {
  console.log(5);
});

setTimeout(() => {
  console.log(6);
  Promise.resolve(7).then((res) => {
    console.log(res);
  });
});

setTimeout(() => {
  console.log(8);
  fs.readFile(__filename, () => {
    console.log(9);
  });
});


/*
  answe is => 1, 2, 3, 5, 6, 7, 8, 4, 9

  setTimeout<1>'s, setTimeout<2>'s, setTimeout<5>'s, setTimeout<6>'s, setTimeout<8>'s callbacks  are sequentially entered in the timer phase
  then the callbacks in the timer phase are executed sequentially
  setTimeout<1> is executed first
  when starts to run callback of setTimeout<2>
  console.log<1> is printed first
  and since there is a microtask in this callback, the operation stops here, 
    a transition is made to the microtask queue, the process.nextTick<3> there is immediately executed, 
    and it returns to the macrotask queue again
  then setImmediate<4> is added in the check phase
  then executed the next callback in the timer phase, setTimeout<5>
  after this it starts executing setTimeout<6> , first executes console.log<6> , then it switches back to microtask and immediately executes Promise.resolve<7> , 
  and returning to macrotask continues to execute callbacks of timer phase
  moving to setTimeout<8> first executes console.log<8> and adds panding phase to fs.readFile<9>
  and since fs.readFile<9> doesn't ready yet, setImmediate<4> in the check phase is executed first, and after that fs.readFile<9> is executed 
*/