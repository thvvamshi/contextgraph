export const customerRelevantContextQuery = `
MATCH (customer:Customer {id: $customerId})

OPTIONAL MATCH (customer)-[:RAISED]->(ticket:Ticket)

OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)

OPTIONAL MATCH (ticket)-[:ABOUT]->(product:Product)

OPTIONAL MATCH (bug)-[:OWNED_BY]->(team:Team)

OPTIONAL MATCH (team)-[:HAS_MEMBER]->(person:Person)

OPTIONAL MATCH (bug)-[:RESOLVED_BY]->(resolution:Resolution)

OPTIONAL MATCH (resolution)-[:DOCUMENTED_IN]->(document:Document)

RETURN
  customer,
  ticket,
  bug,
  product,
  team,
  person,
  resolution,
  document
`;