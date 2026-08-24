import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import GraphView from "../components/GraphView";
import { getGraph } from "../services/api";
import type { GraphLink, GraphNode } from "../types/graph";

function ExploreContext() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        setError("");

        const response = await getGraph();

        console.log("Graph loaded:", response);

        if (!response.success) {
          throw new Error("Graph API returned unsuccessful response");
        }

        setNodes(response.data.nodes);
        setLinks(response.data.links);
      } catch (error) {
        console.error("Graph loading failed:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load context graph.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, []);

  return (
    <Layout>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Explore Context
            </h1>

            <p className="mt-2 text-gray-500">
              Explore customer, ticket, bug, team, expert, and resolution
              relationships.
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
              {nodes.length} entities · {links.length} relationships
            </div>
          )}
        </div>

        <div className="mt-8 h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">
                Loading context graph...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-red-600">
                  Unable to load context graph.
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && nodes.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">
                No graph data available.
              </p>
            </div>
          )}

          {!loading && !error && nodes.length > 0 && (
            <GraphView nodes={nodes} links={links} />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ExploreContext;