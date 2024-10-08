import { parentPort } from "worker_threads";

// Big for-loop calculation
let sum = 0;
for (let i = 0; i < 1e9; i++) {
  // Loop from 0 to 1 billion
  sum += i;
}

// Send the result back to the main thread
parentPort.postMessage(sum);
