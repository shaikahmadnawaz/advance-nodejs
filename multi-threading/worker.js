import { workerData, parentPort } from "worker_threads";
import sharp from "sharp";
import path from "path";

// Get the image path from the main thread
const { imagePath } = workerData;

// Define output paths for different sizes
const smallImagePath = path.resolve(
  "uploads",
  "small_" + path.basename(imagePath) + ".png"
);
const mediumImagePath = path.resolve(
  "uploads",
  "medium_" + path.basename(imagePath) + ".png"
);
const largeImagePath = path.resolve(
  "uploads",
  "large_" + path.basename(imagePath) + ".png"
);

Promise.all([
  sharp(imagePath).resize(200).toFile(smallImagePath), // Resize to small (200px wide)
  sharp(imagePath).resize(500).toFile(mediumImagePath), // Resize to medium (500px wide)
  sharp(imagePath).resize(800).toFile(largeImagePath), // Resize to large (800px wide)
])
  .then(() => {
    // Send the result back to the main thread
    parentPort.postMessage({
      smallImage: smallImagePath,
      mediumImage: mediumImagePath,
      largeImage: largeImagePath,
    });
  })
  .catch((error) => {
    // If an error occurs, throw it to the main thread
    parentPort.postMessage({ error: error.message });
  });
