export const customerIssueContextQuery = `
MATCH (customer:Customer {id: $customerId})

OPTIONAL MATCH issuePath =
  (customer)
  -[:RAISED]->
  (ticket:Ticket)
  -[:RELATED_TO]->
  (bug:Bug)

OPTIONAL MATCH ownerPath =
  (bug)
  -[:OWNED_BY]->
  (team:Team)

OPTIONAL MATCH memberPath =
  (team)
  -[:HAS_MEMBER]->
  (person:Person)

OPTIONAL MATCH resolutionPath =
  (bug)
  -[:RESOLVED_BY]->
  (resolution:Resolution)

OPTIONAL MATCH productPath =
  (ticket)
  -[:ABOUT]->
  (product:Product)

RETURN
  customer,
  ticket,
  bug,
  team,
  person,
  resolution,
  product
`;