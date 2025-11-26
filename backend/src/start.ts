// Combined Backend + Worker Startup
import { startWorker } from "./worker-bootstrap";
import "./index"; // Start the Express server

// Always start worker (it checks NODE_ENV internally if needed)
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Starting integrated worker...");
startWorker();
