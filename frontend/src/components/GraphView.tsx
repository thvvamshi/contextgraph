import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
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

import GraphSearch from "./GraphSearch";
import type { GraphLink, GraphNode } from "../types/graph";

interface GraphViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeSelect: (node: GraphNode | null) => void;
}

type GraphViewMode = "force" | "structured";

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

function GraphView({
  nodes,
  links,
  onNodeSelect,
}: GraphViewProps) {
  const [viewMode, setViewMode] =
    useState<GraphViewMode>("force");

  const [selectedNodeId, setSelectedNodeId] =
    useState<string | null>(null);

  const [forcePositions, setForcePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  /*
   * Build force-directed positions.
   */
  useEffect(() => {
    if (viewMode !== "force") {
      return;
    }

    const simulationNodes: ForceNode[] = nodes.map(
      (node) => ({
        id: node.id,
        label: node.label,
        type: node.type,
      }),
    );

    const simulationLinks = links.map((link) => ({
      source: link.source,
      target: link.target,
    }));

    const simulation = forceSimulation(simulationNodes)
      .force(
        "link",
        forceLink<
          ForceNode,
          { source: string; target: string }
        >(simulationLinks)
          .id((node) => node.id)
          .distance(140)
          .strength(0.5),
      )
      .force(
        "charge",
        forceManyBody().strength(-300),
      )
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

  /*
   * Select node from graph.
   */
  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const graphNode = nodes.find(
      (item) => item.id === node.id,
    );

    if (!graphNode) {
      return;
    }

    setSelectedNodeId(graphNode.id);
    onNodeSelect(graphNode);
  };

  /*
   * Clear selection.
   */
  const handlePaneClick = () => {
    setSelectedNodeId(null);
    onNodeSelect(null);
  };

  /*
   * Select node from search.
   */
  const handleSearchSelect = (node: GraphNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect(node);
  };

  /*
   * Check whether a node is selected or directly
   * connected to the selected node.
   */
  const isNodeConnected = (nodeId: string) => {
    if (!selectedNodeId) {
      return true;
    }

    if (nodeId === selectedNodeId) {
      return true;
    }

    return links.some(
      (link) =>
        (link.source === selectedNodeId &&
          link.target === nodeId) ||
        (link.target === selectedNodeId &&
          link.source === nodeId),
    );
  };

  /*
   * Structured nodes.
   */
  const structuredNodes: Node[] = useMemo(
    () =>
      nodes.map((node, index) => {
        const selected =
          node.id === selectedNodeId;

        const connected =
          isNodeConnected(node.id);

        return {
          id: node.id,

          position: {
            x: (index % 5) * 220,
            y: Math.floor(index / 5) * 150,
          },

          data: {
            label: (
              <div>
                <div
                  className="truncate text-xs font-medium"
                  style={{
                    color: connected
                      ? "#1f2937"
                      : "#9ca3af",
                  }}
                >
                  {node.label}
                </div>

                <div
                  className="mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-medium uppercase"
                  style={{
                    backgroundColor:
                      nodeColors[node.type] ??
                      "#f3f4f6",
                    color: connected
                      ? "#6b7280"
                      : "#cbd5e1",
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
            border: selected
              ? "2px solid #111827"
              : "1px solid #d1d5db",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#111827",
            fontSize: "12px",
            opacity: connected ? 1 : 0.25,
            boxShadow: selected
              ? "0 0 0 3px rgba(17,24,39,0.15)"
              : connected
                ? "0 1px 2px rgba(0,0,0,0.05)"
                : "none",
            transition:
              "opacity 200ms ease, box-shadow 200ms ease",
          },
        };
      }),
    [nodes, links, selectedNodeId],
  );

  /*
   * Force nodes.
   */
  const forceNodes: Node[] = useMemo(() => {
    if (
      Object.keys(forcePositions).length !==
      nodes.length
    ) {
      return [];
    }

    return nodes.map((node) => {
      const position = forcePositions[node.id];

      const color =
        nodeColors[node.type] ?? "#94a3b8";

      const selected =
        node.id === selectedNodeId;

      const connected =
        isNodeConnected(node.id);

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
                className="h-4 w-4 rounded-full transition-all duration-200"
                style={{
                  background: color,
                  opacity: connected ? 1 : 0.2,
                  boxShadow: selected
                    ? `0 0 0 4px rgba(255,255,255,0.3), 0 0 24px ${color}`
                    : connected
                      ? `0 0 12px ${color}`
                      : "none",
                  transform: selected
                    ? "scale(1.45)"
                    : "scale(1)",
                }}
              />

              <div
                className="mt-2 max-w-[130px] truncate text-center text-[10px] transition-all duration-200"
                style={{
                  color: selected
                    ? "#ffffff"
                    : connected
                      ? "#cbd5e1"
                      : "#475569",
                  opacity: connected ? 1 : 0.25,
                  fontWeight: selected ? 600 : 400,
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
          opacity: connected ? 1 : 0.25,
          transition: "opacity 200ms ease",
        },
      };
    });
  }, [
    nodes,
    links,
    forcePositions,
    selectedNodeId,
  ]);

  /*
   * Graph edges.
   */
  const edges: Edge[] = useMemo(
    () =>
      links.map((link) => {
        const connectedToSelected =
          selectedNodeId &&
          (link.source === selectedNodeId ||
            link.target === selectedNodeId);

        return {
          id: link.id,
          source: link.source,
          target: link.target,

          type:
            viewMode === "force"
              ? "straight"
              : "smoothstep",

          label: link.type,

          style: {
            stroke: connectedToSelected
              ? "#64748b"
              : viewMode === "force"
                ? "#334155"
                : "#9ca3af",

            strokeWidth:
              connectedToSelected ? 2 : 1.5,

            opacity:
              selectedNodeId &&
              !connectedToSelected
                ? 0.15
                : viewMode === "force"
                  ? 0.7
                  : 1,

            transition:
              "opacity 200ms ease, stroke 200ms ease",
          },

          labelStyle: {
            fill:
              viewMode === "force"
                ? "#64748b"
                : "#6b7280",

            fontSize: 9,

            fontWeight:
              connectedToSelected ? 600 : 500,

            opacity:
              selectedNodeId &&
              !connectedToSelected
                ? 0.2
                : 1,
          },

          labelBgStyle: {
            fill:
              viewMode === "force"
                ? "#080d18"
                : "#ffffff",

            fillOpacity: 0.9,
          },

          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
        };
      }),
    [
      links,
      viewMode,
      selectedNodeId,
    ],
  );

  const activeNodes =
    viewMode === "structured"
      ? structuredNodes
      : forceNodes;

  const isForceReady =
    viewMode === "force" &&
    Object.keys(forcePositions).length ===
      nodes.length;

  return (
    <div
      className={
        viewMode === "force"
          ? "relative h-full w-full bg-[#080d18]"
          : "relative h-full w-full bg-white"
      }
    >
      {/* Graph toolbar */}
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative">
          <GraphSearch
            nodes={nodes}
            onSelect={handleSearchSelect}
          />
        </div>

        {/* View switcher */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("force")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "force"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Force
          </button>

          <button
            type="button"
            onClick={() =>
              setViewMode("structured")
            }
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "structured"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Structured
          </button>
        </div>
      </div>

      {/* Graph */}
      {viewMode === "force" &&
      !isForceReady ? (
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
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
        >
          <Background
            color={
              viewMode === "force"
                ? "#111827"
                : "#e5e7eb"
            }
            gap={32}
            size={1}
          />

          <Controls
            showInteractive={false}
            position="bottom-left"
          />

          <MiniMap
  position="bottom-right"
  pannable
  zoomable
  nodeColor={(node) => {
    const graphNode = nodes.find(
      (item) => item.id === node.id,
    );

    if (!graphNode) {
      return "#64748b";
    }

    return (
      nodeColors[graphNode.type] ??
      "#94a3b8"
    );
  }}
  nodeStrokeColor={(node) => {
    const graphNode = nodes.find(
      (item) => item.id === node.id,
    );

    if (!graphNode) {
      return "#475569";
    }

    return (
      nodeColors[graphNode.type] ??
      "#94a3b8"
    );
  }}
  nodeBorderRadius={50}
  maskColor={
    viewMode === "force"
      ? "rgba(8, 13, 24, 0.75)"
      : "rgba(241, 245, 249, 0.75)"
  }
/>
        </ReactFlow>
      )}
    </div>
  );
}

export default GraphView;