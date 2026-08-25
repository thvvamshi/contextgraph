import {
  ArrowRight,
  Brain,
  Network,
  Ticket,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { getGraph } from "../services/api";
import type { GraphNode } from "../types/graph";

function Overview() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGraphStats() {
      try {
        const response = await getGraph();

        if (!mounted) {
          return;
        }

        setNodes(response.data.nodes);
      } catch (error) {
        console.error(
          "Failed to load graph statistics:",
          error,
        );

        if (mounted) {
          setNodes([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGraphStats();

    return () => {
      mounted = false;
    };
  }, []);

  const customerCount = nodes.filter(
    (node) => node.type === "Customer",
  ).length;

  const ticketCount = nodes.filter(
    (node) => node.type === "Ticket",
  ).length;

  const graphEntityCount = nodes.length;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl">
        <section className="mb-10">
          <p className="mb-3 text-sm font-medium text-slate-500">
            Context-aware AI
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
            Turn connected support data into reliable AI
            context.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Explore relationships between customers, tickets,
            bugs, teams, experts, and resolutions — then ask an
            AI agent questions grounded in that context.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Explore Context
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/ask"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Ask Agent
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <StatCard
            icon={<Users size={18} />}
            label="Customers"
            value={
              loading
                ? "—"
                : String(customerCount)
            }
          />

          <StatCard
            icon={<Ticket size={18} />}
            label="Support Tickets"
            value={
              loading
                ? "—"
                : String(ticketCount)
            }
          />

          <StatCard
            icon={<Network size={18} />}
            label="Graph Entities"
            value={
              loading
                ? "—"
                : String(graphEntityCount)
            }
          />
        </section>

        <section className="mt-8 grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Network size={18} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Connected context
                </h2>

                <p className="text-sm text-slate-500">
                  Understand the relationships behind an issue.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Node label="Customer" />

              <ArrowRight
                size={14}
                className="text-slate-400"
              />

              <Node label="Ticket" />

              <ArrowRight
                size={14}
                className="text-slate-400"
              />

              <Node label="Bug" />

              <ArrowRight
                size={14}
                className="text-slate-400"
              />

              <Node label="Team" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Brain size={18} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Grounded AI
                </h2>

                <p className="text-sm text-slate-500">
                  Answers backed by retrieved graph evidence.
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Ask questions about customers and incidents while
              keeping the underlying context visible.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-slate-100 p-2">
          {icon}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Node({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium">
      {label}
    </span>
  );
}

export default Overview;