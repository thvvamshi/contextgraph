export interface AIEvidence {
  source: string;
  relationship: string;
  target: string;
}

export interface AIContextSummary {
  customer: string | null;
  ticketCount: number;
  productCount: number;
  bugCount: number;
  teamCount: number;
  expertCount: number;
  resolutionCount: number;
  documentCount: number;
  featureCount: number;
  relationshipCount: number;
}

export interface AIAnswerData {
  customerId: string;
  question: string;
  answer: string;
  model: string;
  evidence: AIEvidence[];
  contextSummary: AIContextSummary;
}

export interface AIAnswerResponse {
  success: boolean;
  data: AIAnswerData;
}