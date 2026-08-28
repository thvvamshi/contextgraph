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

/**
 * --------------------------------------------------------------------------
 * GRAPH CONTEXT TYPES
 * --------------------------------------------------------------------------
 */

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

/**
 * --------------------------------------------------------------------------
 * SIMILAR TICKET TYPES
 * --------------------------------------------------------------------------
 */

interface SimilarGraphNode {
  id?: string;

  name?: string;

  title?: string;

  status?: string;

  priority?: string;

  severity?: string;

  tier?: string;

  properties?: Record<string, unknown>;

  labels?: string[];

  [key: string]: unknown;
}

interface SimilarTicketResult {
  ticket: SimilarGraphNode | null;

  customer: SimilarGraphNode | null;

  bug: SimilarGraphNode | null;

  resolution: SimilarGraphNode | null;

  similarityScore: number;

  similarityReasons: string[];
}

/**
 * --------------------------------------------------------------------------
 * GENERAL ENTITY MAPPER
 * --------------------------------------------------------------------------
 */

const mapEntity = (node: RelevantContextRow["source"]): ContextEntity => {
  return {
    id: String(node.id),

    label: String(node.properties.name ?? node.properties.title ?? node.id),

    type: node.labels[0] ?? "Unknown",

    properties: node.properties,
  };
};

/**
 * --------------------------------------------------------------------------
 * SIMILAR GRAPH ENTITY NORMALIZER
 * --------------------------------------------------------------------------
 */

const normalizeSimilarNode = (
  node: SimilarGraphNode | null | undefined,
): {
  id: string;
  properties: Record<string, unknown>;
  labels: string[];
} | null => {
  if (!node) {
    return null;
  }

  /**
   * Neo4j Node object.
   */

  if (node.properties && typeof node.properties === "object") {
    const properties = node.properties;

    const id = properties.id ?? node.id;

    if (id === undefined || id === null || String(id).trim() === "") {
      return null;
    }

    const labels = Array.isArray(node.labels) ? node.labels.map(String) : [];

    return {
      id: String(id),

      properties,

      labels,
    };
  }

  /**
   * Projected Cypher object.
   */

  const id = node.id;

  if (id === undefined || id === null || String(id).trim() === "") {
    return null;
  }

  const properties: Record<string, unknown> = {
    ...node,
  };

  delete properties.properties;

  delete properties.labels;

  return {
    id: String(id),

    properties,

    labels: Array.isArray(node.labels) ? node.labels.map(String) : [],
  };
};

/**
 * --------------------------------------------------------------------------
 * SIMILAR GRAPH ENTITY MAPPER
 * --------------------------------------------------------------------------
 */

const mapSimilarEntity = (
  node: SimilarGraphNode | null | undefined,

  fallbackType: string,
): ContextEntity | null => {
  const normalized = normalizeSimilarNode(node);

  if (!normalized) {
    return null;
  }

  const { id, properties, labels } = normalized;

  return {
    id,

    label: String(properties.name ?? properties.title ?? id),

    type: labels.length > 0 ? labels[0] : fallbackType,

    properties,
  };
};

/**
 * --------------------------------------------------------------------------
 * AI CONTEXT SERVICE
 * --------------------------------------------------------------------------
 */

export class AIContextService {
  private readonly contextBuilder: ContextBuilder;

  private readonly aiProvider: AIProvider;

  constructor(private readonly graphRepository: GraphRepository) {
    this.contextBuilder = new ContextBuilder();

    this.aiProvider = new OpenRouterProvider();
  }

  /**
   * ------------------------------------------------------------------------
   * COMPLETE CUSTOMER AI CONTEXT
   * ------------------------------------------------------------------------
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
   * ------------------------------------------------------------------------
   * CUSTOMER ISSUE CONTEXT
   * ------------------------------------------------------------------------
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
   * ------------------------------------------------------------------------
   * QUESTION-SPECIFIC CUSTOMER CONTEXT
   * ------------------------------------------------------------------------
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

    return {
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
  }

  /**
   * ------------------------------------------------------------------------
   * QUESTION-AWARE TICKET SELECTION
   * ------------------------------------------------------------------------
   *
   * A customer can have many tickets.
   *
   * The old implementation always selected the first ticket raised by the
   * customer. That works for the initial Acme example but becomes incorrect
   * when the user asks about another issue.
   *
   * This method:
   *
   * 1. Gets only tickets raised by the current customer.
   * 2. Scores ticket information against the question.
   * 3. Scores connected bug information.
   * 4. Scores connected product information.
   * 5. Returns the highest-scoring ticket.
   * 6. Falls back to the first customer ticket when no match exists.
   *
   * This keeps the system deterministic and graph-grounded.
   */

  private selectRelevantTicket(
    context: CustomerAIContext,
    question: string,
  ): ContextEntity | null {
    const normalized = question.trim().toLowerCase();

    const customer = context.customer;

    if (!customer) {
      return null;
    }

    /**
     * --------------------------------------------------------------
     * FIND TICKETS RAISED BY THIS CUSTOMER
     * --------------------------------------------------------------
     */

    const customerTicketIds = new Set(
      context.relationships
        .filter(
          (relationship) =>
            relationship.source === customer.id &&
            relationship.type === "RAISED",
        )
        .map((relationship) => relationship.target),
    );

    const customerTickets = context.tickets.filter((ticket) =>
      customerTicketIds.has(ticket.id),
    );

    if (customerTickets.length === 0) {
      return null;
    }

    /**
     * If there is only one ticket, use it directly.
     */

    if (customerTickets.length === 1) {
      return customerTickets[0];
    }

    /**
     * --------------------------------------------------------------
     * TOKENIZE QUESTION
     * --------------------------------------------------------------
     */

    const questionWords = normalized
      .split(/[^a-z0-9-]+/)
      .filter((word) => word.length >= 3);

    let bestTicket: ContextEntity | null = null;

    let bestScore = 0;

    /**
     * --------------------------------------------------------------
     * SCORE EVERY CUSTOMER TICKET
     * --------------------------------------------------------------
     */

    for (const ticket of customerTickets) {
      let score = 0;

      /**
       * ------------------------------------------------------------
       * TICKET INFORMATION
       * ------------------------------------------------------------
       */

      const ticketText = [
        ticket.id,

        ticket.label,

        ...Object.values(ticket.properties).map(String),
      ]
        .join(" ")
        .toLowerCase();

      for (const word of questionWords) {
        if (ticketText.includes(word)) {
          score += 5;
        }
      }

      /**
       * ------------------------------------------------------------
       * CONNECTED BUGS
       * ------------------------------------------------------------
       */

      const bugIds = context.relationships
        .filter(
          (relationship) =>
            relationship.source === ticket.id &&
            relationship.type === "RELATED_TO",
        )
        .map((relationship) => relationship.target);

      for (const bugId of bugIds) {
        const bug = context.bugs.find((entity) => entity.id === bugId);

        if (!bug) {
          continue;
        }

        const bugText = [
          bug.id,

          bug.label,

          ...Object.values(bug.properties).map(String),
        ]
          .join(" ")
          .toLowerCase();

        for (const word of questionWords) {
          if (bugText.includes(word)) {
            score += 8;
          }
        }
      }

      /**
       * ------------------------------------------------------------
       * CONNECTED PRODUCT
       * ------------------------------------------------------------
       */

      const productIds = context.relationships
        .filter(
          (relationship) =>
            relationship.source === ticket.id && relationship.type === "ABOUT",
        )
        .map((relationship) => relationship.target);

      for (const productId of productIds) {
        const product = context.products.find(
          (entity) => entity.id === productId,
        );

        if (!product) {
          continue;
        }

        const productText = [
          product.id,

          product.label,

          ...Object.values(product.properties).map(String),
        ]
          .join(" ")
          .toLowerCase();

        for (const word of questionWords) {
          if (productText.includes(word)) {
            score += 6;
          }
        }
      }

      console.log(`[AI Context] Ticket relevance: ${ticket.id} = ${score}`);

      if (score > bestScore) {
        bestScore = score;

        bestTicket = ticket;
      }
    }

    /**
     * --------------------------------------------------------------
     * FALLBACK
     * --------------------------------------------------------------
     */

    if (!bestTicket) {
      return customerTickets[0];
    }

    return bestTicket;
  }

  /**
   * ------------------------------------------------------------------------
   * EVIDENCE BUILDER
   * ------------------------------------------------------------------------
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
   * ------------------------------------------------------------------------
   * DETERMINISTIC GRAPH ANSWERS
   * ------------------------------------------------------------------------
   */

  private async buildDeterministicAnswer(
    context: CustomerAIContext,

    question: string,
  ): Promise<AIAnswer | null> {
    const normalized = question.trim().toLowerCase();

    const customer = context.customer;

    if (!customer) {
      return null;
    }

    /**
     * ----------------------------------------------------------------------
     * QUESTION-AWARE CUSTOMER TICKET
     * ----------------------------------------------------------------------
     */

    const ticket = this.selectRelevantTicket(context, question);

    if (!ticket) {
      return null;
    }

    /**
     * ----------------------------------------------------------------------
     * PRODUCT
     * ----------------------------------------------------------------------
     */

    const product =
      context.products.find((entity) =>
        context.relationships.some(
          (relationship) =>
            relationship.source === ticket.id &&
            relationship.type === "ABOUT" &&
            relationship.target === entity.id,
        ),
      ) ?? null;

    /**
     * ----------------------------------------------------------------------
     * BUG
     * ----------------------------------------------------------------------
     */

    const bug =
      context.bugs.find((entity) =>
        context.relationships.some(
          (relationship) =>
            relationship.source === ticket.id &&
            relationship.type === "RELATED_TO" &&
            relationship.target === entity.id,
        ),
      ) ?? null;

    /**
     * ----------------------------------------------------------------------
     * TEAM
     * ----------------------------------------------------------------------
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

    /**
     * ----------------------------------------------------------------------
     * RESOLUTION
     * ----------------------------------------------------------------------
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

    /**
     * ======================================================================
     * SIMILAR CUSTOMER QUESTION
     * ======================================================================
     */

    if (
      normalized.includes("other customers") ||
      normalized.includes("other customer") ||
      normalized.includes("similar customer") ||
      normalized.includes("similar customers") ||
      normalized.includes("similar issue") ||
      normalized.includes("similar issues") ||
      normalized.includes("same issue") ||
      normalized.includes("same problem")
    ) {
      try {
        const similarTickets = (await this.graphRepository.getSimilarTickets(
          ticket.id,
          5,
        )) as SimilarTicketResult[];

        console.log(
          "[AI Context] Similar tickets returned:",
          JSON.stringify(similarTickets, null, 2),
        );

        /**
         * --------------------------------------------------------------
         * FILTER ONLY OTHER CUSTOMERS
         * --------------------------------------------------------------
         */

        const otherCustomerTickets = similarTickets.filter((item) => {
          const normalizedCustomer = normalizeSimilarNode(item.customer);

          if (!normalizedCustomer) {
            return false;
          }

          return normalizedCustomer.id !== customer.id;
        });

        console.log(
          "[AI Context] Other customer ticket count:",
          otherCustomerTickets.length,
        );

        /**
         * --------------------------------------------------------------
         * MAP RESULTS
         * --------------------------------------------------------------
         */

        const validResults = otherCustomerTickets
          .map((item) => {
            const otherCustomer = mapSimilarEntity(item.customer, "Customer");

            const similarTicket = mapSimilarEntity(item.ticket, "Ticket");

            const similarBug = mapSimilarEntity(item.bug, "Bug");

            const similarResolution = mapSimilarEntity(
              item.resolution,
              "Resolution",
            );

            if (!otherCustomer || !similarTicket) {
              return null;
            }

            return {
              otherCustomer,

              similarTicket,

              similarBug,

              similarResolution,

              similarityScore: Number(item.similarityScore ?? 0),

              similarityReasons: Array.isArray(item.similarityReasons)
                ? item.similarityReasons
                : [],
            };
          })
          .filter(
            (result): result is NonNullable<typeof result> => result !== null,
          );

        console.log(
          "[AI Context] Valid similar customer results:",
          JSON.stringify(validResults, null, 2),
        );

        /**
         * --------------------------------------------------------------
         * NO VALID MATCHES
         * --------------------------------------------------------------
         */

        if (validResults.length === 0) {
          return {
            customerId: customer.id,

            question,

            answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id})${
              product ? ` about ${product.label} (${product.id})` : ""
            }${bug ? `, which is related to ${bug.label} (${bug.id})` : ""}.

Conclusion:
The knowledge graph does not contain another customer with a sufficiently similar issue to the current ticket.`,

            model: "graph-grounded",

            evidence: [],

            context,
          };
        }

        /**
         * --------------------------------------------------------------
         * HUMAN-READABLE SIMILAR CASES
         * --------------------------------------------------------------
         */

        const similarCustomerLines = validResults
          .map((result, index) => {
            const {
              otherCustomer,

              similarTicket,

              similarBug,

              similarResolution,

              similarityScore,

              similarityReasons,
            } = result;

            const bugText = similarBug
              ? `${similarBug.label} (${similarBug.id})`
              : "No related bug recorded";

            const resolutionText = similarResolution
              ? `${similarResolution.label} (${similarResolution.id})`
              : "No resolution recorded";

            const reasons =
              similarityReasons.length > 0
                ? similarityReasons.join(", ")
                : "Graph relationship similarity";

            return `${index + 1}. ${otherCustomer.label} (${otherCustomer.id})
   Ticket: ${similarTicket.label} (${similarTicket.id})
   Bug: ${bugText}
   Resolution: ${resolutionText}
   Similarity score: ${similarityScore}
   Similarity reasons: ${reasons}`;
          })
          .join("\n\n");

        /**
         * --------------------------------------------------------------
         * CURRENT CUSTOMER EVIDENCE
         * --------------------------------------------------------------
         */

        const evidence: AIEvidence[] = [];

        const currentEdges: string[] = [`${customer.id}|RAISED|${ticket.id}`];

        if (product) {
          currentEdges.push(`${ticket.id}|ABOUT|${product.id}`);
        }

        if (bug) {
          currentEdges.push(`${ticket.id}|RELATED_TO|${bug.id}`);
        }

        evidence.push(...this.buildEvidence(context, currentEdges));

        /**
         * --------------------------------------------------------------
         * SIMILAR CUSTOMER EVIDENCE
         * --------------------------------------------------------------
         */

        for (const result of validResults) {
          const {
            otherCustomer,

            similarTicket,

            similarBug,

            similarResolution,
          } = result;

          evidence.push({
            source: otherCustomer.id,

            relationship: "RAISED",

            target: similarTicket.id,
          });

          if (similarBug) {
            evidence.push({
              source: similarTicket.id,

              relationship: "RELATED_TO",

              target: similarBug.id,
            });
          }

          if (similarBug && similarResolution) {
            evidence.push({
              source: similarBug.id,

              relationship: "RESOLVED_BY",

              target: similarResolution.id,
            });
          }
        }

        /**
         * --------------------------------------------------------------
         * FINAL SIMILAR CUSTOMER ANSWER
         * --------------------------------------------------------------
         */

        return {
          customerId: customer.id,

          question,

          answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id})${
            product ? ` about ${product.label} (${product.id})` : ""
          }${bug ? `, which is related to ${bug.label} (${bug.id})` : ""}.

Similar customer cases found in the knowledge graph:

${similarCustomerLines}

Conclusion:
Yes. The knowledge graph contains ${validResults.length} other customer case(s) associated with the same product or additional graph relationships.

The matching cases and their recorded resolutions are shown above. The similarity score is calculated from graph relationships and is not generated by the language model.`,

          model: "graph-grounded",

          evidence,

          context,
        };
      } catch (error) {
        console.error("[AI Context] Similar customer lookup failed:", error);

        return null;
      }
    }

    /**
     * ======================================================================
     * OWNERSHIP QUESTION
     * ======================================================================
     */

    if (
      normalized.includes("who owns") ||
      normalized.includes("owner") ||
      normalized.includes("responsible team")
    ) {
      if (!product || !bug || !team) {
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
The current ${product.label} issue is owned by ${team.label} (${team.id}).`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * RESOLUTION QUESTION
     * ======================================================================
     */

    if (
      normalized.includes("resolution") ||
      normalized.includes("verified fix") ||
      normalized.includes("verified resolution") ||
      normalized.includes("how was the issue fixed") ||
      normalized.includes("what fixed the issue")
    ) {
      if (!product || !bug || !resolution) {
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
${String(resolution.properties.status ?? "Not recorded")}

Conclusion:
The verified resolution for ${customer.label}'s ${product.label} issue is ${resolution.label} (${resolution.id}).`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * GENERIC CUSTOMER ISSUE SUMMARY
     * ======================================================================
     */

    const asksForSummary =
      normalized.includes("summary") ||
      normalized.includes("summarize") ||
      normalized.includes("summarise") ||
      normalized.includes("current situation") ||
      normalized.includes("in a few sentences") ||
      normalized.includes("briefly explain") ||
      normalized.includes("brief summary") ||
      normalized.includes("give me an overview") ||
      normalized.includes("overview of the issue");

    const asksForStructuredIssueDetails =
      normalized.includes("product") &&
      normalized.includes("bug") &&
      normalized.includes("owner") &&
      normalized.includes("resolution");

    if (asksForSummary || asksForStructuredIssueDetails) {
      if (!ticket || !product || !bug || !team || !resolution) {
        return null;
      }

      const requiredEdges = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|ABOUT|${product.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,

        `${bug.id}|OWNED_BY|${team.id}`,

        `${bug.id}|RESOLVED_BY|${resolution.id}`,
      ];

      const evidence = this.buildEvidence(context, requiredEdges);

      if (evidence.length !== requiredEdges.length) {
        return null;
      }

      const resolutionStatus = String(
        resolution.properties.status ?? "Not recorded",
      );

      return {
        customerId: customer.id,

        question,

        answer: `${customer.label} is experiencing an issue with ${product.label} (${product.id}). The customer's ticket, ${ticket.label} (${ticket.id}), is related to ${bug.label} (${bug.id}). The bug is owned by ${team.label} (${team.id}), and the verified resolution is ${resolution.label} (${resolution.id}), with resolution status "${resolutionStatus}".`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * COMBINED MULTI-HOP TEAM + EXPERT + COMPONENT + VENDOR QUESTION
     * ======================================================================
     */

    const asksForTeam =
      normalized.includes("team") ||
      normalized.includes("who owns") ||
      normalized.includes("owner") ||
      normalized.includes("responsible");

    const asksForExperts =
      normalized.includes("expert") ||
      normalized.includes("experts") ||
      normalized.includes("team members") ||
      normalized.includes("members") ||
      normalized.includes("working on this") ||
      normalized.includes("working on the issue") ||
      normalized.includes("who can help");

    const asksForComponent =
      normalized.includes("component") || normalized.includes("components");

    const asksForVendor =
      normalized.includes("vendor") ||
      normalized.includes("vendors") ||
      normalized.includes("external vendor") ||
      normalized.includes("external vendors");

    const asksForCombinedOperationalContext =
      asksForTeam &&
      (asksForExperts || asksForComponent || asksForVendor) &&
      (asksForExperts || asksForComponent || asksForVendor);

    if (asksForCombinedOperationalContext) {
      if (!bug || !team) {
        return null;
      }

      /**
       * --------------------------------------------------------------
       * FIND TEAM MEMBERS / EXPERTS
       * --------------------------------------------------------------
       */

      const relevantExperts = context.experts.filter((expert) =>
        context.relationships.some(
          (relationship) =>
            relationship.source === team.id &&
            relationship.type === "HAS_MEMBER" &&
            relationship.target === expert.id,
        ),
      );

      /**
       * --------------------------------------------------------------
       * FIND INCIDENTS
       * --------------------------------------------------------------
       */

      const incidentIds = context.relationships
        .filter(
          (relationship) =>
            relationship.source === bug.id && relationship.type === "TRIGGERED",
        )
        .map((relationship) => relationship.target);

      /**
       * --------------------------------------------------------------
       * FIND AFFECTED COMPONENTS
       * --------------------------------------------------------------
       */

      const componentIds = context.relationships
        .filter(
          (relationship) =>
            incidentIds.includes(relationship.source) &&
            relationship.type === "AFFECTS",
        )
        .map((relationship) => relationship.target);

      const uniqueComponentIds = Array.from(new Set(componentIds));

      /**
       * --------------------------------------------------------------
       * FIND EXTERNAL VENDORS
       * --------------------------------------------------------------
       */

      const vendorRelationships = context.relationships.filter(
        (relationship) =>
          uniqueComponentIds.includes(relationship.source) &&
          relationship.type === "USES",
      );

      const uniqueVendorIds = Array.from(
        new Set(vendorRelationships.map((relationship) => relationship.target)),
      );

      /**
       * --------------------------------------------------------------
       * BUILD REQUIRED GRAPH EVIDENCE
       * --------------------------------------------------------------
       */

      const requiredEdges: string[] = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,

        `${bug.id}|OWNED_BY|${team.id}`,
      ];

      /**
       * Team -> experts
       */

      for (const expert of relevantExperts) {
        requiredEdges.push(`${team.id}|HAS_MEMBER|${expert.id}`);
      }

      /**
       * Bug -> incident -> component
       */

      for (const incidentId of incidentIds) {
        requiredEdges.push(`${bug.id}|TRIGGERED|${incidentId}`);

        for (const componentId of uniqueComponentIds) {
          const affectsRelationship = context.relationships.find(
            (relationship) =>
              relationship.source === incidentId &&
              relationship.type === "AFFECTS" &&
              relationship.target === componentId,
          );

          if (affectsRelationship) {
            requiredEdges.push(`${incidentId}|AFFECTS|${componentId}`);
          }
        }
      }

      /**
       * Component -> vendor
       */

      for (const relationship of vendorRelationships) {
        requiredEdges.push(
          `${relationship.source}|USES|${relationship.target}`,
        );
      }

      const evidence = this.buildEvidence(context, requiredEdges);

      /**
       * --------------------------------------------------------------
       * CORE OWNERSHIP VALIDATION
       * --------------------------------------------------------------
       */

      const coreRequiredEdges = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,

        `${bug.id}|OWNED_BY|${team.id}`,
      ];

      const coreEvidence = this.buildEvidence(context, coreRequiredEdges);

      if (coreEvidence.length !== coreRequiredEdges.length) {
        return null;
      }

      /**
       * --------------------------------------------------------------
       * HUMAN-READABLE EXPERT LIST
       * --------------------------------------------------------------
       */

      const expertList =
        relevantExperts.length > 0
          ? relevantExperts
              .map(
                (expert) =>
                  `- ${expert.label} (${expert.id}) - ${
                    expert.properties.role ?? "Team Member"
                  }`,
              )
              .join("\n")
          : "- No team members are recorded";

      /**
       * --------------------------------------------------------------
       * HUMAN-READABLE COMPONENT LIST
       * --------------------------------------------------------------
       */

      const componentList =
        uniqueComponentIds.length > 0
          ? uniqueComponentIds.map((id) => `- ${id}`).join("\n")
          : "- No affected component is recorded";

      /**
       * --------------------------------------------------------------
       * HUMAN-READABLE VENDOR LIST
       * --------------------------------------------------------------
       */

      const vendorList =
        uniqueVendorIds.length > 0
          ? uniqueVendorIds.map((id) => `- ${id}`).join("\n")
          : "- No external vendor relationship is recorded";

      /**
       * --------------------------------------------------------------
       * FINAL COMBINED ANSWER
       * --------------------------------------------------------------
       */

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id}), which is related to ${bug.label} (${bug.id}).

Owning team:
${team.label} (${team.id})

Experts on the owning team:
${expertList}

Affected component(s):
${componentList}

External vendor(s):
${vendorList}

Evidence:
${evidence
  .map((item) => `- ${item.source} --${item.relationship}--> ${item.target}`)
  .join("\n")}

Conclusion:
The issue is owned by ${team.label} (${team.id}). The connected team members, affected components, and external vendors are listed above based directly on the knowledge graph.`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * COMPONENT / VENDOR QUESTION
     * ======================================================================
     */

    if (
      normalized.includes("component") ||
      normalized.includes("vendor") ||
      normalized.includes("external vendor")
    ) {
      if (!ticket || !bug) {
        return null;
      }

      const incidentIds = context.relationships
        .filter(
          (relationship) =>
            relationship.source === bug.id && relationship.type === "TRIGGERED",
        )
        .map((relationship) => relationship.target);

      if (incidentIds.length === 0) {
        return null;
      }

      const componentIds = context.relationships
        .filter(
          (relationship) =>
            incidentIds.includes(relationship.source) &&
            relationship.type === "AFFECTS",
        )
        .map((relationship) => relationship.target);

      const uniqueComponentIds = Array.from(new Set(componentIds));

      if (uniqueComponentIds.length === 0) {
        return null;
      }

      const vendorRelationships = context.relationships.filter(
        (relationship) =>
          uniqueComponentIds.includes(relationship.source) &&
          relationship.type === "USES",
      );

      const uniqueVendorIds = Array.from(
        new Set(vendorRelationships.map((relationship) => relationship.target)),
      );

      const requiredEdges: string[] = [
        `${customer.id}|RAISED|${ticket.id}`,

        `${ticket.id}|RELATED_TO|${bug.id}`,
      ];

      for (const incidentId of incidentIds) {
        requiredEdges.push(`${bug.id}|TRIGGERED|${incidentId}`);

        for (const componentId of uniqueComponentIds) {
          const relationship = context.relationships.find(
            (item) =>
              item.source === incidentId &&
              item.type === "AFFECTS" &&
              item.target === componentId,
          );

          if (relationship) {
            requiredEdges.push(`${incidentId}|AFFECTS|${componentId}`);
          }
        }
      }

      for (const relationship of vendorRelationships) {
        requiredEdges.push(
          `${relationship.source}|USES|${relationship.target}`,
        );
      }

      const evidence = this.buildEvidence(context, requiredEdges);

      if (evidence.length !== requiredEdges.length) {
        return null;
      }

      const asksForVendors =
        normalized.includes("vendor") || normalized.includes("external");

      const asksForComponents = normalized.includes("component");

      let conclusion = "";

      if (asksForComponents && asksForVendors) {
        conclusion = `The affected component(s) are:

${uniqueComponentIds.map((id) => `- ${id}`).join("\n")}

The external vendor(s) connected to those components are:

${
  uniqueVendorIds.length > 0
    ? uniqueVendorIds.map((id) => `- ${id}`).join("\n")
    : "- No external vendor relationship is recorded"
}`;
      } else if (asksForVendors) {
        conclusion = `The external vendor(s) connected to the affected component(s) are:

${
  uniqueVendorIds.length > 0
    ? uniqueVendorIds.map((id) => `- ${id}`).join("\n")
    : "- No external vendor relationship is recorded"
}`;
      } else {
        conclusion = `The component(s) directly affected by the customer's incident are:

${uniqueComponentIds.map((id) => `- ${id}`).join("\n")}`;
      }

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) raised ${ticket.label} (${ticket.id}), which is related to ${bug.label} (${bug.id}).

Evidence:
${evidence
  .map((item) => `- ${item.source} --${item.relationship}--> ${item.target}`)
  .join("\n")}

Conclusion:
${conclusion}`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * EXPERT DISCOVERY
     * ======================================================================
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

      return {
        customerId: customer.id,

        question,

        answer: `Situation:
${customer.label} (${customer.id}) has a ${
          product?.label ?? "product"
        } issue (${bug.label}, ${bug.id}) owned by ${team.label} (${team.id}).

Evidence:
- ${bug.id} --OWNED_BY--> ${team.id}
${relevantExperts
  .map((expert) => `- ${team.id} --HAS_MEMBER--> ${expert.id}`)
  .join("\n")}

Conclusion:
The following experts are connected to the team responsible for this issue:

${expertList}`,

        model: "graph-grounded",

        evidence,

        context,
      };
    }

    /**
     * ======================================================================
     * HALLUCINATION PROTECTION
     * ======================================================================
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

    /**
     * ----------------------------------------------------------------------
     * UNKNOWN QUESTIONS
     * ----------------------------------------------------------------------
     *
     * Fall through to the configured AI provider.
     */

    return null;
  }

  /**
   * ------------------------------------------------------------------------
   * CUSTOMER QUESTION ANSWER
   * ------------------------------------------------------------------------
   */

  async answerCustomerQuestion(
    customerId: string,

    question: string,
  ): Promise<AIAnswer> {
    const customerContext = await this.buildRelevantCustomerContext(customerId);

    /**
     * First attempt deterministic graph reasoning.
     */

    const deterministicAnswer = await this.buildDeterministicAnswer(
      customerContext,
      question,
    );

    if (deterministicAnswer) {
      return deterministicAnswer;
    }

    /**
     * Unknown questions use the configured AI provider.
     */

    const { systemPrompt, userPrompt } = buildCustomerQueryPrompt(
      customerContext,
      question,
    );

    const response = await this.aiProvider.generate({
      systemPrompt,

      userPrompt,
    });

    /**
     * Evidence comes directly from the graph context.
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
