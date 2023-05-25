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
