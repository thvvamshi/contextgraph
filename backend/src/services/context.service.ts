import { GraphRepository } from "../repositories/graph.repository.js";

export class ContextService {
  constructor(private readonly graphRepository: GraphRepository) {}

  async getShowcaseContext(customerTier: string) {
    return this.graphRepository.getShowcaseContext(customerTier);
  }
}