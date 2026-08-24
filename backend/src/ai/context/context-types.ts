export interface ContextEntity {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface ContextRelationship {
  id: string;
  source: string;
  target: string;
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

  relationships: ContextRelationship[];
}

export interface AIContext {
  customerId: string;
  customerContext: CustomerAIContext;
}

export interface AIEvidence {
  source: string;
  relationship: string;
  target: string;
}

export interface AIAnswer {
  customerId: string;
  question: string;
  answer: string;
  model: string;
  evidence: AIEvidence[];
  context: CustomerAIContext;
}