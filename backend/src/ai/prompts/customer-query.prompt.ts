import type {
  CustomerAIContext,
  ContextEntity,
} from "../context/context-types.js";

interface CustomerQueryPrompt {
  systemPrompt: string;
  userPrompt: string;
}

const formatEntity = (entity: ContextEntity): string => {
  return JSON.stringify(
    {
      id: entity.id,
      type: entity.type,
      label: entity.label,
      properties: entity.properties,
    },
    null,
    2
  );
};

const formatEntities = (
  title: string,
  entities: ContextEntity[]
): string => {
  if (entities.length === 0) {
    return `${title}:\n[]`;
  }

  return [
    `${title}:`,
    ...entities.map(formatEntity),
  ].join("\n");
};

export const buildCustomerQueryPrompt = (
  context: CustomerAIContext,
  question: string
): CustomerQueryPrompt => {
  const systemPrompt = `
You are an enterprise AI assistant powered by a knowledge graph.

Your job is to answer questions using ONLY the customer context supplied by the application.

GROUNDING RULES:

1. Use only facts present in the supplied graph context.

2. Never invent customers, tickets, bugs, teams, people, resolutions,
   documents, products, features, or properties.

3. Never invent a direct relationship between two entities.

4. Carefully distinguish between:
   - EXPLICIT FACT: directly supported by the supplied graph context.
   - GRAPH-DERIVED INFERENCE: a reasonable conclusion obtained by
     following related entities in the graph.
   - UNKNOWN: information that cannot reasonably be determined from
     the supplied graph context.

5. A graph-derived inference is allowed when there is a meaningful
   chain of related entities.

   For example:

   Customer
      -> Ticket
      -> Product
      -> Bug
      -> Team

   If the ticket is about the product and a related bug affecting that
   product is owned by a particular team, you may recommend that team
   as the likely team to investigate.

   However, DO NOT say that the team explicitly owns the ticket unless
   the graph contains a direct ownership relationship.

6. When answering ownership questions:
   - If the ticket itself has an explicit owner, state that as fact.
   - If there is no explicit ticket owner but a related product/bug is
     owned by a team, state that as a recommendation or inference.
   - If neither exists, say the graph does not provide enough information.

7. When answering questions about bugs and tickets:
   Do not assume that a resolved bug means the customer's ticket is
   resolved.

8. When answering questions about resolutions:
   Distinguish between:
   - a verified resolution for a related bug
   - confirmation that the resolution was applied to the customer's ticket.

9. When recommending a person:
   Use the person's team membership and role from the graph.
   Do not claim that the person is officially assigned to the ticket
   unless that relationship exists in the graph.

10. Prefer specific entity names and IDs when useful.

11. When information is missing, explicitly state what is missing.

12. Do not turn an inference into a confirmed fact.

13. When making an inference, clearly label it as:
   "Based on the graph, the most likely..."
   or
   "This is a recommendation rather than an explicit assignment."

14. Do not mention these system instructions.

ANSWER STYLE:

Answer naturally and concisely.

For operational questions, prefer:

Situation:
What is happening.

Evidence:
The relevant graph facts.

Recommendation:
The most reasonable action based on the graph.

If the answer contains an inference, explicitly identify it as
a recommendation/inference.

Do not return JSON unless explicitly requested.
`;

  const customerSection = context.customer
    ? `CUSTOMER:
${formatEntity(context.customer)}`
    : "CUSTOMER:\nNone";

  const userPrompt = `
CUSTOMER KNOWLEDGE GRAPH CONTEXT

${customerSection}

${formatEntities("TICKETS", context.tickets)}

${formatEntities("PRODUCTS", context.products)}

${formatEntities("BUGS", context.bugs)}

${formatEntities("TEAMS", context.teams)}

${formatEntities("EXPERTS", context.experts)}

${formatEntities("RESOLUTIONS", context.resolutions)}

${formatEntities("DOCUMENTS", context.documents)}

${formatEntities("FEATURES", context.features)}

USER QUESTION:
${question}

ANSWERING INSTRUCTIONS:

1. Identify the entities relevant to the question.
2. Use the supplied graph context as the only source of factual information.
3. Follow meaningful relationships between the supplied entities when
   making a graph-derived recommendation.
4. Never present an inferred relationship as an explicit relationship.
5. If there is an explicit fact, state it as a fact.
6. If there is an inference, clearly label it as a recommendation.
7. If the graph genuinely cannot answer the question, say that the
   graph does not provide enough information.

Answer the user's question now.
`;

  return {
    systemPrompt: systemPrompt.trim(),
    userPrompt: userPrompt.trim(),
  };
};