import { GraphRepository } from "../repositories/graph.repository.js";
import { ContextBuilder } from "../ai/context/context-builder.js";
import { AIContext } from "../ai/context/context-types.js";

export class AIContextService {
  private readonly contextBuilder: ContextBuilder;

  constructor(
    private readonly graphRepository: GraphRepository
  ) {
    this.contextBuilder = new ContextBuilder();
  }

  async buildCustomerContext(
    customerId: string
  ): Promise<AIContext> {
    const exists =
      await this.graphRepository.customerExists(customerId);

    if (!exists) {
      const error = new Error("Customer not found");

      (error as Error & { statusCode?: number }).statusCode = 404;

      throw error;
    }

    const context =
      await this.graphRepository.getCustomerAIContext(customerId);

    if (!context) {
      const error = new Error("Customer context not found");

      (error as Error & { statusCode?: number }).statusCode = 404;

      throw error;
    }

    return this.contextBuilder.build(customerId, context);
  }
}