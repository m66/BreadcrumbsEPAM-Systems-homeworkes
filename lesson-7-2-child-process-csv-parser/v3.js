import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
  // This code runs in the main thread

  const worker = new Worker(__filename, {
    workerData: 40 // Number of Fibonacci sequence elements to calculate
  });

  worker.on('message', result => {
    console.log(`Fibonacci result: ${result}`);
  });

} else {
  // This code runs in the worker thread

  const num = workerData;
  const result = fibonacci(num);

  parentPort.postMessage(result);
}