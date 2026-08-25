import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { GraphNode } from "../types/graph";

interface GraphSearchProps {
  nodes: GraphNode[];
  onSelect: (node: GraphNode) => void;
}

function GraphSearch({
  nodes,
  onSelect,
}: GraphSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return nodes
      .filter((node) => {
        const matchesLabel =
          node.label.toLowerCase().includes(value);

        const matchesType =
          node.type.toLowerCase().includes(value);

        const matchesProperties = Object.values(
          node.properties,
        ).some((property) =>
          String(property)
            .toLowerCase()
            .includes(value),
        );

        return (
          matchesLabel ||
          matchesType ||
          matchesProperties
        );
      })
      .slice(0, 8);
  }, [query, nodes]);

  function handleSelect(node: GraphNode) {
    onSelect(node);
    setQuery("");
  }

  function handleClear() {
    setQuery("");
  }

  return (
    <div className="relative w-[320px]">
      {/* Search input */}
      <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 shadow-sm transition focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100">
        <Search
          size={16}
          className="shrink-0 text-gray-400"
        />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search context..."
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          aria-label="Search context graph"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {query && (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-[360px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {results.length === 0 ? (
            <div className="px-3 py-5 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Search
                  size={14}
                  className="text-gray-400"
                />
              </div>

              <p className="text-xs font-medium text-gray-600">
                No matching entities
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                Try a different name or type
              </p>
            </div>
          ) : (
            <>
              <div className="px-2 py-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Matching entities
                </p>
              </div>

              {results.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() =>
                    handleSelect(node)
                  }
                  className="group w-full rounded-md px-3 py-2.5 text-left transition hover:bg-gray-50"
                >
                  {/* Entity name */}
                  <div className="truncate text-sm font-medium text-gray-800 group-hover:text-gray-950">
                    {node.label}
                  </div>

                  {/* Entity metadata */}
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                    <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-500">
                      {node.type}
                    </span>

                    <span className="truncate text-[10px] text-gray-400">
                      {node.id}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GraphSearch;