import axios from "axios";
import type { AIAnswerResponse } from "../types/ai-context";
import type { GraphNode } from "../types/graph";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export async function askAgent(
  customerId: string,
  question: string,
) {
  const response =
    await api.post<AIAnswerResponse>(
      `/ai-context/customers/${customerId}/query`,
      {
        question,
      },
    );

  return response.data;
}

export default api;