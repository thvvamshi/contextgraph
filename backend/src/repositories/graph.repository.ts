import { getDriver } from "../config/database.js";

import { customerContextQuery } from "../graph/queries/customer-context.js";
import { expertDiscoveryQuery } from "../graph/queries/expert-discovery.js";
import { resolutionContextQuery } from "../graph/queries/resolution-context.js";
import { showcaseContextQuery } from "../graph/queries/showcase-context.js";
import { agentContextQuery } from "../graph/queries/agent-context.js";
import { graphVisualizationQuery } from "../graph/queries/graph-visualization.js";
import { customerAIContextQuery } from "../graph/queries/customer-ai-context.js";
import { customerAIRelationshipsQuery } from "../graph/queries/customer-ai-relationships.js";
import { customerRelevantContextQuery } from "../graph/queries/customer-relevant-context.js";

interface GraphNode {
  properties: {
    id: string;
    name?: string;
    title?: string;
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

const mapNode = (node: GraphNode | null): ContextEntity | null => {
  if (!node) {
    return null;
  }

  return {
    id: String(node.properties.id),
    label: String(
      node.properties.name ?? node.properties.title ?? node.properties.id,
    ),
    type: node.labels[0],
    properties: node.properties,
  };
};

const mapNodes = (nodes: GraphNode[]): ContextEntity[] => {
  const mappedNodes: ContextEntity[] = [];

  for (const node of nodes) {
    const mappedNode = mapNode(node);

    if (mappedNode) {
      mappedNodes.push(mappedNode);
    }
  }

  return mappedNodes;
};

export class GraphRepository {
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

  async getGraphVisualization() {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(graphVisualizationQuery);

      return result.records.map((record) => {
        const source = record.get("n") as GraphNode;
        const relationship = record.get("r") as GraphRelationship;
        const target = record.get("m") as GraphNode;

        return {
          source: {
            id: source.properties.id,
            labels: source.labels,
            properties: source.properties,
          },

          relationship: {
            id: relationship.elementId,
            type: relationship.type,
            properties: relationship.properties,
          },

          target: {
            id: target.properties.id,
            labels: target.labels,
            properties: target.properties,
          },
        };
      });
    } finally {
      await session.close();
    }
  }

  async getGraphContext() {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(graphVisualizationQuery);

      return result.records.map((record) => {
        const source = record.get("n") as GraphNode;
        const relationship = record.get("r") as GraphRelationship;
        const target = record.get("m") as GraphNode;

        return {
          source: {
            id: source.properties.id,
            labels: source.labels,
            properties: source.properties,
          },

          relationship: {
            id: relationship.elementId,
            type: relationship.type,
            properties: relationship.properties,
          },

          target: {
            id: target.properties.id,
            labels: target.labels,
            properties: target.properties,
          },
        };
      });
    } finally {
      await session.close();
    }
  }

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
        tickets: mapNodes(record.get("tickets") as GraphNode[]),
        products: mapNodes(record.get("products") as GraphNode[]),
        bugs: mapNodes(record.get("bugs") as GraphNode[]),
        teams: mapNodes(record.get("teams") as GraphNode[]),
        experts: mapNodes(record.get("experts") as GraphNode[]),
        resolutions: mapNodes(record.get("resolutions") as GraphNode[]),
        documents: mapNodes(record.get("documents") as GraphNode[]),
        features: mapNodes(record.get("features") as GraphNode[]),
      };
    } finally {
      await session.close();
    }
  }

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
        { customerId },
      );

      return result.records.length > 0;
    } finally {
      await session.close();
    }
  }

  async getCustomerAIRelationships(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerAIRelationshipsQuery, {
        customerId,
      });

      return result.records.map((record) => {
        const source = record.get("source");
        const relationship = record.get("rel");
        const target = record.get("target");

        return {
          id: relationship.elementId,
          source: String(source.properties.id),
          target: String(target.properties.id),
          type: relationship.type,
          properties: relationship.properties,
        };
      });
    } finally {
      await session.close();
    }
  }

  async getCustomerRelevantContext(customerId: string) {
    const driver = getDriver();
    const session = driver.session();

    try {
      const result = await session.run(customerRelevantContextQuery, {
        customerId,
      });

      return result.records.map((record) => {
        const source = record.get("source") as GraphNode;
        const relationship = record.get("rel") as GraphRelationship;
        const target = record.get("target") as GraphNode;

        return {
          source: {
            id: String(source.properties.id),
            labels: source.labels,
            properties: source.properties,
          },

          relationship: {
            id: relationship.elementId,
            type: relationship.type,
            properties: relationship.properties,
          },

          target: {
            id: String(target.properties.id),
            labels: target.labels,
            properties: target.properties,
          },
        };
      });
    } finally {
      await session.close();
    }
  }
}
