import express from "express";
import { Worker } from "worker_threads";
import path from "path";
import multer from "multer"; // To handle file uploads
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const upload = multer({ dest: "uploads/" });

// Function to create a new worker for image resizing
const runResizeWorker = (imagePath) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.js"), {
      workerData: { imagePath },
    });

    worker.on("message", resolve); // Listen for the result
    worker.on("error", reject); // Handle errors
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

// Route to handle image upload and resizing
app.post("/upload", upload.single("image"), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Delegate the image resizing task to a worker thread
    const result = await runResizeWorker(imagePath);
    res.json({
      message: "Image resized successfully!",
      resizedImages: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image resizing failed", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
