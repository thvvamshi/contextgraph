export interface AIProviderRequest {
  systemPrompt: string;
  userPrompt: string;
}

export interface AIProviderResponse {
  content: string;
  model: string;
}

export interface AIProvider {
  generate(
    request: AIProviderRequest
  ): Promise<AIProviderResponse>;
}