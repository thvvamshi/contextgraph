export const graphVisualizationQuery = `
MATCH (n)-[r]->(m)
RETURN
  n,
  r,
  m
ORDER BY labels(n)[0], n.id
`;