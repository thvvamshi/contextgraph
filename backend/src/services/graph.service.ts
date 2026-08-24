import { GraphRepository } from "../repositories/graph.repository.js";

interface GraphRecord {
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

interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, unknown>;
}

export class GraphService {
  constructor(private readonly graphRepository: GraphRepository) {}

  async getGraphVisualization() {
    const records =
      (await this.graphRepository.getGraphVisualization()) as GraphRecord[];

    const nodes = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    for (const record of records) {
      const sourceType = record.source.labels[0] ?? "Unknown";
      const targetType = record.target.labels[0] ?? "Unknown";

      nodes.set(record.source.id, {
        id: record.source.id,
        label: this.getNodeLabel(record.source.properties),
        type: sourceType,
        properties: record.source.properties,
      });

      nodes.set(record.target.id, {
        id: record.target.id,
        label: this.getNodeLabel(record.target.properties),
        type: targetType,
        properties: record.target.properties,
      });

      links.push({
        id: record.relationship.id,
        source: record.source.id,
        target: record.target.id,
        type: record.relationship.type,
        properties: record.relationship.properties,
      });
    }

    return {
      nodes: Array.from(nodes.values()),
      links,
    };
  }

  private getNodeLabel(
    properties: Record<string, unknown>
  ): string {
    if (typeof properties.name === "string") {
      return properties.name;
    }

    if (typeof properties.title === "string") {
      return properties.title;
    }

    if (typeof properties.id === "string") {
      return properties.id;
    }

    return "Unknown";
  }
}