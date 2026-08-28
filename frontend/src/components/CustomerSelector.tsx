import {
  Check,
  ChevronDown,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { CustomerOption } from "../services/api";

interface CustomerSelectorProps {
  customers: CustomerOption[];
  value: string;
  onChange: (customerId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

function CustomerSelector({
  customers,
  value,
  onChange,
  disabled = false,
  loading = false,
}: CustomerSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCustomer =
    customers.find(
      (customer) => customer.id === value,
    ) ?? null;

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.id
          .toLowerCase()
          .includes(query) ||
        customer.tier
          .toLowerCase()
          .includes(query)
      );
    });
  }, [customers, search]);

  function handleSelect(customerId: string) {
    onChange(customerId);
    setOpen(false);
    setSearch("");
  }

  function handleClose() {
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* Trigger */}
      <button
        type="button"
        disabled={
          disabled ||
          loading ||
          customers.length === 0
        }
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      >
        <div className="min-w-0">
          {loading ? (
            <p className="text-sm text-slate-400">
              Loading customers...
            </p>
          ) : selectedCustomer ? (
            <>
              <p className="truncate text-sm font-medium text-slate-800">
                {selectedCustomer.name}
              </p>

              <p className="truncate text-[11px] text-slate-400">
                {selectedCustomer.tier}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Select a customer
            </p>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`ml-3 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Click-away layer */}
          <button
            type="button"
            aria-label="Close customer selector"
            className="fixed inset-0 z-30 cursor-default"
            onClick={handleClose}
          />

          <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {/* Search */}
            <div className="border-b border-slate-100 p-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                <Search
                  size={15}
                  className="shrink-0 text-slate-400"
                />

                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search customers..."
                  className="h-9 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Customers
              </span>

              <span className="text-[10px] text-slate-400">
                {filteredCustomers.length} of{" "}
                {customers.length}
              </span>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredCustomers.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Search
                    size={18}
                    className="mx-auto mb-2 text-slate-300"
                  />

                  <p className="text-sm font-medium text-slate-500">
                    No customers found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another name or customer ID.
                  </p>
                </div>
              ) : (
                filteredCustomers.map(
                  (customer) => {
                    const selected =
                      customer.id === value;

                    return (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() =>
                          handleSelect(
                            customer.id,
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                          selected
                            ? "bg-slate-100"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {customer.name}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                              {customer.tier}
                            </span>

                            <span className="truncate text-[10px] text-slate-400">
                              {customer.id}
                            </span>
                          </div>
                        </div>

                        {selected && (
                          <Check
                            size={16}
                            className="ml-3 shrink-0 text-slate-700"
                          />
                        )}
                      </button>
                    );
                  },
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerSelector;