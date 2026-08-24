export const customerRelevantContextQuery = `
MATCH (customer:Customer {id: $customerId})
MATCH path = (customer)-[*1..4]-(related)

UNWIND relationships(path) AS rel

WITH DISTINCT rel

RETURN
  startNode(rel) AS source,
  rel,
  endNode(rel) AS target
`;