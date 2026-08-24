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

    models: (
      process.env.AI_MODELS ||
      "z-ai/glm-5.2:free,google/gemma-4-31b-it:free,nvidia/nemotron-3-super-120b-a12b:free"
    )
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean),

    baseUrl: "https://openrouter.ai/api/v1",
  },
};