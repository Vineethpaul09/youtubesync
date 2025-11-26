// Combined Backend + Worker Startup
import { startWorker } from "./worker-bootstrap";
import "./index"; // Start the Express server

// Start worker in production
if (process.env.NODE_ENV === "production") {
  console.log("Starting integrated worker...");
  startWorker();
}
