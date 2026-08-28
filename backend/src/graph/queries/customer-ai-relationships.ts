export const customerAIRelationshipsQuery = `
MATCH (c:Customer {id: $customerId})

OPTIONAL MATCH path1 = (c)-[:RAISED]->(ticket:Ticket)
OPTIONAL MATCH path2 = (ticket)-[:ABOUT]->(product:Product)
OPTIONAL MATCH path3 = (ticket)-[:RELATED_TO]->(bug:Bug)
OPTIONAL MATCH path4 = (bug)-[:OWNED_BY]->(team:Team)
OPTIONAL MATCH path5 = (team)-[:HAS_MEMBER]->(expert:Person)
OPTIONAL MATCH path6 = (bug)-[:RESOLVED_BY]->(resolution:Resolution)
OPTIONAL MATCH path7 = (resolution)-[:DOCUMENTED_IN]->(document:Document)
OPTIONAL MATCH path8 = (product)-[:HAS_FEATURE]->(feature:Feature)
OPTIONAL MATCH path9 = (product)-[:USES_COMPONENT]->(component:Component)
OPTIONAL MATCH path10 = (component)-[:USES]->(vendor:Vendor)
OPTIONAL MATCH path11 = (bug)-[:TRIGGERED]->(incident:Incident)
OPTIONAL MATCH path12 = (incident)-[:RESPONDED_BY]->(responder:Person)
OPTIONAL MATCH path13 = (incident)-[:AFFECTS]->(incidentComponent:Component)

WITH [
  path1,
  path2,
  path3,
  path4,
  path5,
  path6,
  path7,
  path8,
  path9,
  path10,
  path11,
  path12,
  path13
] AS paths

UNWIND paths AS path
WITH path
WHERE path IS NOT NULL

UNWIND relationships(path) AS rel

WITH DISTINCT rel

RETURN
  startNode(rel) AS source,
  rel,
  endNode(rel) AS target

ORDER BY type(rel)
`;