import dotenv from "dotenv";

dotenv.config();

const parseModels = (value: string | undefined): string[] => {
  return (value ?? "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
};

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  cognodb: {
    uri: process.env.COGNODB_URI || "",

    username: process.env.COGNODB_USERNAME || "",

    password: process.env.COGNODB_PASSWORD || "",
  },

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",

    baseUrl: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",

    models: parseModels(process.env.AI_MODELS),
  },
};
