import { GraphRepository } from "../repositories/graph.repository.js";

import { ContextBuilder } from "../ai/context/context-builder.js";

import type {
  AIContext,
  CustomerAIContext,
  ContextRelationship,
  AIEvidence,
  AIAnswer,
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

    const relationships =
      await this.graphRepository.getCustomerAIRelationships(
        customerId
      );

    const normalizedRelationships: ContextRelationship[] =
      relationships.map((relationship) => ({
        id: relationship.id,
        source: relationship.source,
        target: relationship.target,
        type: relationship.type,
        properties: relationship.properties,
      }));

    const customerContext: CustomerAIContext = {
      customer: context.customer,
      tickets: context.tickets,
      products: context.products,
      bugs: context.bugs,
      teams: context.teams,
      experts: context.experts,
      resolutions: context.resolutions,
      documents: context.documents,
      features: context.features,
      relationships: normalizedRelationships,
    };

    return this.contextBuilder.build(
      customerId,
      customerContext
    );
  }

  async answerCustomerQuestion(
    customerId: string,
    question: string
  ): Promise<AIAnswer> {
    const aiContext =
      await this.buildCustomerContext(customerId);

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

    /*
     * For now, expose all graph relationships as
     * available evidence.
     *
     * Later we can add a dedicated evidence-selection
     * step so only relationships actually used by the
     * answer are returned.
     */
    const evidence: AIEvidence[] =
      aiContext.customerContext.relationships.map(
        (relationship) => ({
          source: relationship.source,
          relationship: relationship.type,
          target: relationship.target,
        })
      );

    return {
      customerId,
      question,
      answer: response.content,
      model: response.model,
      evidence,
      context: aiContext.customerContext,
    };
  }
}