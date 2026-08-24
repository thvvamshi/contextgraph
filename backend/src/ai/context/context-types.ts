export interface ContextEntity {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface CustomerAIContext {
  customer: ContextEntity | null;
  tickets: ContextEntity[];
  products: ContextEntity[];
  bugs: ContextEntity[];
  teams: ContextEntity[];
  experts: ContextEntity[];
  resolutions: ContextEntity[];
  documents: ContextEntity[];
  features: ContextEntity[];
}

export interface AIContext {
  customerId: string;
  customerContext: CustomerAIContext;
}