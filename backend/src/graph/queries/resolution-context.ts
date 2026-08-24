export const resolutionContextQuery = `
  MATCH (customer:Customer {id: $customerId})
        -[:RAISED]->(ticket:Ticket)
        -[:RELATED_TO]->(bug:Bug)
        -[:RESOLVED_BY]->(resolution:Resolution)
        -[:DOCUMENTED_IN]->(document:Document)

  RETURN
    customer {
      .id,
      .name
    } AS customer,

    ticket {
      .id,
      .title,
      .status,
      .priority
    } AS ticket,

    bug {
      .id,
      .title,
      .severity,
      .status
    } AS bug,

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
`;