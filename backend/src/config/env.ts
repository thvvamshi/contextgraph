import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  cognodb: {
    uri: process.env.COGNODB_URI || "",
    username: process.env.COGNODB_USERNAME || "",
    password: process.env.COGNODB_PASSWORD || "",
  },

  frontendUrl:
    process.env.FRONTEND_URL || "http://localhost:3000",

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model:
      process.env.AI_MODEL ||
      "openai/gpt-oss-20b:free",
    baseUrl: "https://openrouter.ai/api/v1",
  },
};