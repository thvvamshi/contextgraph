import { ChatOpenAI } from "@langchain/openai";

import { env } from "../../config/env.js";

import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "./ai-provider.js";

const OPENROUTER_MODELS = [
  "z-ai/glm-5.2:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
];

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value = error as Record<string, unknown>;

    if (typeof value.message === "string") {
      return value.message;
    }

    if (
      typeof value.error === "object" &&
      value.error !== null
    ) {
      const nestedError =
        value.error as Record<string, unknown>;

      if (
        typeof nestedError.message === "string"
      ) {
        return nestedError.message;
      }
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown provider error";
    }
  }

  return String(error);
};

const extractStatus = (
  error: unknown
): number | undefined => {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value = error as Record<string, unknown>;

    if (typeof value.status === "number") {
      return value.status;
    }

    if (typeof value.code === "number") {
      return value.code;
    }
  }

  return undefined;
};

const extractContent = (
  content: unknown
): string => {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return String(content ?? "");
  }

  return content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      if (
        typeof part === "object" &&
        part !== null
      ) {
        const value =
          part as Record<string, unknown>;

        if (typeof value.text === "string") {
          return value.text;
        }

        if (
          typeof value.content === "string"
        ) {
          return value.content;
        }
      }

      return "";
    })
    .join("");
};

export class OpenRouterProvider
  implements AIProvider
{
  async generate(
    request: AIProviderRequest
  ): Promise<AIProviderResponse> {
    if (!env.openrouter.apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured"
      );
    }

    let lastError =
      "No OpenRouter models were attempted.";

    for (
      const modelName of OPENROUTER_MODELS
    ) {
      console.log(
        `[AI] Trying OpenRouter model: ${modelName}`
      );

      try {
        const model = new ChatOpenAI({
          apiKey: env.openrouter.apiKey,
          model: modelName,
          temperature: 0.1,

          configuration: {
            baseURL: env.openrouter.baseUrl,

            defaultHeaders: {
              "HTTP-Referer":
                "http://localhost:5000",

              "X-Title":
                "ContextGraph",
            },
          },
        });

        const response =
          await model.invoke([
            {
              role: "system",
              content: request.systemPrompt,
            },
            {
              role: "user",
              content: request.userPrompt,
            },
          ]);

        const content = extractContent(
          response.content
        );

        if (!content.trim()) {
          throw new Error(
            "Model returned an empty response"
          );
        }

        console.log(
          `[AI] Successfully generated response using: ${modelName}`
        );

        return {
          content: content.trim(),
          model: modelName,
        };
      } catch (error) {
        const message =
          extractErrorMessage(error);

        const status =
          extractStatus(error);

        lastError = message;

        console.error(
          `[AI] Model failed: ${modelName}`,
          {
            status,
            error: message,
          }
        );

        /*
         * Continue to the next model.
         *
         * This intentionally handles:
         * - 429 rate limits
         * - 404 unavailable models
         * - provider errors
         * - malformed provider responses
         * - network errors
         */
        continue;
      }
    }

    throw new Error(
      `All configured OpenRouter models failed. Last error: ${lastError}`
    );
  }
}