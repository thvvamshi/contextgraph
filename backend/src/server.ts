import app from "./app.js";
import { checkDatabaseConnection } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
  try {
    // Start the API server first.
    // This allows Render to keep the service alive even if CognoDB
    // is temporarily unavailable or paused.
    app.listen(env.port, () => {
      console.log(`ContextGraph API running on port ${env.port}`);
    });

    // Check CognoDB after the API has started.
    try {
      await checkDatabaseConnection();

      console.log("CognoDB connection successful");
    } catch (error) {
      console.error("CognoDB is currently unavailable:", error);
      console.error(
        "The API will remain running. Database-backed requests will work once CognoDB is available.",
      );
    }
  } catch (error) {
    console.error("Failed to start ContextGraph:", error);
    process.exit(1);
  }
};

startServer();
