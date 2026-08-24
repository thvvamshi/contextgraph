export const expertDiscoveryQuery = `
  MATCH (customer:Customer {id: $customerId})
        -[:RAISED]->(ticket:Ticket)
        -[:RELATED_TO]->(bug:Bug)
        -[:OWNED_BY]->(team:Team)
        -[:HAS_MEMBER]->(person:Person)

  RETURN DISTINCT
    customer {
      .id,
      .name
    } AS customer,

    ticket {
      .id,
      .title,
      .priority,
      .status
    } AS ticket,

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
    } AS expert

  ORDER BY bug.severity DESC, person.name
`;