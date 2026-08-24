import { GraphRepository } from "../repositories/graph.repository.js";

import { ContextBuilder } from "../ai/context/context-builder.js";

import type {
  AIContext,
  CustomerAIContext,
  ContextEntity,
  ContextRelationship,
  AIEvidence,
  AIAnswer,
} from "../ai/context/context-types.js";

import { buildCustomerQueryPrompt } from "../ai/prompts/customer-query.prompt.js";

import type { AIProvider } from "../ai/providers/ai-provider.js";

import { OpenRouterProvider } from "../ai/providers/openrouter.provider.js";

interface RelevantContextRow {
  source: {
    id: string;
    labels: string[];
    properties: Record<string, unknown>;
  };

  relationship: {
    id: string;
    type: string;
    properties: Record<string, unknown>;
  };

  target: {
    id: string;
    labels: string[];
    properties: Record<string, unknown>;
  };
}

const mapEntity = (node: RelevantContextRow["source"]): ContextEntity => {
  return {
    id: String(node.id),
    label: String(node.properties.name ?? node.properties.title ?? node.id),
    type: node.labels[0] ?? "Unknown",
    properties: node.properties,
  };
};

export class AIContextService {
  private readonly contextBuilder: ContextBuilder;
  private readonly aiProvider: AIProvider;

  constructor(private readonly graphRepository: GraphRepository) {
    this.contextBuilder = new ContextBuilder();
    this.aiProvider = new OpenRouterProvider();
  }

  /**
   * Builds the complete customer context.
   *
   * Used by:
   * GET /customers/:customerId
   */
  async buildCustomerContext(customerId: string): Promise<AIContext> {
    const context = await this.graphRepository.getCustomerAIContext(customerId);

    if (!context) {
      throw new Error("Customer not found");
    }

    const relationships =
      await this.graphRepository.getCustomerAIRelationships(customerId);

    const normalizedRelationships: ContextRelationship[] = relationships.map(
      (relationship) => ({
        id: relationship.id,
        source: relationship.source,
        target: relationship.target,
        type: relationship.type,
        properties: relationship.properties,
      }),
    );

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

    return this.contextBuilder.build(customerId, customerContext);
  }

  /**
   * Builds question-specific graph context.
   *
   * Unlike buildCustomerContext(), this uses the
   * relevant-context graph traversal so the LLM receives
   * the actual issue path and its connected entities.
   */
  private async buildRelevantCustomerContext(
    customerId: string,
  ): Promise<CustomerAIContext> {
    const rows =
      await this.graphRepository.getCustomerRelevantContext(customerId);

    if (rows.length === 0) {
      throw new Error("Customer not found");
    }

    const entities = new Map<string, ContextEntity>();

    const relationships: ContextRelationship[] = [];

    for (const row of rows) {
      const source = mapEntity(row.source);
      const target = mapEntity(row.target);

      entities.set(source.id, source);
      entities.set(target.id, target);

      relationships.push({
        id: String(row.relationship.id),
        source: source.id,
        target: target.id,
        type: row.relationship.type,
        properties: row.relationship.properties,
      });
    }

    const getEntitiesByType = (type: string): ContextEntity[] => {
      return Array.from(entities.values()).filter(
        (entity) => entity.type === type,
      );
    };

    const customer =
      Array.from(entities.values()).find(
        (entity) => entity.type === "Customer" && entity.id === customerId,
      ) ?? null;

    const customerContext: CustomerAIContext = {
      customer,

      tickets: getEntitiesByType("Ticket"),

      products: getEntitiesByType("Product"),

      bugs: getEntitiesByType("Bug"),

      teams: getEntitiesByType("Team"),

      experts: getEntitiesByType("Person"),

      resolutions: getEntitiesByType("Resolution"),

      documents: getEntitiesByType("Document"),

      features: getEntitiesByType("Feature"),

      relationships,
    };

    return customerContext;
  }

  /**
   * Answers a customer question using only the
   * question-relevant graph context.
   */
  async answerCustomerQuestion(
    customerId: string,
    question: string,
  ): Promise<AIAnswer> {
    const customerContext = await this.buildRelevantCustomerContext(customerId);

    const { systemPrompt, userPrompt } = buildCustomerQueryPrompt(
      customerContext,
      question,
    );

    const response = await this.aiProvider.generate({
      systemPrompt,
      userPrompt,
    });

    const evidence: AIEvidence[] = customerContext.relationships.map(
      (relationship) => ({
        source: relationship.source,
        relationship: relationship.type,
        target: relationship.target,
      }),
    );

    return {
      customerId,
      question,
      answer: response.content,
      model: response.model,
      evidence,
      context: customerContext,
    };
  }
}
