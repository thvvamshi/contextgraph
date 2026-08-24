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
    collect(
      DISTINCT ticket {
        .id,
        .title,
        .status,
        .priority,
        .createdAt
      }
    ) AS tickets,
    collect(
      DISTINCT product {
        .id,
        .name,
        .category,
        .status
      }
    ) AS products,
    collect(
      DISTINCT bug {
        .id,
        .title,
        .severity,
        .status
      }
    ) AS bugs
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
        -[:RAISED]->(ticket)

  OPTIONAL MATCH (ticket)-[:ABOUT]->(product:Product)
  OPTIONAL MATCH (ticket)-[:RELATED_TO]->(bug:Bug)
  OPTIONAL MATCH (bug)-[:RESOLVED_BY]->(resolution:Resolution)
  OPTIONAL MATCH (resolution)-[:DOCUMENTED_IN]->(document:Document)
  OPTIONAL MATCH (team:Team)-[:OWNED_BY]->(bug)
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
      .successRate
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
    collect(
      DISTINCT person {
        .id,
        .name,
        .role
      }
    ) AS experts
`;

export const similarTicketsQuery = `
  MATCH (currentTicket:Ticket {id: $ticketId})
        -[:ABOUT]->(product:Product)

  MATCH (similarTicket:Ticket)-[:ABOUT]->(product)
  WHERE similarTicket.id <> $ticketId

  MATCH (similarCustomer:Customer)-[:RAISED]->(similarTicket)

  OPTIONAL MATCH (similarTicket)-[:RELATED_TO]->(similarBug:Bug)
  OPTIONAL MATCH (similarBug)-[:RESOLVED_BY]->(similarResolution:Resolution)

  RETURN
    similarTicket {
      .id,
      .title,
      .status,
      .priority
    } AS ticket,
    similarCustomer {
      .id,
      .name,
      .tier
    } AS customer,
    similarBug {
      .id,
      .title,
      .severity
    } AS bug,
    similarResolution {
      .id,
      .summary
    } AS resolution

  LIMIT $limit
`;

export const resolutionPathQuery = `
  MATCH path = (customer:Customer)-[:RAISED]->(ticket:Ticket {id: $ticketId})
               -[:ABOUT]->(product:Product)
               <-[:AFFECTS]-(bug:Bug)
               -[:RESOLVED_BY]->(resolution:Resolution)
               -[:DOCUMENTED_IN]->(document:Document)

  RETURN path
`;