import { getDriver } from "../config/database.js";

import {
  customerContextQuery,
  similarTicketsQuery,
} from "../graph/queries/customer-context.js";

import { expertDiscoveryQuery } from "../graph/queries/expert-discovery.js";
import { resolutionContextQuery } from "../graph/queries/resolution-context.js";
import { showcaseContextQuery } from "../graph/queries/showcase-context.js";
import { agentContextQuery } from "../graph/queries/agent-context.js";
import { graphVisualizationQuery } from "../graph/queries/graph-visualization.js";
import { customerAIContextQuery } from "../graph/queries/customer-ai-context.js";
import { customerAIRelationshipsQuery } from "../graph/queries/customer-ai-relationships.js";
import { customerRelevantContextQuery } from "../graph/queries/customer-relevant-context.js";

/**
 * --------------------------------------------------------------------------
 * GRAPH TYPES
 * --------------------------------------------------------------------------
 */

interface GraphNode {
  properties: {
    id: string;
    name?: string;
    title?: string;
    tier?: string;
    [key: string]: unknown;
  };

  labels: string[];
}

interface GraphRelationship {
  elementId: string;
  type: string;
  properties: Record<string, unknown>;
}

interface ContextEntity {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

/**
 * --------------------------------------------------------------------------
 * CUSTOMER LIST TYPE
 * --------------------------------------------------------------------------
 */

export interface CustomerListItem {
  id: string;
  name: string;
  tier: string;
}

/**
 * --------------------------------------------------------------------------
 * NODE MAPPER
 * --------------------------------------------------------------------------
 */

const mapNode = (node: GraphNode | null): ContextEntity | null => {
  if (!node || !node.properties) {
    return null;
  }

  const id = node.properties.id;

  if (id === undefined || id === null || String(id).trim() === "") {
    return null;
  }

  return {
    id: String(id),

    label: String(
      node.properties.name ?? node.properties.title ?? node.properties.id,
    ),

    type:
      Array.isArray(node.labels) && node.labels.length > 0
        ? String(node.labels[0])
        : "Unknown",

    properties: node.properties,
  };
};

/**
 * --------------------------------------------------------------------------
 * NODE ARRAY MAPPER
 * --------------------------------------------------------------------------
 */

const mapNodes = (nodes: GraphNode[] | null | undefined): ContextEntity[] => {
  if (!Array.isArray(nodes)) {
    return [];
  }

  const mappedNodes: ContextEntity[] = [];

  for (const node of nodes) {
    const mappedNode = mapNode(node);

    if (mappedNode) {
      mappedNodes.push(mappedNode);
    }
  }

  return mappedNodes;
};

/**
 * --------------------------------------------------------------------------
 * GRAPH REPOSITORY
 * --------------------------------------------------------------------------
 */

export class GraphRepository {
  /**
   * ------------------------------------------------------------------------
   * GET ALL CUSTOMERS
   * ------------------------------------------------------------------------
   *
   * Returns customers directly from Neo4j.
   *
   * Used by:
   *
   * GET /api/customers
   *
   * Frontend:
   *
   * Ask Agent → Customer selector
   */
  async getCustomers() {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(`
      MATCH (customer:Customer)
      RETURN customer
      ORDER BY customer.name
    `);

      return result.records.map((record) => {
        const customer = record.get("customer");

        return {
          id: String(customer.properties.id),
          name: String(
            customer.properties.name ??
              customer.properties.title ??
              customer.properties.id,
          ),
          tier: String(customer.properties.tier ?? "Customer"),
        };
      });
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET CUSTOMER CONTEXT
   * ------------------------------------------------------------------------
   */

  async getCustomerContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET SIMILAR TICKETS
   * ------------------------------------------------------------------------
   */

  async getSimilarTickets(ticketId: string, limit = 5) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(similarTicketsQuery, {
        ticketId,
        limit,
      });

      const rows = result.records.map((record) => {
        const ticket = record.get("ticket");

        const customer = record.get("customer");

        const bug = record.get("bug");

        const resolution = record.get("resolution");

        return {
          ticket: ticket ?? null,

          customer: customer ?? null,

          bug: bug ?? null,

          resolution: resolution ?? null,

          similarityScore: Number(record.get("similarityScore") ?? 0),

          similarityReasons:
            (record.get("similarityReasons") as string[] | null) ?? [],
        };
      });

      console.log(`[Similar Tickets] ticketId=${ticketId} rows=${rows.length}`);

      console.log("[Similar Tickets] Result:", JSON.stringify(rows, null, 2));

      return rows;
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DISCOVER EXPERTS
   * ------------------------------------------------------------------------
   */

  async discoverExperts(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(expertDiscoveryQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET RESOLUTION CONTEXT
   * ------------------------------------------------------------------------
   */

  async getResolutionContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(resolutionContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET SHOWCASE CONTEXT
   * ------------------------------------------------------------------------
   */

  async getShowcaseContext(customerTier: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(showcaseContextQuery, {
        customerTier,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET AGENT CONTEXT
   * ------------------------------------------------------------------------
   */

  async getAgentContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(agentContextQuery, {
        customerId,
      });

      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET GRAPH VISUALIZATION
   * ------------------------------------------------------------------------
   */

  async getGraphVisualization() {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(graphVisualizationQuery);

      return result.records
        .map((record) => {
          const source = record.get("n") as GraphNode | null;

          const relationship = record.get("r") as GraphRelationship | null;

          const target = record.get("m") as GraphNode | null;

          if (
            !source ||
            !source.properties?.id ||
            !relationship ||
            !relationship.elementId ||
            !target ||
            !target.properties?.id
          ) {
            return null;
          }

          return {
            source: {
              id: String(source.properties.id),

              labels: source.labels ?? [],

              properties: source.properties,
            },

            relationship: {
              id: relationship.elementId,

              type: relationship.type,

              properties: relationship.properties,
            },

            target: {
              id: String(target.properties.id),

              labels: target.labels ?? [],

              properties: target.properties,
            },
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET GRAPH CONTEXT
   * ------------------------------------------------------------------------
   */

  async getGraphContext() {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(graphVisualizationQuery);

      return result.records
        .map((record) => {
          const source = record.get("n") as GraphNode | null;

          const relationship = record.get("r") as GraphRelationship | null;

          const target = record.get("m") as GraphNode | null;

          if (
            !source ||
            !source.properties?.id ||
            !relationship ||
            !relationship.elementId ||
            !target ||
            !target.properties?.id
          ) {
            return null;
          }

          return {
            source: {
              id: String(source.properties.id),

              labels: source.labels ?? [],

              properties: source.properties,
            },

            relationship: {
              id: relationship.elementId,

              type: relationship.type,

              properties: relationship.properties,
            },

            target: {
              id: String(target.properties.id),

              labels: target.labels ?? [],

              properties: target.properties,
            },
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET CUSTOMER AI CONTEXT
   * ------------------------------------------------------------------------
   */

  async getCustomerAIContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerAIContextQuery, {
        customerId,
      });

      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];

      return {
        customer: mapNode(record.get("customer") as GraphNode | null),

        tickets: mapNodes(record.get("tickets") as GraphNode[] | null),

        products: mapNodes(record.get("products") as GraphNode[] | null),

        bugs: mapNodes(record.get("bugs") as GraphNode[] | null),

        teams: mapNodes(record.get("teams") as GraphNode[] | null),

        experts: mapNodes(record.get("experts") as GraphNode[] | null),

        resolutions: mapNodes(record.get("resolutions") as GraphNode[] | null),

        documents: mapNodes(record.get("documents") as GraphNode[] | null),

        features: mapNodes(record.get("features") as GraphNode[] | null),
      };
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * CUSTOMER EXISTS
   * ------------------------------------------------------------------------
   */

  async customerExists(customerId: string): Promise<boolean> {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(
        `
        MATCH (c:Customer {id: $customerId})
        RETURN c
        LIMIT 1
        `,
        {
          customerId,
        },
      );

      return result.records.length > 0;
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET CUSTOMER AI RELATIONSHIPS
   * ------------------------------------------------------------------------
   */

  async getCustomerAIRelationships(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerAIRelationshipsQuery, {
        customerId,
      });

      return result.records
        .map((record) => {
          const source = record.get("source") as GraphNode | null;

          const relationship = record.get("rel") as GraphRelationship | null;

          const target = record.get("target") as GraphNode | null;

          if (
            !source ||
            !source.properties?.id ||
            !relationship ||
            !relationship.elementId ||
            !target ||
            !target.properties?.id
          ) {
            return null;
          }

          return {
            id: relationship.elementId,

            source: String(source.properties.id),

            target: String(target.properties.id),

            type: relationship.type,

            properties: relationship.properties,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    } finally {
      await session.close();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * GET CUSTOMER RELEVANT CONTEXT
   * ------------------------------------------------------------------------
   */

  async getCustomerRelevantContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerRelevantContextQuery, {
        customerId,
      });

      return result.records
        .map((record) => {
          const source = record.get("source") as GraphNode | null;

          const relationship = record.get("rel") as GraphRelationship | null;

          const target = record.get("target") as GraphNode | null;

          if (
            !source ||
            !source.properties?.id ||
            !relationship ||
            !relationship.elementId ||
            !target ||
            !target.properties?.id
          ) {
            return null;
          }

          return {
            source: {
              id: String(source.properties.id),

              labels: source.labels ?? [],

              properties: source.properties,
            },

            relationship: {
              id: relationship.elementId,

              type: relationship.type,

              properties: relationship.properties,
            },

            target: {
              id: String(target.properties.id),

              labels: target.labels ?? [],

              properties: target.properties,
            },
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    } finally {
      await session.close();
    }
  }
}
