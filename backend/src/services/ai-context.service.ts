import { GraphRepository } from "../repositories/graph.repository.js";
import { ContextBuilder } from "../ai/context/context-builder.js";
import { AIContext } from "../ai/context/context-types.js";
import { buildCustomerContextPrompt } from "../ai/prompts/customer-context.prompt.js";
import { AIProvider } from "../ai/providers/ai-provider.js";
import { OpenRouterProvider } from "../ai/providers/openrouter.provider.js";

export class AIContextService {
  private readonly contextBuilder: ContextBuilder;
  private readonly aiProvider: AIProvider;

  constructor(
    private readonly graphRepository: GraphRepository
  ) {
    this.contextBuilder = new ContextBuilder();
    this.aiProvider = new OpenRouterProvider();
  }

  async buildCustomerContext(
    customerId: string
  ): Promise<AIContext> {
    const context =
      await this.graphRepository.getCustomerAIContext(customerId);

    if (!context) {
      throw new Error("Customer not found");
    }

    return this.contextBuilder.build(
      customerId,
      context
    );
  }

  async answerCustomerQuestion(
    customerId: string,
    question: string
  ) {
    const aiContext =
      await this.buildCustomerContext(customerId);

    const {
      systemPrompt,
      userPrompt,
    } = buildCustomerContextPrompt(
      aiContext.customerContext,
      question
    );

    const response =
      await this.aiProvider.generate({
        systemPrompt,
        userPrompt,
      });

    return {
      customerId,
      question,
      answer: response.content,
      model: response.model,
      context: aiContext.customerContext,
    };
  }
}