import {
  AIContext,
  CustomerAIContext,
} from "./context-types.js";

export class ContextBuilder {
  build(
    customerId: string,
    context: CustomerAIContext
  ): AIContext {
    return {
      customerId,
      customerContext: {
        customer: context.customer,
        tickets: context.tickets,
        products: context.products,
        bugs: context.bugs,
        teams: context.teams,
        experts: context.experts,
        resolutions: context.resolutions,
        documents: context.documents,
        features: context.features,
      },
    };
  }
}