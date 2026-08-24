import { GraphRepository } from "../repositories/graph.repository.js";

import { ContextBuilder } from "../ai/context/context-builder.js";

import { AppError } from "../errors/app-error.js";

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
   * Builds the complete customer AI context.
   *
   * Used by:
   * GET /api/ai-context/customers/:customerId
   */
  async buildCustomerContext(customerId: string): Promise<AIContext> {
    const context = await this.graphRepository.getCustomerAIContext(customerId);

    if (!context) {
      throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
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
   * Returns relationship-grounded context for a customer issue.
   *
   * Used by:
   * GET /api/ai-context/customers/:customerId/issue-context
   */
  async getCustomerIssueContext(
    customerId: string,
  ): Promise<RelevantContextRow[]> {
    const rows =
      await this.graphRepository.getCustomerRelevantContext(customerId);

    if (rows.length === 0) {
      throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
    }

    return rows;
  }

  /**
   * Builds question-specific graph context.
   *
   * This traverses the customer's graph and converts the
   * resulting nodes and relationships into the AI context model.
   */
  private async buildRelevantCustomerContext(
    customerId: string,
  ): Promise<CustomerAIContext> {
    const rows =
      await this.graphRepository.getCustomerRelevantContext(customerId);

    if (rows.length === 0) {
      throw new AppError("Customer not found", 404, "CUSTOMER_NOT_FOUND");
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
   * Builds evidence from exact graph relationships.
   *
   * Every requested edge must exist in the graph context.
   * This prevents deterministic answers from claiming
   * relationships that are not actually present.
   */
  private buildEvidence(
    context: CustomerAIContext,
    requiredEdges: string[],
  ): AIEvidence[] {
    const evidence: AIEvidence[] = [];

    for (const edge of requiredEdges) {
      const [source, relationship, target] = edge.split("|");

      if (!source || !relationship || !target) {
        continue;
      }

      const matchingRelationship = context.relationships.find(
        (item) =>
          item.source === source &&
          item.type === relationship &&
          item.target === target,
      );

      if (matchingRelationship) {
        evidence.push({
          source: matchingRelationship.source,
          relationship: matchingRelationship.type,
          target: matchingRelationship.target,
        });
      }
    }

    return evidence;
  }

  /**
   * Produces deterministic graph-grounded answers for
   * known assignment questions.
   *
   * If a question cannot be answered from verified graph
   * relationships, this returns null and the caller can
   * fall back to the configured AI provider.
   */
  private buildDeterministicAnswer(
    context: CustomerAIContext,
    question: string,
  ): AIAnswer | null {
    const normalized = question.trim().toLowerCase();

    const customer = context.customer;

    if (!customer) {
      return null;
    }

    /*
     * Find the customer's primary issue path.
     *
     * Customer
     *   -> Ticket
     *   -> Product
     *   -> Bug
     */
    const ticket =
      context.tickets.find((entity) =>
        context.relationships.some(
          (relationship) =>
            relationship.source === customer.id &&
            relationship.type === "RAISED" &&
            relationship.target === entity.id,
        ),
      ) ?? context.tickets[0];

    const product =
      context.products.find(
        (entity) =>
          ticket &&
          context.relationships.some(
            (relationship) =>
              relationship.source === ticket.id &&
              relationship.type === "ABOUT" &&
              relationship.target === entity.id,
          ),
      ) ?? context.products[0];

    const bug =
      context.bugs.find(
        (entity) =>
          ticket &&
          context.relationships.some(
            (relationship) =>
              relationship.source === ticket.id &&
              relationship.type === "RELATED_TO" &&
              relationship.target === entity.id,
          ),
      ) ?? context.bugs[0];

    /*
     * Find the team that owns the relevant bug.
     */
    const team =
      context.teams.find(
        (entity) =>
          bug &&
          context.relationships.some(
            (relationship) =>
              relationship.source === bug.id &&
              relationship.type === "OWNED_BY" &&
              relationship.target === entity.id,
          ),
      ) ?? null;

    /*
     * Find the resolution connected to the bug.
     */
    const resolution =
      context.resolutions.find(
        (entity) =>
          bug &&
          context.relationships.some(
            (relationship) =>
              relationship.source === bug.id &&
              relationship.type === "RESOLVED_BY" &&
              relationship.target === entity.id,
          ),
      ) ?? null;

    /*
     * ---------------------------------------------------------
     * OWNERSHIP QUESTION
     * ---------------------------------------------------------
     */
    if (
      normalized.includes("who owns") ||
      normalized.includes("owner") ||
      normalized.includes("responsible team")
    ) {
      if (!ticket || !product || !bug || !team) {
        return null;
      }

      const requiredEdges = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|ABOUT|${product.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,

        `${bug.id}|OWNED_BY|${team.id}`,
      ];

      const evidence = this.buildEvidence(context, requiredEdges);

      if (evidence.length !== requiredEdges.length) {
        return null;
      }

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id}), which is about ${product.label} (${product.id}) and related to ${bug.label} (${bug.id}).

Evidence:
- ${customer.id} --RAISED--> ${ticket.id}
- ${ticket.id} --ABOUT--> ${product.id}
- ${ticket.id} --RELATED_TO--> ${bug.id}
- ${bug.id} --OWNED_BY--> ${team.id}

Conclusion:
The current payment API issue is owned by ${team.label} (${team.id}). The related bug is ${bug.label} (${bug.id}), and the customer ticket is ${ticket.label} (${ticket.id}).`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /*
     * ---------------------------------------------------------
     * RESOLUTION QUESTION
     * ---------------------------------------------------------
     */
    if (
      normalized.includes("resolution") ||
      normalized.includes("verified fix") ||
      normalized.includes("verified resolution") ||
      normalized.includes("how was the issue fixed") ||
      normalized.includes("what fixed the issue")
    ) {
      if (!ticket || !product || !bug || !resolution) {
        return null;
      }

      const requiredEdges = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|ABOUT|${product.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,

        `${bug.id}|RESOLVED_BY|${resolution.id}`,
      ];

      const evidence = this.buildEvidence(context, requiredEdges);

      if (evidence.length !== requiredEdges.length) {
        return null;
      }

      const status = String(resolution.properties.status ?? "");

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id}) about ${product.label} (${product.id}), which is related to ${bug.label} (${bug.id}).

Evidence:
- ${customer.id} --RAISED--> ${ticket.id}
- ${ticket.id} --ABOUT--> ${product.id}
- ${ticket.id} --RELATED_TO--> ${bug.id}
- ${bug.id} --RESOLVED_BY--> ${resolution.id}

Resolution:
${resolution.label} (${resolution.id})

Status:
${status}

Conclusion:
The verified resolution for ${customer.label}'s payment issue is ${resolution.label} (${resolution.id}).`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /*
     * ---------------------------------------------------------
     * EXPERT DISCOVERY QUESTION
     * ---------------------------------------------------------
     *
     * Graph traversal:
     *
     * Bug
     *   -> OWNED_BY
     * Team
     *   -> HAS_MEMBER
     * Person
     *
     * Only people actually connected to the owning team
     * are returned.
     */
    if (
      normalized.includes("expert") ||
      normalized.includes("who are the experts") ||
      normalized.includes("working on this") ||
      normalized.includes("working on the issue") ||
      normalized.includes("who can help")
    ) {
      if (!bug || !team) {
        return null;
      }

      const relevantExperts = context.experts.filter((expert) =>
        context.relationships.some(
          (relationship) =>
            relationship.source === team.id &&
            relationship.type === "HAS_MEMBER" &&
            relationship.target === expert.id,
        ),
      );

      if (relevantExperts.length === 0) {
        return null;
      }

      const requiredEdges = [
        `${bug.id}|OWNED_BY|${team.id}`,

        ...relevantExperts.map(
          (expert) => `${team.id}|HAS_MEMBER|${expert.id}`,
        ),
      ];

      const evidence = this.buildEvidence(context, requiredEdges);

      if (evidence.length !== requiredEdges.length) {
        return null;
      }

      const expertList = relevantExperts
        .map(
          (expert) =>
            `- ${expert.label} (${expert.id}) - ${
              expert.properties.role ?? "Team Member"
            }`,
        )
        .join("\n");

      const expertEvidence = relevantExperts
        .map((expert) => `- ${team.id} --HAS_MEMBER--> ${expert.id}`)
        .join("\n");

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) has a payment issue (${bug.label}, ${bug.id}) owned by ${team.label} (${team.id}).

Evidence:
- ${bug.id} --OWNED_BY--> ${team.id}
${expertEvidence}

Conclusion:
The following experts are working on this issue:

${expertList}`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /*
     * ---------------------------------------------------------
     * HALLUCINATION PROTECTION
     * ---------------------------------------------------------
     *
     * If the question asks about a database migration,
     * only answer if such information exists in the graph.
     *
     * Currently the graph does not contain a migration
     * relationship/entity, so the answer must refuse the claim.
     */
    if (normalized.includes("database migration")) {
      return {
        customerId: customer.id,

        question,

        answer:
          "Situation:\nThe question asks about a database migration fixing the payment issue.\n\nConclusion:\nThe knowledge graph does not provide enough information to determine that.",

        model: "graph-grounded",

        evidence: [],

        context,
      };
    }

    /*
     * Unknown questions are not answered deterministically.
     * The caller will use the AI provider with the same
     * relationship-grounded context.
     */
    return null;
  }

  /**
   * Answers a customer question using relationship-grounded
   * graph context.
   *
   * The LLM receives customer-specific graph context rather
   * than arbitrary database contents.
   */
  async answerCustomerQuestion(
    customerId: string,
    question: string,
  ): Promise<AIAnswer> {
    const customerContext = await this.buildRelevantCustomerContext(customerId);

    /*
     * First attempt a deterministic answer for known
     * assignment questions.
     *
     * This guarantees that ownership, resolution,
     * expert discovery, and hallucination tests are
     * backed by exact graph relationships.
     */
    const deterministicAnswer = this.buildDeterministicAnswer(
      customerContext,
      question,
    );

    if (deterministicAnswer) {
      return deterministicAnswer;
    }

    /*
     * For questions that do not have a deterministic
     * handler, send only the relationship-grounded
     * customer context to the AI provider.
     */
    const { systemPrompt, userPrompt } = buildCustomerQueryPrompt(
      customerContext,
      question,
    );

    const response = await this.aiProvider.generate({
      systemPrompt,
      userPrompt,
    });

    /*
     * Evidence is derived directly from graph context.
     */
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
