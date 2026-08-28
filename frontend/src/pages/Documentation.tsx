import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Database,
  GitBranch,
  Network,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";

const PRODUCTION_API =
  "https://contextgraph-backend.onrender.com/api";

const LOCAL_API = "http://localhost:5000/api";

const PRODUCTION_APP =
  "https://contextgraph-eizw.onrender.com";

function Documentation() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyCode(id: string, code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);

      window.setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch {
      // Clipboard may be unavailable in some environments.
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-10">
          {/* Documentation navigation */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Documentation
              </p>

              <nav className="space-y-1">
                <DocNav href="#overview" label="Overview" />
                <DocNav href="#quickstart" label="Quickstart" />
                <DocNav href="#production" label="Production" />
                <DocNav href="#architecture" label="Architecture" />
                <DocNav href="#graph-model" label="Graph model" />
                <DocNav href="#api" label="API reference" />
                <DocNav href="#ai-context" label="AI context" />
                <DocNav href="#examples" label="Integration examples" />
                <DocNav href="#development" label="Development" />
              </nav>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </p>

                <div className="space-y-1">
                  <Link
                    to="/overview"
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Network size={14} />
                    Overview
                  </Link>

                  <Link
                    to="/explore"
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Network size={14} />
                    Explore Context
                  </Link>

                  <Link
                    to="/ask"
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Bot size={14} />
                    Ask Agent
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main documentation */}
          <main className="min-w-0 flex-1">
            {/* Hero */}
            <section
              id="overview"
              className="scroll-mt-24 border-b border-slate-200 pb-10"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                ContextGraph API
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Build with connected context.
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
                ContextGraph provides a graph-backed context layer for AI
                applications. Connect customers, tickets, incidents, bugs,
                teams, experts, resolutions, and other support entities, then
                retrieve the context your AI application needs.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#quickstart"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Quickstart
                  <ArrowRight size={15} />
                </a>

                <a
                  href="#api"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  API reference
                </a>

                <a
                  href={PRODUCTION_APP}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open app
                  <ArrowRight size={15} />
                </a>
              </div>
            </section>

            {/* Quickstart */}
            <DocSection
              id="quickstart"
              eyebrow="Get started"
              title="Quickstart"
              description="Connect your application to ContextGraph and retrieve graph-grounded context."
            >
              <div className="space-y-6">
                <Step
                  number="01"
                  title="Check the production API"
                  description="Verify that the hosted ContextGraph API is available."
                />

                <CodeBlock
                  id="quickstart-health"
                  code={`curl ${PRODUCTION_API}/health`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <Step
                  number="02"
                  title="Retrieve the graph"
                  description="Fetch the connected entities and relationships available to the application."
                />

                <CodeBlock
                  id="quickstart-graph"
                  code={`curl ${PRODUCTION_API}/graph`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <Step
                  number="03"
                  title="Ask a grounded question"
                  description="Send a customer question using the production API."
                />

                <CodeBlock
                  id="quickstart-ai"
                  code={`curl -X POST ${PRODUCTION_API}/ai-context/customers/customer-acme/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Who owns the customer'\\''s current issue?"
  }'`}
                  copied={copied}
                  onCopy={copyCode}
                />
              </div>
            </DocSection>

            {/* Production */}
            <DocSection
              id="production"
              eyebrow="Hosted"
              title="Production"
              description="Use the hosted ContextGraph application and API without running the backend locally."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href={PRODUCTION_APP}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <Network size={18} className="mb-3 text-slate-600" />

                  <p className="text-sm font-semibold text-slate-900">
                    Web Application
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {PRODUCTION_APP}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                    Open application
                    <ArrowRight size={12} />
                  </div>
                </a>

                <a
                  href={PRODUCTION_API}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <Server size={18} className="mb-3 text-slate-600" />

                  <p className="text-sm font-semibold text-slate-900">
                    Production API
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {PRODUCTION_API}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                    Open API
                    <ArrowRight size={12} />
                  </div>
                </a>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Hosted ContextGraph instance
                    </p>

                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      The hosted frontend communicates with the backend over
                      HTTPS, and the backend connects to the CognoDB graph
                      database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoCard
                  title="Production API"
                  value={PRODUCTION_API}
                />

                <InfoCard
                  title="Local API"
                  value={LOCAL_API}
                />
              </div>
            </DocSection>

            {/* Architecture */}
            <DocSection
              id="architecture"
              eyebrow="Concepts"
              title="Architecture"
              description="ContextGraph separates graph storage, retrieval, context construction, and AI generation."
            >
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <div className="grid gap-4 md:grid-cols-5">
                  <ArchitectureCard
                    icon={<Database size={18} />}
                    title="Data"
                    text="Support entities and relationships"
                  />

                  <ArchitectureArrow />

                  <ArchitectureCard
                    icon={<GitBranch size={18} />}
                    title="Graph"
                    text="Connected context in CognoDB"
                  />

                  <ArchitectureArrow />

                  <ArchitectureCard
                    icon={<Bot size={18} />}
                    title="AI"
                    text="Context-grounded responses"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <FeatureCard
                  icon={<Database size={17} />}
                  title="Graph storage"
                  text="Entities and relationships are stored as a connected graph rather than isolated records."
                />

                <FeatureCard
                  icon={<Network size={17} />}
                  title="Context retrieval"
                  text="The backend traverses relevant relationships to build customer-specific AI context."
                />

                <FeatureCard
                  icon={<ShieldCheck size={17} />}
                  title="Evidence"
                  text="Answers can expose the graph relationships used to support the result."
                />
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Request flow
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <GraphNode label="User" />
                  <Relationship label="REQUEST" />
                  <GraphNode label="Express API" />
                  <Relationship label="TRAVERSE" />
                  <GraphNode label="CognoDB" />
                  <Relationship label="CONTEXT" />
                  <GraphNode label="AI Service" />
                  <Relationship label="ANSWER" />
                  <GraphNode label="Evidence" />
                </div>
              </div>
            </DocSection>

            {/* Graph Model */}
            <DocSection
              id="graph-model"
              eyebrow="Graph"
              title="Graph model"
              description="ContextGraph represents support knowledge as entities connected by explicit relationships."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <ModelCard
                  title="Entities"
                  icon={<Database size={18} />}
                  items={[
                    "Customer",
                    "Ticket",
                    "Bug",
                    "Incident",
                    "Product",
                    "Feature",
                    "Component",
                    "Team",
                    "Person",
                    "Resolution",
                    "Document",
                    "Vendor",
                    "Environment",
                  ]}
                />

                <ModelCard
                  title="Relationships"
                  icon={<GitBranch size={18} />}
                  items={[
                    "RAISED",
                    "ABOUT",
                    "RELATED_TO",
                    "AFFECTS",
                    "OWNED_BY",
                    "HAS_MEMBER",
                    "RESOLVED_BY",
                    "DOCUMENTED_IN",
                    "HAS_FEATURE",
                    "USES",
                    "DEPLOYED_IN",
                    "HAS_INCIDENT",
                  ]}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Example relationship path
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <GraphNode label="Customer" />
                  <Relationship label="RAISED" />
                  <GraphNode label="Ticket" />
                  <Relationship label="RELATED_TO" />
                  <GraphNode label="Bug" />
                  <Relationship label="OWNED_BY" />
                  <GraphNode label="Team" />
                  <Relationship label="HAS_MEMBER" />
                  <GraphNode label="Person" />
                </div>
              </div>

              <div className="mt-5">
                <CodeBlock
                  id="graph-query"
                  code={`MATCH (customer:Customer {id: $customerId})
      -[:RAISED]->(ticket:Ticket)
      -[:RELATED_TO]->(bug:Bug)
      -[:OWNED_BY]->(team:Team)
      -[:HAS_MEMBER]->(person:Person)

RETURN customer, ticket, bug, team, person`}
                  copied={copied}
                  onCopy={copyCode}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-3">
                  <Database
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Graph-backed support model
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      The same graph model can be extended with additional
                      customers, tickets, bugs, incidents, teams, experts,
                      products, components, vendors, resolutions, and
                      documentation without changing the fundamental
                      relationship-based approach.
                    </p>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* API */}
            <DocSection
              id="api"
              eyebrow="Reference"
              title="API reference"
              description="HTTP endpoints exposed by the ContextGraph backend."
            >
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 text-slate-700 shadow-sm">
                    <Server size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Production API
                    </p>

                    <code className="mt-1 block break-all text-xs text-slate-500">
                      {PRODUCTION_API}
                    </code>

                    <p className="mt-3 text-xs text-slate-400">
                      Local development
                    </p>

                    <code className="mt-1 block break-all text-xs text-slate-500">
                      {LOCAL_API}
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <ApiEndpoint
                  method="GET"
                  path="/health"
                  title="Health check"
                  description="Check whether the ContextGraph API is running."
                  response={`{
  "success": true,
  "message": "ContextGraph API is running",
  "environment": "production",
  "timestamp": "..."
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="GET"
                  path="/graph"
                  title="Get graph"
                  description="Returns graph nodes and relationships used by Explore Context."
                  response={`{
  "success": true,
  "data": {
    "nodes": [...],
    "links": [...]
  }
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="GET"
                  path="/context/customers/:customerId"
                  title="Get customer context"
                  description="Retrieve support context associated with a customer."
                  response={`{
  "success": true,
  "data": {
    "customer": {...},
    "tickets": [...],
    "products": [...],
    "bugs": [...]
  }
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="GET"
                  path="/ai-context/customers/:customerId"
                  title="Get customer AI context"
                  description="Build the graph-grounded context used by the AI layer."
                  response={`{
  "success": true,
  "data": {
    "customer": {...},
    "tickets": [...],
    "products": [...],
    "bugs": [...],
    "teams": [...],
    "experts": [...],
    "resolutions": [...],
    "documents": [...],
    "features": [...]
  }
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="POST"
                  path="/ai-context/customers/:customerId/query"
                  title="Ask Agent"
                  description="Ask a question using the customer's connected graph context."
                  request={`{
  "question": "Who owns the customer's current issue?"
}`}
                  response={`{
  "success": true,
  "data": {
    "customerId": "customer-acme",
    "question": "...",
    "answer": "...",
    "model": "graph-grounded",
    "evidence": [...]
  }
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="GET"
                  path="/ai-context/customers/:customerId/issue-context"
                  title="Get issue context"
                  description="Retrieve relationship-grounded context for a customer's issue."
                  response={`{
  "success": true,
  "data": [...]
}`}
                  copied={copied}
                  onCopy={copyCode}
                />
              </div>
            </DocSection>

            {/* AI Context */}
            <DocSection
              id="ai-context"
              eyebrow="AI"
              title="AI context"
              description="ContextGraph keeps the graph visible underneath AI responses."
            >
              <div className="space-y-4">
                <ContextStep
                  number="01"
                  title="Retrieve"
                  text="Find the customer's connected support entities and relationships."
                />

                <ContextStep
                  number="02"
                  title="Normalize"
                  text="Convert graph results into a structured customer AI context."
                />

                <ContextStep
                  number="03"
                  title="Ground"
                  text="Use verified relationships when constructing deterministic answers or providing context to the AI provider."
                />

                <ContextStep
                  number="04"
                  title="Explain"
                  text="Return evidence relationships alongside the answer so users can inspect why the answer was produced."
                />
              </div>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />

                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Grounding behavior
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      ContextGraph should not invent graph relationships that
                      are not present in the retrieved context. When the graph
                      does not contain enough information, the system can
                      explicitly state that the available knowledge graph is
                      insufficient.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Context pipeline
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <GraphNode label="Question" />
                  <Relationship label="RETRIEVE" />
                  <GraphNode label="Graph Context" />
                  <Relationship label="BUILD" />
                  <GraphNode label="AI Context" />
                  <Relationship label="GENERATE" />
                  <GraphNode label="Answer" />
                  <Relationship label="EXPLAIN" />
                  <GraphNode label="Evidence" />
                </div>
              </div>
            </DocSection>

            {/* Examples */}
            <DocSection
              id="examples"
              eyebrow="Integration"
              title="Integration examples"
              description="Use ContextGraph as a context layer inside your own application."
            >
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Code2 size={16} className="text-slate-500" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      JavaScript
                    </h3>
                  </div>

                  <CodeBlock
                    id="example-js"
                    code={`const response = await fetch(
  "${PRODUCTION_API}/ai-context/customers/customer-acme/query",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: "Who owns the customer's current issue?"
    })
  }
);

const result = await response.json();

console.log(result.data.answer);
console.log(result.data.evidence);`}
                    copied={copied}
                    onCopy={copyCode}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Terminal size={16} className="text-slate-500" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      Python
                    </h3>
                  </div>

                  <CodeBlock
                    id="example-python"
                    code={`import requests

response = requests.post(
    "${PRODUCTION_API}/ai-context/customers/customer-acme/query",
    json={
        "question": "What is the verified resolution?"
    }
)

data = response.json()

print(data["data"]["answer"])
print(data["data"]["evidence"])`}
                    copied={copied}
                    onCopy={copyCode}
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Terminal size={16} className="text-slate-500" />

                    <h3 className="text-sm font-semibold text-slate-900">
                      cURL
                    </h3>
                  </div>

                  <CodeBlock
                    id="example-curl"
                    code={`curl -X POST ${PRODUCTION_API}/ai-context/customers/customer-acme/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is the verified resolution?"
  }'`}
                    copied={copied}
                    onCopy={copyCode}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Included seed customers
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  The current demo seed data contains interconnected support
                  scenarios for the following customers.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <code className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                    customer-acme
                  </code>

                  <code className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                    customer-nova
                  </code>

                  <code className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
                    customer-orbit
                  </code>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Seed dataset
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  The included seed script provides a larger interconnected
                  support graph for demonstrating graph traversal and
                  graph-grounded AI responses.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <DataStat value="3" label="Customers" />
                  <DataStat value="52" label="Tickets" />
                  <DataStat value="25" label="Bugs" />
                  <DataStat value="8" label="Products" />
                  <DataStat value="7" label="Teams" />
                  <DataStat value="25" label="Resolutions" />
                  <DataStat value="25" label="Documents" />
                  <DataStat value="300+" label="Relationships" />
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-400">
                  The exact connected-entity counts returned for a customer
                  can vary depending on the customer's reachable graph
                  context.
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-3">
                  <Database
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Use your own data
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      The included seed dataset is provided for demonstration.
                      You can replace or extend the seed data with your own
                      customers, tickets, bugs, incidents, products, teams,
                      components, vendors, resolutions, documents, and other
                      support entities in CognoDB while keeping the same
                      relationship-based graph model.
                    </p>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Development */}
            <DocSection
              id="development"
              eyebrow="Development"
              title="Development"
              description="Run ContextGraph locally and build the frontend and backend."
            >
              <div className="space-y-6">
                <CodeBlock
                  id="development"
                  code={`# Backend
cd backend
npm install
npm run typecheck
npm run build
npm run dev

# Frontend
cd ../frontend
npm install
npm run build
npm run dev`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Backend environment
                  </p>

                  <CodeBlock
                    id="backend-env"
                    code={`PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173

COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password

AI_PROVIDER=openrouter
AI_MODELS=model-one,model-two,model-three
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`}
                    copied={copied}
                    onCopy={copyCode}
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Frontend environment
                  </p>

                  <CodeBlock
                    id="frontend-env"
                    code={`# Local
VITE_API_URL=http://localhost:5000/api

# Production
VITE_API_URL=https://contextgraph-backend.onrender.com/api`}
                    copied={copied}
                    onCopy={copyCode}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <CommandCard
                    command="npm run typecheck"
                    description="Validate TypeScript without emitting files."
                  />

                  <CommandCard
                    command="npm run build"
                    description="Create a production build."
                  />

                  <CommandCard
                    command="npm run dev"
                    description="Start the local development server."
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-slate-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Keep secrets outside source control
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Store CognoDB credentials and OpenRouter API keys in
                        environment variables. Never commit the actual{" "}
                        <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">
                          .env
                        </code>
                        file.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DocSection>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8">
              <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>ContextGraph · AI Support Intelligence</span>

                <span>Graph-backed context for AI applications</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </Layout>
  );
}

/* Documentation navigation */

function DocNav({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-md px-2 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
    >
      {label}
    </a>
  );
}

/* Section */

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-slate-200 py-12"
    >
      <div className="mb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {eyebrow}
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* Quickstart */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* Code */

function CodeBlock({
  id,
  code,
  copied,
  onCopy,
}: {
  id: string;
  code: string;
  copied: string | null;
  onCopy: (id: string, code: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0b1120]">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-600" />
        </div>

        <button
          type="button"
          onClick={() => onCopy(id, code)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          {copied === id ? (
            <>
              <Check size={13} />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-5 text-xs leading-6 text-slate-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* Production info */

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <code className="mt-2 block break-all text-xs text-slate-600">
        {value}
      </code>
    </div>
  );
}

/* Dataset */

function DataStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-lg font-semibold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

/* Architecture */

function ArchitectureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 w-fit rounded-lg bg-slate-100 p-2 text-slate-700">
        {icon}
      </div>

      <p className="text-sm font-semibold text-slate-900">{title}</p>

      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function ArchitectureArrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <ChevronRight size={17} className="text-slate-300" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 w-fit rounded-lg bg-slate-100 p-2 text-slate-700">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

/* Graph model */

function ModelCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function GraphNode({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

function Relationship({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <ChevronRight size={13} className="text-slate-300" />

      <span className="text-[9px] font-semibold tracking-wide text-slate-400">
        {label}
      </span>

      <ChevronRight size={13} className="text-slate-300" />
    </div>
  );
}

/* API */

function ApiEndpoint({
  method,
  path,
  title,
  description,
  request,
  response,
  copied,
  onCopy,
}: {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  request?: string;
  response: string;
  copied: string | null;
  onCopy: (id: string, code: string) => void;
}) {
  const safeId = path.replace(/[^a-zA-Z0-9]+/g, "-");
  const requestId = `${safeId}-request`;
  const responseId = `${safeId}-response`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-bold ${
              method === "POST"
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {method}
          </span>

          <code className="text-xs font-medium text-slate-700">
            {path}
          </code>
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {request && (
        <div className="border-b border-slate-200 p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Request body
          </p>

          <CodeBlock
            id={requestId}
            code={request}
            copied={copied}
            onCopy={onCopy}
          />
        </div>
      )}

      <div className="p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Response
        </p>

        <CodeBlock
          id={responseId}
          code={response}
          copied={copied}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}

/* AI context */

function ContextStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* Development */

function CommandCard({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <code className="text-xs font-medium text-slate-700">{command}</code>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Documentation;