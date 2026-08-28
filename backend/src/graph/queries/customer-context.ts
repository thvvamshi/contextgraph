export const customerContextQuery = `
  MATCH (customer:Customer {id: $customerId})
        -[:RAISED]->(ticket:Ticket)
        -[:ABOUT]->(product:Product)

  OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)

  RETURN
    customer {
      .id,
      .name,
      .industry,
      .tier
    } AS customer,

    collect(DISTINCT ticket {
      .id,
      .title,
      .status,
      .priority,
      .createdAt
    }) AS tickets,

    collect(DISTINCT product {
      .id,
      .name,
      .category,
      .status
    }) AS products,

    collect(DISTINCT bug {
      .id,
      .title,
      .severity,
      .status
    }) AS bugs
`;

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

export const ticketContextQuery = `
  MATCH (ticket:Ticket {id: $ticketId})
        <-[:RAISED]-(customer:Customer)

  OPTIONAL MATCH (ticket)-[:ABOUT]->(product:Product)

  OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)

  OPTIONAL MATCH (bug)-[:RESOLVED_BY]->(resolution:Resolution)

  OPTIONAL MATCH (resolution)-[:DOCUMENTED_IN]->(document:Document)

  OPTIONAL MATCH (bug)-[:OWNED_BY]->(team:Team)

  OPTIONAL MATCH (team)-[:HAS_MEMBER]->(person:Person)

  RETURN
    ticket {
      .id,
      .title,
      .description,
      .status,
      .priority,
      .createdAt
    } AS ticket,

    customer {
      .id,
      .name,
      .tier,
      .industry
    } AS customer,

    product {
      .id,
      .name,
      .version,
      .category
    } AS product,

    bug {
      .id,
      .title,
      .severity,
      .status
    } AS bug,

    resolution {
      .id,
      .summary,
      .successRate,
      .status
    } AS resolution,

    document {
      .id,
      .title,
      .type,
      .url
    } AS document,

    team {
      .id,
      .name,
      .function
    } AS team,

    collect(DISTINCT person {
      .id,
      .name,
      .role
    }) AS experts
`;

export const similarTicketsQuery = `
  MATCH (currentCustomer:Customer)-[:RAISED]->(currentTicket:Ticket {id: $ticketId})
        -[:ABOUT]->(currentProduct:Product)

  MATCH (similarCustomer:Customer)-[:RAISED]->(similarTicket:Ticket)
        -[:ABOUT]->(similarProduct:Product)

  WHERE
    currentCustomer.id <> similarCustomer.id
    AND currentTicket.id <> similarTicket.id

  OPTIONAL MATCH (currentTicket)-[:RELATED_TO]->(currentBug:Bug)
  OPTIONAL MATCH (similarTicket)-[:RELATED_TO]->(similarBug:Bug)

  OPTIONAL MATCH (currentBug)-[:OWNED_BY]->(currentTeam:Team)
  OPTIONAL MATCH (similarBug)-[:OWNED_BY]->(similarTeam:Team)

  OPTIONAL MATCH (similarBug)-[:RESOLVED_BY]->(similarResolution:Resolution)

  WITH
    currentCustomer,
    currentTicket,
    currentProduct,
    currentBug,
    currentTeam,
    similarCustomer,
    similarTicket,
    similarProduct,
    similarBug,
    similarTeam,
    similarResolution

  WITH
    similarCustomer,
    similarTicket,
    similarProduct,
    similarBug,
    similarResolution,

    CASE
      WHEN similarProduct.id = currentProduct.id
      THEN 5
      ELSE 0
    END AS productScore,

    CASE
      WHEN currentBug IS NOT NULL
       AND similarBug IS NOT NULL
       AND currentBug.id = similarBug.id
      THEN 5
      ELSE 0
    END AS bugScore,

    CASE
      WHEN currentTeam IS NOT NULL
       AND similarTeam IS NOT NULL
       AND currentTeam.id = similarTeam.id
      THEN 3
      ELSE 0
    END AS teamScore

  WITH
    similarCustomer,
    similarTicket,
    similarProduct,
    similarBug,
    similarResolution,
    productScore,
    bugScore,
    teamScore,

    (
      productScore +
      bugScore +
      teamScore
    ) AS similarityScore

  WHERE similarityScore > 0

  RETURN
    similarTicket {
      .id,
      .title,
      .status,
      .priority,
      .createdAt
    } AS ticket,

    similarCustomer {
      .id,
      .name,
      .tier
    } AS customer,

    similarBug {
      .id,
      .title,
      .severity,
      .status
    } AS bug,

    similarResolution {
      .id,
      .title,
      .summary,
      .status,
      .successRate
    } AS resolution,

    similarityScore,

    [reason IN [
      CASE
        WHEN productScore > 0
        THEN "Same product"
        ELSE NULL
      END,

      CASE
        WHEN bugScore > 0
        THEN "Same bug"
        ELSE NULL
      END,

      CASE
        WHEN teamScore > 0
        THEN "Same owning team"
        ELSE NULL
      END
    ] WHERE reason IS NOT NULL] AS similarityReasons

  ORDER BY
    similarityScore DESC,
    ticket.createdAt DESC

  LIMIT $limit
`;

export const resolutionPathQuery = `
  MATCH path =
    (customer:Customer)
      -[:RAISED]->(ticket:Ticket {id: $ticketId})
      -[:RELATED_TO]->(bug:Bug)
      -[:RESOLVED_BY]->(resolution:Resolution)
      -[:DOCUMENTED_IN]->(document:Document)

  RETURN path
`;
