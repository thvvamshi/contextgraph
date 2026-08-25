# ContextGraph

ContextGraph is a graph-powered support intelligence application that connects customers, tickets, bugs, products, teams, experts, incidents, components, vendors, resolutions, and documentation into one connected context graph.

The goal is simple: when someone asks a support question, the system should be able to follow the relationships between the relevant entities instead of treating every record as an isolated row.

## Overview

A typical support investigation can involve several connected pieces of information:

```text
Customer
   │
   │ RAISED
   ▼
Ticket
   │
   │ RELATED_TO
   ▼
Bug
   ├──────── OWNED_BY ────────> Team
   │                              │
   │                              │ HAS_MEMBER
   │                              ▼
   │                            Expert
   │
   └──────── RESOLVED_BY ─────> Resolution
                                  │
                                  │ DOCUMENTED_IN
                                  ▼
                               Document
```

ContextGraph uses these relationships to answer questions such as:

- Who owns the customer's current issue?
- What is the verified resolution?
- Who are the experts working on this issue?
- Which product is affected?
- Which incidents or components are connected?
- What documentation supports a resolution?

---

## Production

ContextGraph is available as a hosted application:

**Web App:** https://contextgraph-eizw.onrender.com

**API:** https://contextgraph-backend.onrender.com/api

The frontend communicates with the ContextGraph API over HTTPS.

## Why a Graph Database?

The important information in support intelligence is often the **connection between entities**, not just the individual records.

For example, answering:

> Who can help with this customer's current issue?

may require traversing:

```text
Customer
 → Ticket
 → Bug
 → Team
 → Person
```

A relational implementation could represent each entity in a separate table, but the application would then need multiple joins and increasingly complex relationship logic as more entity types are introduced.

With a graph database, the relationship itself is a first-class part of the model:

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:RAISED]->(ticket:Ticket)
      -[:RELATED_TO]->(bug:Bug)
      -[:OWNED_BY]->(team:Team)
      -[:HAS_MEMBER]->(person:Person)

RETURN customer, ticket, bug, team, person
```

This makes multi-hop context retrieval natural and keeps the data model flexible as new relationships are added.

---

## Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │ TypeScript + Vite    │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │    Express API       │
                         │      TypeScript      │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │ Graph Repository │             │ AI Context       │
          │                  │             │ Service          │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   └──────────────┬─────────────────┘
                                  ▼
                         ┌──────────────────────┐
                         │       CognoDB        │
                         │      Graph Store     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Graph-grounded AI    │
                         │      OpenRouter      │
                         └──────────────────────┘
```

---

## Graph Model

The graph contains the following main node types:

```text
Customer
Ticket
Bug
Incident
Product
Feature
Component
Team
Person
Resolution
Document
Vendor
Environment
```

Important relationships include:

```text
Customer ──RAISED────────────> Ticket
Ticket ──ABOUT───────────────> Product
Ticket ──RELATED_TO──────────> Bug
Bug ──OWNED_BY───────────────> Team
Team ──HAS_MEMBER────────────> Person
Bug ──RESOLVED_BY────────────> Resolution
Resolution ──DOCUMENTED_IN───> Document

Product ──HAS_FEATURE────────> Feature
Product ──DEPLOYED_IN────────> Environment
Incident ──AFFECTS───────────> Component
Component ──USES─────────────> Vendor
```

### Example support graph

```text
                       Customer
                           │
                         RAISED
                           │
                           ▼
                         Ticket
                       /        \
                   ABOUT       RELATED_TO
                     /             \
                    ▼               ▼
                 Product           Bug
                                   │
                    ┌──────────────┼───────────────┐
                    │              │               │
                OWNED_BY       RESOLVED_BY      ...
                    │              │
                    ▼              ▼
                  Team         Resolution
                    │              │
               HAS_MEMBER    DOCUMENTED_IN
                    │              │
                    ▼              ▼
                  Person       Document
```

---

## Data

The project includes realistic seed data covering interconnected support scenarios.

The seed graph includes examples involving:

- Acme Corporation
- Nova Retail
- Payment API
- Checkout Platform
- Payment API bugs
- Checkout issues
- Payment and checkout incidents
- Payments Platform
- Checkout Engineering
- Support and engineering experts
- Verified resolutions
- Incident runbooks
- Payment Gateway
- Checkout Service
- Stripe
- Adyen
- Production environment
- Product features

The seed script is included in the backend repository and can be used to populate the CognoDB instance.

---

## Graph Queries

Graph queries are kept separately under:

```text
backend/src/graph/queries/
```

The application uses parameterized Cypher queries through the official Neo4j JavaScript driver.

### Multi-hop traversal

One of the main traversals follows:

```text
Customer
 → Ticket
 → Bug
 → Team
 → Person
```

Query:

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:RAISED]->(ticket:Ticket)
      -[:RELATED_TO]->(bug:Bug)
      -[:OWNED_BY]->(team:Team)
      -[:HAS_MEMBER]->(person:Person)

RETURN customer, ticket, bug, team, person
```

This allows the application to discover the people connected to the team responsible for a customer's issue.

### Dynamic context traversal

ContextGraph also retrieves connected context dynamically:

```cypher
MATCH (customer:Customer {id: $customerId})
MATCH path = (customer)-[*1..4]-(related)

UNWIND relationships(path) AS rel

WITH DISTINCT rel

RETURN
  startNode(rel) AS source,
  rel,
  endNode(rel) AS target
```

This query traverses up to four hops from a customer and extracts the relationships encountered.

It avoids having to explicitly define a separate join for every possible combination of support entities.

### Resolution traversal

A resolution can be reached through:

```text
Customer
 → Ticket
 → Bug
 → Resolution
 → Document
```

Query:

```cypher
MATCH (customer:Customer {id: $customerId})
      -[:RAISED]->(ticket:Ticket)
      -[:RELATED_TO]->(bug:Bug)
      -[:RESOLVED_BY]->(resolution:Resolution)
      -[:DOCUMENTED_IN]->(document:Document)

RETURN
  customer,
  ticket,
  bug,
  resolution,
  document
```

### Parameterized queries

Application queries use parameters such as:

```text
$customerId
$ticketId
$limit
```

Example:

```cypher
MATCH (customer:Customer {id: $customerId})
RETURN customer
```

Values are never concatenated directly into Cypher queries.

---

## ContextGraph Agent

The AI layer uses graph context rather than sending arbitrary database contents to the model.

The flow is:

```text
User Question
      │
      ▼
Customer-specific graph traversal
      │
      ▼
Relevant entities and relationships
      │
      ▼
Context Builder
      │
      ▼
Graph-grounded reasoning
      │
      ▼
Answer + Evidence
```

For supported questions, ContextGraph can construct deterministic answers directly from verified graph relationships.

For other questions, the retrieved graph context is passed to the configured AI provider.

---

## Evidence

Answers can expose the exact relationships used to reach the conclusion.

For example:

```text
customer-acme --RAISED--> ticket-1042
ticket-1042 --ABOUT--> product-payment-api
ticket-1042 --RELATED_TO--> bug-221
bug-221 --OWNED_BY--> team-payments
```

The response can therefore show not only the answer, but also the graph evidence behind it.

Example:

```text
Conclusion:
The current payment API issue is owned by Payments Platform.

Evidence:
customer-acme --RAISED--> ticket-1042
ticket-1042 --ABOUT--> product-payment-api
ticket-1042 --RELATED_TO--> bug-221
bug-221 --OWNED_BY--> team-payments
```

---

## Hallucination Protection

The system verifies important relationships before producing deterministic graph-grounded answers.

If the graph does not contain enough information to support a claim, ContextGraph does not invent a relationship.

For example, if asked whether a database migration fixed a payment issue and there is no migration-related information in the graph, the system responds that the available graph context is insufficient to determine that.

This keeps answers grounded in the available support context.

---

## Frontend

The frontend provides three primary areas.

### Overview

Provides a high-level view of the ContextGraph system and its connected support data.

### Explore Context

Interactive graph exploration built with React Flow and D3 Force.

Features include:

- Force-directed graph
- Structured graph view
- Entity search
- Node selection
- Node details
- Relationship inspection
- Connected-node highlighting
- Mini-map
- Zoom and pan controls

The Force view is the default graph view.

### Ask Agent

Allows users to select a customer and ask questions about their connected support context.

The response displays:

- Answer
- Model
- Retrieved context
- Entity counts
- Graph evidence
- Supporting relationships

---

## UI

The interface is intentionally focused on making connected context easy to inspect.

```text
Overview
Explore Context
Ask Agent
```

The Explore Context page provides:

```text
Graph Search
      +
Force / Structured
      +
Interactive Graph
      +
Node Details
```

The Ask Agent page provides:

```text
Customer Selection
      +
Question
      +
Graph-grounded Answer
      +
Retrieved Context
      +
Graph Evidence
```

---

## API

### Health

```http
GET /api/health
```

### Graph

```http
GET /api/graph
```

### Customer Context

```http
GET /api/context/customers/:customerId
```

### Customer AI Context

```http
GET /api/ai-context/customers/:customerId
```

### Ask Agent

```http
POST /api/ai-context/customers/:customerId/query
```

Example request:

```json
{
  "question": "Who owns the customer's current issue?"
}
```

### Customer Issue Context

```http
GET /api/ai-context/customers/:customerId/issue-context
```

---

## Project Structure

```text
contextgraph/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── context/
│   │   │   ├── prompts/
│   │   │   └── providers/
│   │   │
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── graph/
│   │   │   └── queries/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── seed.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- D3 Force
- Axios
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Zod
- Neo4j JavaScript Driver
- CognoDB
- openCypher
- OpenRouter

### Database

CognoDB is used as the graph database layer and is accessed using the official Neo4j JavaScript driver over Bolt.

---

## Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password

OPENROUTER_API_KEY=your_openrouter_api_key
```

Secrets are stored in environment variables and excluded from source control.

Never commit the actual `.env` file.

---

## CognoDB Setup

1. Create a CognoDB Cloud account.
2. Create a free database instance.
3. Copy the generated Bolt connection URI.
4. Save the generated `cognodb` password securely.
5. Add the connection details to `backend/.env`.
6. Run the seed script to populate the graph.
7. Start the backend and verify the health endpoint.

The application connects through the standard Neo4j JavaScript driver using the CognoDB Bolt endpoint.

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm run typecheck
npm run build
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Validation

Backend:

```bash
cd backend
npm run typecheck
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

The current project builds successfully on both the backend and frontend.

---

## Screenshots

### Explore Context

Add the current graph visualization screenshot here:

```text
docs/screenshots/explore-context.png
```

### Ask Agent

Add the Ask Agent screenshot here:

```text
docs/screenshots/ask-agent.png
```

### Node Details

Add the node details screenshot here:

```text
docs/screenshots/node-details.png
```

---

## Demo

Live application:

```text
TODO: Add deployed application URL
```

Screen recording:

```text
TODO: Add screen recording URL
```

---

## Example Questions

```text
Who owns the customer's current issue?

What is the verified resolution?

Who are the experts working on this issue?
```

Example graph-grounded answer:

```text
Situation:
Acme Corporation raised a payment-related support ticket.

Evidence:
customer-acme --RAISED--> ticket-1042
ticket-1042 --ABOUT--> product-payment-api
ticket-1042 --RELATED_TO--> bug-221
bug-221 --OWNED_BY--> team-payments

Conclusion:
The current issue is owned by Payments Platform.
```

---

## Design Principles

### Relationships are first-class data

The application is designed around connections between support entities rather than isolated records.

### Context before generation

The system retrieves relevant graph context before asking an AI provider to answer a question.

### Evidence-backed answers

Important answers can expose the exact relationships used to derive them.

### Parameterized queries

Graph queries use parameters instead of string-concatenated user input.

### Graceful uncertainty

When the graph does not contain enough information, the system avoids inventing an unsupported relationship.

### Clear separation of concerns

Graph access, business logic, AI context construction, AI providers, HTTP controllers, and frontend visualization are separated into dedicated layers.

---

## License

This project is a ContextGraph prototype focused on graph-based support intelligence and grounded AI context.