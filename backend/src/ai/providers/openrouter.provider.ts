import { ChatOpenAI } from "@langchain/openai";

import { env } from "../../config/env.js";

import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "./ai-provider.js";

export class OpenRouterProvider implements AIProvider {
  constructor() {
    if (!env.openrouter.apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured"
      );
    }

    if (env.openrouter.models.length === 0) {
      throw new Error(
        "No OpenRouter models are configured"
      );
    }
  }

  async generate(
    request: AIProviderRequest
  ): Promise<AIProviderResponse> {
    let lastError: unknown = null;

    for (const modelName of env.openrouter.models) {
      try {
        console.log(
          `[AI] Trying OpenRouter model: ${modelName}`
        );

        const model = new ChatOpenAI({
          apiKey: env.openrouter.apiKey,
          model: modelName,
          temperature: 0.1,
          maxRetries: 0,
          configuration: {
            baseURL: env.openrouter.baseUrl,
            defaultHeaders: {
              "HTTP-Referer": "http://localhost:5000",
              "X-Title": "ContextGraph",
            },
          },
        });

        const response = await model.invoke([
          {
            role: "system",
            content: request.systemPrompt,
          },
          {
            role: "user",
            content: request.userPrompt,
          },
        ]);

        const rawContent = response.content;

        let content: string;

        if (typeof rawContent === "string") {
          content = rawContent;
        } else {
          content = rawContent
            .map((part) => {
              if (typeof part === "string") {
                return part;
              }

              if (
                typeof part === "object" &&
                part !== null &&
                "text" in part
              ) {
                return String(part.text);
              }

              return "";
            })
            .join("");
        }

        if (!content.trim()) {
          throw new Error(
            `Model ${modelName} returned empty content`
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
        lastError = error;

        const status =
          error &&
          typeof error === "object" &&
          "status" in error
            ? error.status
            : undefined;

        console.warn(
          `[AI] Model failed: ${modelName}`,
          {
            status,
            error:
              error instanceof Error
                ? error.message
                : String(error),
          }
        );

        continue;
      }
    }

    throw new Error(
      `All configured OpenRouter models failed. Last error: ${
        lastError instanceof Error
          ? lastError.message
          : String(lastError)
      }`
    );
  }
}