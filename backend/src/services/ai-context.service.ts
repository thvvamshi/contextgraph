import { GraphRepository } from "../repositories/graph.repository.js";

import { ContextBuilder } from "../ai/context/context-builder.js";

import type {
  AIContext,
} from "../ai/context/context-types.js";

import {
  buildCustomerQueryPrompt,
} from "../ai/prompts/customer-query.prompt.js";

import type {
  AIProvider,
} from "../ai/providers/ai-provider.js";

import {
  OpenRouterProvider,
} from "../ai/providers/openrouter.provider.js";

export class AIContextService {
  private readonly contextBuilder: ContextBuilder;
  private readonly aiProvider: AIProvider;

  constructor(
    private readonly graphRepository: GraphRepository
  ) {
    this.contextBuilder = new ContextBuilder();
    this.aiProvider = new OpenRouterProvider();
  }

  /**
   * Build structured AI context from the customer knowledge graph.
   */
  async buildCustomerContext(
    customerId: string
  ): Promise<AIContext> {
    const context =
      await this.graphRepository.getCustomerAIContext(
        customerId
      );

    if (!context) {
      throw new Error("Customer not found");
    }

    return this.contextBuilder.build(
      customerId,
      context
    );
  }

  /**
   * Prevent known invalid/non-business responses
   * from being returned to the user.
   */
  private isInvalidAIResponse(
    answer: string
  ): boolean {
    const normalized = answer
      .trim()
      .toLowerCase();

    if (!normalized) {
      return true;
    }

    return (
      normalized === "user safety: safe" ||
      normalized === "user safety: unsafe" ||
      normalized.startsWith("user safety:")
    );
  }

  /**
   * Answer a customer question using only
   * graph-grounded customer context.
   */
  async answerCustomerQuestion(
    customerId: string,
    question: string
  ) {
    const aiContext =
      await this.buildCustomerContext(
        customerId
      );

    const {
      systemPrompt,
      userPrompt,
    } = buildCustomerQueryPrompt(
      aiContext.customerContext,
      question
    );

    const response =
      await this.aiProvider.generate({
        systemPrompt,
        userPrompt,
      });

    if (
      this.isInvalidAIResponse(
        response.content
      )
    ) {
      throw new Error(
        "AI provider returned an invalid grounded response"
      );
    }

    return {
      customerId,
      question,
      answer: response.content,
      model: response.model,
      context: aiContext.customerContext,
    };
  }
}