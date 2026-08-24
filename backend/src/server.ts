import app from "./app.js";
import { checkDatabaseConnection } from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();

    app.listen(env.port, () => {
      console.log(
        `ContextGraph API running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start ContextGraph:", error);
    process.exit(1);
  }
};

startServer();