import { Request, Response } from "express";

import { GraphService } from "../services/graph.service.js";

export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  getGraphVisualization = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = await this.graphService.getGraphVisualization();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Graph visualization error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve graph visualization",
      });
    }
  };
}