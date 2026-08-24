export const customerAIContextQuery = `
MATCH (customer:Customer {id: $customerId})

OPTIONAL MATCH (customer)-[:RAISED]->(ticket:Ticket)
OPTIONAL MATCH (ticket)-[:ABOUT]->(product:Product)
OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)
OPTIONAL MATCH (bug)-[:OWNED_BY]->(team:Team)
OPTIONAL MATCH (team)-[:HAS_MEMBER]->(expert:Person)
OPTIONAL MATCH (bug)-[:RESOLVED_BY]->(resolution:Resolution)
OPTIONAL MATCH (resolution)-[:DOCUMENTED_IN]->(document:Document)
OPTIONAL MATCH (product)-[:HAS_FEATURE]->(feature:Feature)

RETURN
  customer,
  collect(DISTINCT ticket) AS tickets,
  collect(DISTINCT product) AS products,
  collect(DISTINCT bug) AS bugs,
  collect(DISTINCT team) AS teams,
  collect(DISTINCT expert) AS experts,
  collect(DISTINCT resolution) AS resolutions,
  collect(DISTINCT document) AS documents,
  collect(DISTINCT feature) AS features
`;