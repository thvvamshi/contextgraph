export const customerRelevantContextQuery = `
MATCH (customer:Customer {id: $customerId})

OPTIONAL MATCH path1 = (customer)-[:RAISED]->(ticket:Ticket)
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

/*
 * --------------------------------------------------------------------------
 * CROSS-CUSTOMER HISTORICAL CONTEXT
 * --------------------------------------------------------------------------
 *
 * Find tickets raised by OTHER customers that share the same
 * product and/or underlying bug.
 *
 * This allows the AI layer to answer questions such as:
 *
 * "Have other customers experienced this issue?"
 *
 * and:
 *
 * "How was the similar issue resolved?"
 */
OPTIONAL MATCH path14 =
  (customer)-[:RAISED]->(currentTicket:Ticket)
  -[:ABOUT]->(currentProduct:Product)

OPTIONAL MATCH path15 =
  (currentTicket)-[:RELATED_TO]->(currentBug:Bug)

OPTIONAL MATCH path16 =
  (similarCustomer:Customer)-[:RAISED]->(similarTicket:Ticket)
  -[:ABOUT]->(similarProduct:Product)

WHERE
  similarCustomer.id <> customer.id
  AND (
    similarProduct.id = currentProduct.id
    OR (
      currentBug IS NOT NULL
      AND EXISTS {
        MATCH (similarTicket)-[:RELATED_TO]->(similarBug:Bug)
        WHERE similarBug.id = currentBug.id
      }
    )
  )

OPTIONAL MATCH path17 =
  (similarTicket)-[:RELATED_TO]->(similarTicketBug:Bug)

OPTIONAL MATCH path18 =
  (similarTicketBug)-[:OWNED_BY]->(similarTeam:Team)

OPTIONAL MATCH path19 =
  (similarTicketBug)-[:RESOLVED_BY]->(similarResolution:Resolution)

OPTIONAL MATCH path20 =
  (similarResolution)-[:DOCUMENTED_IN]->(similarDocument:Document)

OPTIONAL MATCH path21 =
  (similarTicketBug)-[:TRIGGERED]->(similarIncident:Incident)

OPTIONAL MATCH path22 =
  (similarIncident)-[:AFFECTS]->(similarIncidentComponent:Component)

OPTIONAL MATCH path23 =
  (similarIncident)-[:RESPONDED_BY]->(similarResponder:Person)

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
  path13,
  path14,
  path15,
  path16,
  path17,
  path18,
  path19,
  path20,
  path21,
  path22,
  path23
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
`;