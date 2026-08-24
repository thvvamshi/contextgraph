import { GraphRepository } from "../repositories/graph.repository.js";

export class CustomerService {
  constructor(private readonly graphRepository: GraphRepository) {}

  async getCustomerContext(customerId: string) {
    return this.graphRepository.getCustomerContext(customerId);
  }

  async discoverExperts(customerId: string) {
    return this.graphRepository.discoverExperts(customerId);
  }

  async getResolutionContext(customerId: string) {
    return this.graphRepository.getResolutionContext(customerId);
  }

  async getAgentContext(customerId: string) {
    return this.graphRepository.getAgentContext(customerId);
  }
}
