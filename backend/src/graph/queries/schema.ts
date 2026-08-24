export const schemaQueries = [
  `
  CREATE CONSTRAINT customer_id_unique IF NOT EXISTS
  FOR (n:Customer)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT ticket_id_unique IF NOT EXISTS
  FOR (n:Ticket)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT product_id_unique IF NOT EXISTS
  FOR (n:Product)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT feature_id_unique IF NOT EXISTS
  FOR (n:Feature)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT bug_id_unique IF NOT EXISTS
  FOR (n:Bug)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT team_id_unique IF NOT EXISTS
  FOR (n:Team)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT person_id_unique IF NOT EXISTS
  FOR (n:Person)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT resolution_id_unique IF NOT EXISTS
  FOR (n:Resolution)
  REQUIRE n.id IS UNIQUE
  `,

  `
  CREATE CONSTRAINT document_id_unique IF NOT EXISTS
  FOR (n:Document)
  REQUIRE n.id IS UNIQUE
  `,
];