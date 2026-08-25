import { Network, X, ArrowRight } from "lucide-react";
import type { GraphLink, GraphNode } from "../types/graph";

interface NodeDetailsProps {
  node: GraphNode;
  nodes: GraphNode[];
  links: GraphLink[];
  onClose: () => void;
  onNodeSelect: (node: GraphNode) => void;
}

function NodeDetails({
  node,
  nodes,
  links,
  onClose,
  onNodeSelect,
}: NodeDetailsProps) {
  const connections = links
    .filter(
      (link) =>
        link.source === node.id ||
        link.target === node.id,
    )
    .map((link) => {
      const isOutgoing = link.source === node.id;

      const connectedId = isOutgoing
        ? link.target
        : link.source;

      const connectedNode = nodes.find(
        (item) => item.id === connectedId,
      );

      return {
        ...link,
        connectedNode,
        isOutgoing,
      };
    });

  return (
    <aside className="absolute right-0 top-0 z-20 flex h-full w-[340px] flex-col border-l border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Network size={17} className="text-gray-500" />

          <span className="text-sm font-semibold text-gray-900">
            Node Details
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close node details"
        >
          <X size={17} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Node identity */}
        <div className="mb-6">
          <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            {node.type}
          </span>

          <h2 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
            {node.label}
          </h2>
        </div>

        {/* Properties */}
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Properties
          </h3>

          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {Object.entries(node.properties).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 px-3 py-2.5"
                >
                  <span className="text-xs text-gray-400">
                    {key}
                  </span>

                  <span className="max-w-[180px] break-words text-right text-xs font-medium text-gray-700">
                    {String(value)}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Connections */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Connections
            </h3>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              {connections.length}
            </span>
          </div>

          <div className="space-y-2">
            {connections.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400">
                  No connected entities.
                </p>
              </div>
            )}

            {connections.map((connection) => {
              if (!connection.connectedNode) {
                return null;
              }

              return (
                <button
                  key={connection.id}
                  type="button"
                  onClick={() =>
                    onNodeSelect(connection.connectedNode!)
                  }
                  className="group w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-gray-300 hover:bg-gray-50"
                >
                  {/* Relationship */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      {connection.type}
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500"
                    />
                  </div>

                  {/* Connected entity */}
                  <div className="mt-2">
                    <div className="text-sm font-semibold text-gray-800">
                      {connection.connectedNode.label}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-400">
                      {connection.connectedNode.type}
                    </div>
                  </div>

                  {/* Direction */}
                  <div className="mt-2 text-[9px] text-gray-400">
                    {connection.isOutgoing
                      ? `${node.type} → ${connection.connectedNode.type}`
                      : `${connection.connectedNode.type} → ${node.type}`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

export default NodeDetails;