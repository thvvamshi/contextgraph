import axios from "axios";

import type { AIAnswerResponse } from "../types/ai-context";
import type { GraphNode } from "../types/graph";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Customer returned by:
 * GET /api/customers
 */
export interface CustomerOption {
  id: string;
  name: string;
  tier: string;
}

/*
 * Get complete graph.
 */
export async function getGraph() {
  const response = await api.get<{
    success: boolean;
    data: {
      nodes: GraphNode[];
      links: {
        id: string;
        source: string;
        target: string;
        type: string;
        properties: Record<string, unknown>;
      }[];
    };
  }>("/graph");

  return response.data;
}

/*
 * Get all customers dynamically
 * from Neo4j through the backend.
 */
export async function getCustomers() {
  const response = await api.get<{
    success: boolean;
    data: CustomerOption[];
  }>("/customers");

  return response.data;
}

/*
 * Ask graph-grounded AI agent.
 */
export async function askAgent(customerId: string, question: string) {
  const response = await api.post<AIAnswerResponse>(
    `/ai-context/customers/${customerId}/query`,
    {
      question,
    },
  );

  return response.data;
}

export default api;
