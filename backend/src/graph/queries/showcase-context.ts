export const showcaseContextQuery = `
  MATCH (customer:Customer)
  WHERE customer.tier = $customerTier

  MATCH (customer)-[:RAISED]->(ticket:Ticket)
        -[:ABOUT]->(product:Product)

  OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)
  OPTIONAL MATCH (bug)-[:OWNED_BY]->(team:Team)
  OPTIONAL MATCH (team)-[:HAS_MEMBER]->(person:Person)
  OPTIONAL MATCH (bug)-[:RESOLVED_BY]->(resolution:Resolution)
  OPTIONAL MATCH (resolution)-[:DOCUMENTED_IN]->(document:Document)

  RETURN
    customer {
      .id,
      .name,
      .industry,
      .tier
    } AS customer,

    ticket {
      .id,
      .title,
      .status,
      .priority,
      .createdAt
    } AS ticket,

    product {
      .id,
      .name,
      .category,
      .status
    } AS product,

    bug {
      .id,
      .title,
      .severity,
      .status
    } AS bug,

    team {
      .id,
      .name,
      .function
    } AS team,

    person {
      .id,
      .name,
      .role
    } AS expert,

    resolution {
      .id,
      .title,
      .status
    } AS resolution,

    document {
      .id,
      .title,
      .type
    } AS document

  ORDER BY customer.name, ticket.createdAt DESC
`;