import { ChatOpenAI } from "@langchain/openai";

import { env } from "../../config/env.js";

import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "./ai-provider.js";

interface ErrorLike {
  message?: unknown;
  status?: unknown;
  statusCode?: unknown;
  code?: unknown;
  error?: unknown;
  response?: unknown;
}

/**
 * Extract a useful human-readable error message from
 * LangChain / OpenAI / OpenRouter / Axios-style errors.
 */
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as ErrorLike;

    // Direct message
    if (typeof value.message === "string" && value.message.trim()) {
      return value.message;
    }

    // Nested:
    // { error: { message: "...", code: ... } }
    if (typeof value.error === "object" && value.error !== null) {
      const nested = value.error as Record<string, unknown>;

      if (typeof nested.message === "string" && nested.message.trim()) {
        return nested.message;
      }

      if (typeof nested.code === "string" && nested.code.trim()) {
        return nested.code;
      }
    }

    // Axios-style:
    // error.response.data.error.message
    if (typeof value.response === "object" && value.response !== null) {
      const response = value.response as Record<string, unknown>;

      if (
        typeof response.statusText === "string" &&
        response.statusText.trim()
      ) {
        return response.statusText;
      }

      if (typeof response.data === "object" && response.data !== null) {
        const data = response.data as Record<string, unknown>;

        if (typeof data.message === "string" && data.message.trim()) {
          return data.message;
        }

        if (typeof data.error === "object" && data.error !== null) {
          const nestedError = data.error as Record<string, unknown>;

          if (
            typeof nestedError.message === "string" &&
            nestedError.message.trim()
          ) {
            return nestedError.message;
          }

          if (typeof nestedError.code === "string" && nestedError.code.trim()) {
            return nestedError.code;
          }
        }

        if (typeof data.error === "string" && data.error.trim()) {
          return data.error;
        }
      }
    }

    // Last-resort serialization
    try {
      const serialized = JSON.stringify(error);

      if (serialized && serialized !== "{}") {
        return serialized;
      }
    } catch {
      // Ignore serialization failures.
    }
  }

  return String(error);
};

/**
 * Extract HTTP status code from different error shapes.
 */
const extractStatus = (error: unknown): number | undefined => {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const value = error as ErrorLike;

  // Standard status
  if (typeof value.status === "number") {
    return value.status;
  }

  // HTTP statusCode
  if (typeof value.statusCode === "number") {
    return value.statusCode;
  }

  // Some libraries expose status through code
  if (typeof value.code === "number") {
    return value.code;
  }

  // Nested response.status
  if (typeof value.response === "object" && value.response !== null) {
    const response = value.response as Record<string, unknown>;

    if (typeof response.status === "number") {
      return response.status;
    }

    if (typeof response.statusCode === "number") {
      return response.statusCode;
    }
  }

  return undefined;
};

/**
 * Extract text from LangChain/OpenAI content.
 */
const extractContent = (content: unknown): string => {
  // Normal text response
  if (typeof content === "string") {
    return content;
  }

  // LangChain/OpenAI content blocks
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (typeof part === "object" && part !== null) {
          const value = part as Record<string, unknown>;

          if (typeof value.text === "string") {
            return value.text;
          }

          if (typeof value.content === "string") {
            return value.content;
          }
        }

        return "";
      })
      .join("");
  }

  return String(content ?? "");
};

/**
 * Small delay helper.
 *
 * Used only for rate-limit responses so that we don't immediately
 * hammer the next provider/model.
 */
const sleep = async (milliseconds: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export class OpenRouterProvider implements AIProvider {
  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    /*
     * ------------------------------------------------------------------------
     * Configuration validation
     * ------------------------------------------------------------------------
     */

    if (!env.openrouter.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const models = env.openrouter.models;

    if (!Array.isArray(models) || models.length === 0) {
      throw new Error("AI_MODELS is not configured");
    }

    /*
     * ------------------------------------------------------------------------
     * Logging
     * ------------------------------------------------------------------------
     */

    console.log(`[AI] Configured models: ${models.join(", ")}`);

    let lastError = "No OpenRouter models were attempted.";

    /*
     * ------------------------------------------------------------------------
     * Model fallback loop
     * ------------------------------------------------------------------------
     */

    for (let index = 0; index < models.length; index += 1) {
      const modelName = models[index];

      console.log(
        `[AI] Trying OpenRouter model ${index + 1}/${models.length}: ${modelName}`,
      );

      try {
        /*
         * Create a fresh ChatOpenAI instance for every model.
         *
         * This is important because each fallback attempt should
         * be isolated from the previous model.
         */
        const model = new ChatOpenAI({
          apiKey: env.openrouter.apiKey,

          model: modelName,

          temperature: 0.1,

          /*
           * We implement our own fallback logic.
           *
           * Do not allow LangChain to retry internally because
           * that can multiply requests and make rate limiting worse.
           */
          maxRetries: 0,

          /*
           * Maximum time allowed for a single model.
           */
          timeout: 20_000,

          configuration: {
            baseURL: env.openrouter.baseUrl,

            defaultHeaders: {
              "HTTP-Referer":
                process.env.OPENROUTER_SITE_URL ?? "http://localhost:5000",

              "X-Title": process.env.OPENROUTER_APP_NAME ?? "ContextGraph",
            },
          },
        });

        /*
         * --------------------------------------------------------------------
         * Build messages
         * --------------------------------------------------------------------
         */

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

        /*
         * --------------------------------------------------------------------
         * Extract response content
         * --------------------------------------------------------------------
         */

        const content = extractContent(response.content).trim();

        if (!content) {
          throw new Error("Model returned an empty response");
        }

        /*
         * --------------------------------------------------------------------
         * Success
         * --------------------------------------------------------------------
         */

        console.log(`[AI] Successfully generated response using ${modelName}`);

        return {
          content,
          model: modelName,
        };
      } catch (error: unknown) {
        const message = extractErrorMessage(error);

        const status = extractStatus(error);

        lastError = message;

        console.error(`[AI] Model failed: ${modelName}`, {
          status,
          error: message,
        });

        /*
         * --------------------------------------------------------------------
         * Rate-limit handling
         * --------------------------------------------------------------------
         *
         * 429 means this particular model/provider is currently unavailable
         * for our request.
         *
         * We do not retry the same model because maxRetries is already 0.
         * Instead, we move to the next configured model.
         */
        if (status === 429) {
          console.warn(
            `[AI] Rate limited by ${modelName}. Moving to next model.`,
          );

          /*
           * Small delay before trying the next provider.
           *
           * This is intentionally short. The purpose is not to wait
           * for the rate limit to disappear, but to avoid immediately
           * issuing another request in the same execution tick.
           */
          await sleep(250);

          continue;
        }

        /*
         * --------------------------------------------------------------------
         * Timeout handling
         * --------------------------------------------------------------------
         */

        if (
          message.toLowerCase().includes("timeout") ||
          message.toLowerCase().includes("timed out")
        ) {
          console.warn(
            `[AI] Model ${modelName} timed out. Moving to next model.`,
          );

          continue;
        }

        /*
         * --------------------------------------------------------------------
         * Other model/provider errors
         * --------------------------------------------------------------------
         *
         * We still continue because the whole point of this provider
         * is resilient model fallback.
         */
        console.warn(`[AI] Continuing to next configured model after failure.`);

        continue;
      }
    }

    /*
     * ------------------------------------------------------------------------
     * All models failed
     * ------------------------------------------------------------------------
     */

    console.error(
      `[AI] All configured OpenRouter models failed. Last error: ${lastError}`,
    );

    throw new Error(
      `All configured OpenRouter models failed. Last error: ${lastError}`,
    );
  }
}
