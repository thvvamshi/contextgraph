import { GraphRepository } from "../repositories/graph.repository.js";

export class CustomerService {
  constructor(private readonly graphRepository: GraphRepository) {}

  /**
   * --------------------------------------------------------------------------
   * GET ALL CUSTOMERS
   * --------------------------------------------------------------------------
   *
   * Used by the frontend customer selector.
   *
   * The data comes directly from the graph repository / Neo4j.
   */
  async getCustomers() {
    return this.graphRepository.getCustomers();
  }

  /**
   * --------------------------------------------------------------------------
   * GET CUSTOMER CONTEXT
   * --------------------------------------------------------------------------
   */
  async getCustomerContext(customerId: string) {
    return this.graphRepository.getCustomerContext(customerId);
  }

  /**
   * --------------------------------------------------------------------------
   * DISCOVER CUSTOMER EXPERTS
   * --------------------------------------------------------------------------
   */
  async discoverExperts(customerId: string) {
    return this.graphRepository.discoverExperts(customerId);
  }

  /**
   * --------------------------------------------------------------------------
   * GET CUSTOMER RESOLUTION CONTEXT
   * --------------------------------------------------------------------------
   */
  async getResolutionContext(customerId: string) {
    return this.graphRepository.getResolutionContext(customerId);
  }

  /**
   * --------------------------------------------------------------------------
   * GET CUSTOMER AGENT CONTEXT
   * --------------------------------------------------------------------------
   */
  async getAgentContext(customerId: string) {
    return this.graphRepository.getAgentContext(customerId);
  }

  /**
   * --------------------------------------------------------------------------
   * GET SIMILAR TICKETS
   * --------------------------------------------------------------------------
   */
  async getSimilarTickets(ticketId: string, limit = 5) {
    return this.graphRepository.getSimilarTickets(ticketId, limit);
  }
}
