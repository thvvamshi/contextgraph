import axios from "axios";
import type { GraphResponse } from "../types/graph";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export async function getGraph(): Promise<GraphResponse> {
  const response = await api.get<GraphResponse>("/graph", {
    params: {
      _: Date.now(),
    },
  });

  console.log("AXIOS RESPONSE:", response.data);

  return response.data;
}