import { Worker } from "worker_threads";

// Function to execute the big for-loop in a worker thread
const runBigLoopWorker = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker1.js", { type: "module" });

    worker.on("message", resolve); // Get the result from the worker
    worker.on("error", reject); // Handle any errors
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

// Execute the worker
runBigLoopWorker()
  .then((result) => console.log(`Big loop result: ${result}`))
  .catch((err) => console.error(err));
