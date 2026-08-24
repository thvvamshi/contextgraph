import { getDriver } from "../../config/database.js";

const customers = [
  {
    id: "customer-acme",
    name: "Acme Corporation",
    industry: "FinTech",
    tier: "Enterprise",
  },
  {
    id: "customer-globex",
    name: "Globex Financial",
    industry: "Banking",
    tier: "Enterprise",
  },
  {
    id: "customer-nova",
    name: "Nova Retail",
    industry: "Retail",
    tier: "Growth",
  },
];

const products = [
  {
    id: "product-payment-api",
    name: "Payment API",
    category: "Payments",
    status: "active",
  },
  {
    id: "product-checkout",
    name: "Checkout Platform",
    category: "Commerce",
    status: "active",
  },
  {
    id: "product-auth",
    name: "Identity & Authentication",
    category: "Security",
    status: "active",
  },
];

const features = [
  {
    id: "feature-payment-processing",
    name: "Payment Processing",
    description: "Processes card and wallet payments",
  },
  {
    id: "feature-webhooks",
    name: "Payment Webhooks",
    description: "Delivers payment lifecycle events",
  },
  {
    id: "feature-checkout-session",
    name: "Checkout Sessions",
    description: "Creates and manages checkout sessions",
  },
  {
    id: "feature-oauth",
    name: "OAuth Authentication",
    description: "Provides OAuth-based authentication",
  },
];

const teams = [
  {
    id: "team-payments",
    name: "Payments Platform",
    function: "Engineering",
  },
  {
    id: "team-checkout",
    name: "Checkout Engineering",
    function: "Engineering",
  },
  {
    id: "team-identity",
    name: "Identity Platform",
    function: "Engineering",
  },
];

const people = [
  {
    id: "person-rahul",
    name: "Rahul Sharma",
    role: "Senior Backend Engineer",
  },
  {
    id: "person-ananya",
    name: "Ananya Reddy",
    role: "Payments Engineer",
  },
  {
    id: "person-arjun",
    name: "Arjun Mehta",
    role: "Staff Engineer",
  },
  {
    id: "person-priya",
    name: "Priya Nair",
    role: "Support Engineer",
  },
];

const bugs = [
  {
    id: "bug-221",
    title: "Payment API returning intermittent 500 errors",
    severity: "critical",
    status: "resolved",
  },
  {
    id: "bug-235",
    title: "Duplicate webhook delivery",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-247",
    title: "Checkout session timeout",
    severity: "high",
    status: "investigating",
  },
];

const resolutions = [
  {
    id: "resolution-87",
    title: "Increase payment gateway timeout and retry policy",
    status: "verified",
  },
  {
    id: "resolution-91",
    title: "Add webhook idempotency key",
    status: "verified",
  },
  {
    id: "resolution-103",
    title: "Increase checkout session TTL",
    status: "verified",
  },
];

const documents = [
  {
    id: "document-payment-runbook",
    title: "Payment API Incident Runbook",
    type: "runbook",
  },
  {
    id: "document-webhook-guide",
    title: "Webhook Reliability Guide",
    type: "technical-guide",
  },
  {
    id: "document-checkout-runbook",
    title: "Checkout Troubleshooting Runbook",
    type: "runbook",
  },
];

const tickets = [
  {
    id: "ticket-1042",
    title: "Acme payment requests returning 500",
    status: "open",
    priority: "urgent",
    createdAt: "2026-08-20T09:30:00Z",
    customerId: "customer-acme",
    productId: "product-payment-api",
    bugId: "bug-221",
  },
  {
    id: "ticket-1057",
    title: "Duplicate payment webhook events",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-18T14:20:00Z",
    customerId: "customer-globex",
    productId: "product-payment-api",
    bugId: "bug-235",
  },
  {
    id: "ticket-1071",
    title: "Checkout sessions expire unexpectedly",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-22T11:45:00Z",
    customerId: "customer-nova",
    productId: "product-checkout",
    bugId: "bug-247",
  },
];

const productFeatures = [
  {
    productId: "product-payment-api",
    featureId: "feature-payment-processing",
  },
  {
    productId: "product-payment-api",
    featureId: "feature-webhooks",
  },
  {
    productId: "product-checkout",
    featureId: "feature-checkout-session",
  },
  {
    productId: "product-auth",
    featureId: "feature-oauth",
  },
];

const bugTeams = [
  {
    bugId: "bug-221",
    teamId: "team-payments",
  },
  {
    bugId: "bug-235",
    teamId: "team-payments",
  },
  {
    bugId: "bug-247",
    teamId: "team-checkout",
  },
];

const teamMembers = [
  {
    teamId: "team-payments",
    personId: "person-rahul",
  },
  {
    teamId: "team-payments",
    personId: "person-ananya",
  },
  {
    teamId: "team-checkout",
    personId: "person-arjun",
  },
  {
    teamId: "team-payments",
    personId: "person-priya",
  },
];

const bugResolutions = [
  {
    bugId: "bug-221",
    resolutionId: "resolution-87",
  },
  {
    bugId: "bug-235",
    resolutionId: "resolution-91",
  },
  {
    bugId: "bug-247",
    resolutionId: "resolution-103",
  },
];

const resolutionDocuments = [
  {
    resolutionId: "resolution-87",
    documentId: "document-payment-runbook",
  },
  {
    resolutionId: "resolution-91",
    documentId: "document-webhook-guide",
  },
  {
    resolutionId: "resolution-103",
    documentId: "document-checkout-runbook",
  },
];

type SeedStep = {
  name: string;
  query: string;
  parameters: Record<string, unknown>;
};

const seedSteps: SeedStep[] = [
  {
    name: "customers",
    query: `
      UNWIND $rows AS row
      MERGE (n:Customer {id: row.id})
      SET n.name = row.name,
          n.industry = row.industry,
          n.tier = row.tier
    `,
    parameters: { rows: customers },
  },

  {
    name: "products",
    query: `
      UNWIND $rows AS row
      MERGE (n:Product {id: row.id})
      SET n.name = row.name,
          n.category = row.category,
          n.status = row.status
    `,
    parameters: { rows: products },
  },

  {
    name: "features",
    query: `
      UNWIND $rows AS row
      MERGE (n:Feature {id: row.id})
      SET n.name = row.name,
          n.description = row.description
    `,
    parameters: { rows: features },
  },

  {
    name: "teams",
    query: `
      UNWIND $rows AS row
      MERGE (n:Team {id: row.id})
      SET n.name = row.name,
          n.function = row.function
    `,
    parameters: { rows: teams },
  },

  {
    name: "people",
    query: `
      UNWIND $rows AS row
      MERGE (n:Person {id: row.id})
      SET n.name = row.name,
          n.role = row.role
    `,
    parameters: { rows: people },
  },

  {
    name: "bugs",
    query: `
      UNWIND $rows AS row
      MERGE (n:Bug {id: row.id})
      SET n.title = row.title,
          n.severity = row.severity,
          n.status = row.status
    `,
    parameters: { rows: bugs },
  },

  {
    name: "resolutions",
    query: `
      UNWIND $rows AS row
      MERGE (n:Resolution {id: row.id})
      SET n.title = row.title,
          n.status = row.status
    `,
    parameters: { rows: resolutions },
  },

  {
    name: "documents",
    query: `
      UNWIND $rows AS row
      MERGE (n:Document {id: row.id})
      SET n.title = row.title,
          n.type = row.type
    `,
    parameters: { rows: documents },
  },

  {
    name: "tickets",
    query: `
      UNWIND $rows AS row
      MERGE (n:Ticket {id: row.id})
      SET n.title = row.title,
          n.status = row.status,
          n.priority = row.priority,
          n.createdAt = row.createdAt
    `,
    parameters: { rows: tickets },
  },

  {
    name: "ticket-customer relationships",
    query: `
      UNWIND $rows AS row
      MATCH (customer:Customer {id: row.customerId})
      MATCH (ticket:Ticket {id: row.ticketId})
      MERGE (customer)-[:RAISED]->(ticket)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        customerId: ticket.customerId,
      })),
    },
  },

  {
    name: "ticket-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (ticket:Ticket {id: row.ticketId})
      MATCH (product:Product {id: row.productId})
      MERGE (ticket)-[:ABOUT]->(product)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        productId: ticket.productId,
      })),
    },
  },

  {
    name: "ticket-bug relationships",
    query: `
      UNWIND $rows AS row
      MATCH (ticket:Ticket {id: row.ticketId})
      MATCH (bug:Bug {id: row.bugId})
      MERGE (ticket)-[:RELATED_TO]->(bug)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        bugId: ticket.bugId,
      })),
    },
  },

  {
    name: "product-feature relationships",
    query: `
      UNWIND $rows AS row
      MATCH (product:Product {id: row.productId})
      MATCH (feature:Feature {id: row.featureId})
      MERGE (product)-[:HAS_FEATURE]->(feature)
    `,
    parameters: { rows: productFeatures },
  },

  {
    name: "bug-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (product:Product {id: row.productId})
      MERGE (bug)-[:AFFECTS]->(product)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        bugId: ticket.bugId,
        productId: ticket.productId,
      })),
    },
  },

  {
    name: "bug-team relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (team:Team {id: row.teamId})
      MERGE (bug)-[:OWNED_BY]->(team)
    `,
    parameters: { rows: bugTeams },
  },

  {
    name: "team-member relationships",
    query: `
      UNWIND $rows AS row
      MATCH (team:Team {id: row.teamId})
      MATCH (person:Person {id: row.personId})
      MERGE (team)-[:HAS_MEMBER]->(person)
    `,
    parameters: { rows: teamMembers },
  },

  {
    name: "bug-resolution relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (resolution:Resolution {id: row.resolutionId})
      MERGE (bug)-[:RESOLVED_BY]->(resolution)
    `,
    parameters: { rows: bugResolutions },
  },

  {
    name: "resolution-document relationships",
    query: `
      UNWIND $rows AS row
      MATCH (resolution:Resolution {id: row.resolutionId})
      MATCH (document:Document {id: row.documentId})
      MERGE (resolution)-[:DOCUMENTED_IN]->(document)
    `,
    parameters: { rows: resolutionDocuments },
  },
];

const seed = async (): Promise<void> => {
  const driver = getDriver();

  try {
    console.log("Starting ContextGraph seed...");

    for (const step of seedSteps) {
      console.log(`Seeding ${step.name}...`);

      const session = driver.session();

      try {
        await session.run(step.query, step.parameters);
      } finally {
        await session.close();
      }
    }

    console.log("ContextGraph seed completed successfully.");
  } catch (error) {
    console.error("Failed to seed ContextGraph:", error);
    process.exitCode = 1;
  } finally {
    await driver.close();
  }
};

seed();