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
                <DocNav href="#architecture" label="Architecture" />
                <DocNav href="#graph-model" label="Graph model" />
                <DocNav href="#api" label="API reference" />
                <DocNav
                  href="#ai-context"
                  label="AI context"
                />
                <DocNav
                  href="#examples"
                  label="Integration examples"
                />
                <DocNav
                  href="#development"
                  label="Development"
                />
              </nav>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </p>

                <div className="space-y-1">
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
              </div>
            </section>

            {/* Quickstart */}
            <DocSection
              id="quickstart"
              eyebrow="Get started"
              title="Quickstart"
              description="Connect your application to ContextGraph and retrieve graph context."
            >
              <div className="space-y-6">
                <Step
                  number="01"
                  title="Start the API"
                  description="Run the ContextGraph backend locally."
                />

                <CodeBlock
                  id="quickstart-server"
                  code={`cd backend
npm install
npm run dev`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <Step
                  number="02"
                  title="Retrieve the graph"
                  description="The graph endpoint returns nodes and relationships used by the Explore Context interface."
                />

                <CodeBlock
                  id="quickstart-graph"
                  code={`curl http://localhost:5000/api/graph`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <Step
                  number="03"
                  title="Ask a grounded question"
                  description="Send a customer question to the AI context endpoint."
                />

                <CodeBlock
                  id="quickstart-ai"
                  code={`curl -X POST http://localhost:5000/api/ai-context/customers/customer-acme/query \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "Who owns the customer'\''s current issue?"
  }'`}
                  copied={copied}
                  onCopy={copyCode}
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

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Base URL
                    </p>

                    <code className="mt-1 block text-xs text-slate-500">
                      http://localhost:5000/api
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
                  path="/ai-context/customers/:customerId"
                  title="Get customer AI context"
                  description="Builds the complete graph-grounded context for a customer."
                  response={`{
  "success": true,
  "data": {
    "customerId": "customer-acme",
    "customerContext": {
      "customer": {...},
      "tickets": [...],
      "products": [...],
      "bugs": [...],
      "teams": [...],
      "experts": [...],
      "resolutions": [...],
      "documents": [...],
      "features": [...],
      "relationships": [...]
    }
  }
}`}
                  copied={copied}
                  onCopy={copyCode}
                />

                <ApiEndpoint
                  method="POST"
                  path="/ai-context/customers/:customerId/query"
                  title="Ask customer context"
                  description="Answers a question using the customer's connected graph context."
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
                  description="Returns relationship-grounded context for the customer's current issue."
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
  "http://localhost:5000/api/ai-context/customers/customer-acme/query",
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
    "http://localhost:5000/api/ai-context/customers/customer-acme/query",
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
              </div>
            </DocSection>

            {/* Development */}
            <DocSection
              id="development"
              eyebrow="Development"
              title="Development"
              description="Run ContextGraph locally and build the frontend and backend."
            >
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

              <div className="mt-5 grid gap-4 md:grid-cols-3">
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
            </DocSection>

            {/* Footer */}
            <footer className="border-t border-slate-200 py-8">
              <div className="flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  ContextGraph · AI Support Intelligence
                </span>

                <span>
                  Graph-backed context for AI applications
                </span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </Layout>
  );
}

// Components                                                                 */
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
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

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

      <p className="text-sm font-semibold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
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

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

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

        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>
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

function GraphNode({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

function Relationship({
  label,
}: {
  label: string;
}) {
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
  const requestId = `${path}-request`;
  const responseId = `${path}-response`;

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
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function CommandCard({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <code className="text-xs font-medium text-slate-700">
        {command}
      </code>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Documentation;