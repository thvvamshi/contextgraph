import { ChatOpenAI } from "@langchain/openai";

import { env } from "../../config/env.js";
import type {
  AIProvider,
  AIProviderRequest,
  AIProviderResponse,
} from "./ai-provider.js";

export class OpenRouterProvider implements AIProvider {
  private readonly model: ChatOpenAI;

  constructor() {
    if (!env.openrouter.apiKey) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured"
      );
    }

    this.model = new ChatOpenAI({
      apiKey: env.openrouter.apiKey,
      model: env.openrouter.model,
      temperature: 0.1,
      configuration: {
        baseURL: env.openrouter.baseUrl,
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "ContextGraph",
        },
      },
    });
  }

  async generate(
    request: AIProviderRequest
  ): Promise<AIProviderResponse> {
    const response = await this.model.invoke([
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

    return {
      content,
      model: env.openrouter.model,
    };
  }
}