export const customerAIRelationshipsQuery = `
MATCH (c:Customer {id: $customerId})
MATCH path = (c)-[*1..4]-(n)
UNWIND relationships(path) AS rel

WITH DISTINCT rel
RETURN
  startNode(rel) AS source,
  rel,
  endNode(rel) AS target
ORDER BY type(rel)
`;