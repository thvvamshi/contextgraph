import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";

import type { GraphLink, GraphNode } from "../types/graph";

interface GraphViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

type GraphViewMode = "structured" | "force";

interface ForceNode extends SimulationNodeDatum {
  id: string;
  label: string;
  type: string;
}

const nodeColors: Record<string, string> = {
  Customer: "#60a5fa",
  Ticket: "#f59e0b",
  Bug: "#f87171",
  Incident: "#fb923c",
  Product: "#a78bfa",
  Feature: "#c084fc",
  Component: "#38bdf8",
  Team: "#4ade80",
  Person: "#f472b6",
  Resolution: "#34d399",
  Document: "#94a3b8",
  Vendor: "#facc15",
  Environment: "#a3e635",
};

function GraphView({ nodes, links }: GraphViewProps) {
  // Default = current structured view
  const [viewMode, setViewMode] =
    useState<GraphViewMode>("force");

  const [forcePositions, setForcePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  /*
   * Force-directed positions are calculated only when
   * the force view is selected.
   */
  useEffect(() => {
    if (viewMode !== "force") {
      return;
    }

    const simulationNodes: ForceNode[] = nodes.map((node) => ({
      id: node.id,
      label: node.label,
      type: node.type,
    }));

    const simulationLinks = links.map((link) => ({
      source: link.source,
      target: link.target,
    }));

    const simulation = forceSimulation(simulationNodes)
      .force(
        "link",
        forceLink<ForceNode, { source: string; target: string }>(
          simulationLinks,
        )
          .id((node) => node.id)
          .distance(140)
          .strength(0.5),
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(550, 350))
      .force("x", forceX(550).strength(0.03))
      .force("y", forceY(350).strength(0.03))
      .stop();

    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    const calculatedPositions: Record<
      string,
      { x: number; y: number }
    > = {};

    simulationNodes.forEach((node) => {
      calculatedPositions[node.id] = {
        x: node.x ?? 0,
        y: node.y ?? 0,
      };
    });

    setForcePositions(calculatedPositions);

    simulation.stop();
  }, [viewMode, nodes, links]);

  const structuredNodes: Node[] = useMemo(
    () =>
      nodes.map((node, index) => ({
        id: node.id,

        position: {
          x: (index % 5) * 220,
          y: Math.floor(index / 5) * 150,
        },

        data: {
          label: (
            <div>
              <div className="truncate text-xs font-medium text-gray-800">
                {node.label}
              </div>

              <div
                className="mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-medium uppercase text-gray-500"
                style={{
                  backgroundColor:
                    nodeColors[node.type] ?? "#f3f4f6",
                }}
              >
                {node.type}
              </div>
            </div>
          ),
        },

        style: {
          width: 180,
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "10px",
          background: "#ffffff",
          color: "#111827",
          fontSize: "12px",
        },
      })),
    [nodes],
  );

  const forceNodes: Node[] = useMemo(() => {
    if (Object.keys(forcePositions).length !== nodes.length) {
      return [];
    }

    return nodes.map((node) => {
      const position = forcePositions[node.id];
      const color = nodeColors[node.type] ?? "#94a3b8";

      return {
        id: node.id,

        position: {
          x: position.x,
          y: position.y,
        },

        data: {
          label: (
            <div className="flex flex-col items-center">
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 12px ${color}`,
                }}
              />

              <div
                className="mt-2 max-w-[130px] truncate text-center text-[10px]"
                style={{
                  color: "#cbd5e1",
                }}
                title={node.label}
              >
                {node.label}
              </div>
            </div>
          ),
        },

        style: {
          width: 150,
          padding: 0,
          border: "none",
          background: "transparent",
          boxShadow: "none",
        },
      };
    });
  }, [nodes, forcePositions]);

  const edges: Edge[] = useMemo(
    () =>
      links.map((link) => ({
        id: link.id,
        source: link.source,
        target: link.target,

        type: viewMode === "force" ? "straight" : "smoothstep",

        label: link.type,

        style: {
          stroke: viewMode === "force" ? "#334155" : "#9ca3af",
          strokeWidth: 1.5,
          opacity: viewMode === "force" ? 0.7 : 1,
        },

        labelStyle: {
          fill: viewMode === "force" ? "#64748b" : "#6b7280",
          fontSize: 9,
          fontWeight: 500,
        },

        labelBgStyle: {
          fill: viewMode === "force" ? "#080d18" : "#ffffff",
          fillOpacity: 0.9,
        },

        labelBgPadding: [4, 2],
        labelBgBorderRadius: 4,
      })),
    [links, viewMode],
  );

  const activeNodes =
    viewMode === "structured" ? structuredNodes : forceNodes;

  const isForceReady =
    viewMode === "force" &&
    Object.keys(forcePositions).length === nodes.length;

  return (
    <div
      className={
        viewMode === "force"
          ? "relative h-full w-full bg-[#080d18]"
          : "relative h-full w-full bg-white"
      }
    >
      {/* View switcher */}
      <div className="absolute left-4 top-4 z-10 flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
  <button
    type="button"
    onClick={() => setViewMode("force")}
    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
      viewMode === "force"
        ? "bg-gray-900 text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    Force
  </button>

  <button
    type="button"
    onClick={() => setViewMode("structured")}
    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
      viewMode === "structured"
        ? "bg-gray-900 text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    Structured
  </button>
</div>

      {/* Force calculation loading */}
      {viewMode === "force" && !isForceReady ? (
        <div className="flex h-full items-center justify-center bg-[#080d18]">
          <p className="text-sm text-slate-500">
            Building context graph...
          </p>
        </div>
      ) : (
        <ReactFlow
          nodes={activeNodes}
          edges={edges}
          fitView
          fitViewOptions={{
            padding: 0.25,
          }}
          minZoom={0.2}
          maxZoom={2.5}
          nodesConnectable={false}
          elementsSelectable
        >
          <Background
            color={
              viewMode === "force" ? "#111827" : "#e5e7eb"
            }
            gap={32}
            size={1}
          />

          <Controls />

          <MiniMap
            nodeColor={(node) => {
              const graphNode = nodes.find(
                (item) => item.id === node.id,
              );

              return graphNode
                ? nodeColors[graphNode.type] ?? "#94a3b8"
                : "#475569";
            }}
          />
        </ReactFlow>
      )}
    </div>
  );
}

export default GraphView;