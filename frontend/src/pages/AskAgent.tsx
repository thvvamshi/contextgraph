import {
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Loader2,
  Network,
  Send,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Layout from "../components/Layout";

import CustomerSelector from "../components/CustomerSelector";

import {
  askAgent,
  getCustomers,
  type CustomerOption,
} from "../services/api";

import type {
  AIAnswerData,
  AIEvidence,
} from "../types/ai-context";

/*
 * Example questions.
 */
const exampleQuestions = [
  "Who owns the customer's current issue?",

  "What is the verified resolution?",

  "Who are the experts working on this issue?",

  "Which team owns the issue, which experts are on that team, and which component and vendors are affected?",
];

/*
 * Ask Agent page.
 */
function AskAgent() {
  /*
   * Customers loaded dynamically
   * from GET /api/customers.
   */
  const [customers, setCustomers] =
    useState<CustomerOption[]>([]);

  /*
   * Currently selected customer.
   */
  const [customerId, setCustomerId] =
    useState("");

  /*
   * Customer loading state.
   */
  const [customersLoading, setCustomersLoading] =
    useState(true);

  /*
   * Customer loading error.
   */
  const [customersError, setCustomersError] =
    useState<string | null>(null);

  /*
   * Question.
   */
  const [question, setQuestion] =
    useState("");

  /*
   * AI answer.
   */
  const [answer, setAnswer] =
    useState<AIAnswerData | null>(null);

  /*
   * AI request loading state.
   */
  const [loading, setLoading] =
    useState(false);

  /*
   * AI request error.
   */
  const [error, setError] =
    useState<string | null>(null);

  /*
   * Load customers from backend.
   */
  useEffect(() => {
    let mounted = true;

    async function loadCustomers() {
      try {
        setCustomersLoading(true);
        setCustomersError(null);

        const response =
          await getCustomers();

        if (!response.success) {
          throw new Error(
            "Unable to load customers.",
          );
        }

        if (!mounted) {
          return;
        }

        setCustomers(response.data);

        /*
         * Select first customer automatically.
         */
        if (response.data.length > 0) {
          setCustomerId(
            response.data[0].id,
          );
        } else {
          setCustomerId("");
        }
      } catch (err) {
        console.error(
          "Failed to load customers:",
          err,
        );

        if (!mounted) {
          return;
        }

        setCustomersError(
          err instanceof Error
            ? err.message
            : "Unable to load customers.",
        );

        setCustomers([]);
        setCustomerId("");
      } finally {
        if (mounted) {
          setCustomersLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Currently selected customer.
   */
  const selectedCustomer =
    customers.find(
      (customer) =>
        customer.id === customerId,
    ) ?? null;

  /*
   * Change customer.
   */
  function handleCustomerChange(
    nextCustomerId: string,
  ) {
    setCustomerId(nextCustomerId);

    /*
     * Clear previous answer because
     * it belongs to the previous customer.
     */
    setAnswer(null);
    setError(null);
  }

  /*
   * Ask graph-grounded AI agent.
   */
  async function handleAsk() {
    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      !customerId ||
      loading ||
      customersLoading
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response =
        await askAgent(
          customerId,
          trimmedQuestion,
        );

      if (!response.success) {
        throw new Error(
          "Unable to generate an answer.",
        );
      }

      setAnswer(response.data);
    } catch (err) {
      console.error(
        "Ask Agent failed:",
        err,
      );

      /*
       * Try to surface Axios/backend error
       * when available.
       */
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to get an answer from the ContextGraph agent.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /*
   * Select example question.
   */
  function handleExampleClick(
    example: string,
  ) {
    setQuestion(example);
    setError(null);
  }

  /*
   * Ctrl + Enter / Cmd + Enter.
   */
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      (event.ctrlKey ||
        event.metaKey)
    ) {
      event.preventDefault();

      handleAsk();
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">

        {/* ========================= */}
        {/* Header */}
        {/* ========================= */}

        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Bot
                size={17}
                className="text-white"
              />
            </div>

            <p className="text-sm font-medium text-slate-500">
              Graph-grounded AI
            </p>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Ask ContextGraph Agent
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Ask questions about customers,
            tickets, bugs, teams, experts,
            and resolutions. Answers are
            grounded in the connected context
            graph.
          </p>
        </section>

        {/* ========================= */}
        {/* Query Card */}
        {/* ========================= */}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          {/* Customer selector */}

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer context
            </label>

            <CustomerSelector
              customers={customers}
              value={customerId}
              onChange={
                handleCustomerChange
              }
              disabled={loading}
              loading={customersLoading}
            />

            {/* Customer loading error */}

            {customersError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  Unable to load customers
                </p>

                <p className="mt-1 text-xs text-red-500">
                  {customersError}
                </p>
              </div>
            )}
          </div>

          {/* Selected customer */}

          <div className="mb-5 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
              <CircleDot
                size={16}
                className="text-slate-500"
              />
            </div>

            <div>
              {selectedCustomer ? (
                <>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedCustomer.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {selectedCustomer.id}
                  </p>
                </>
              ) : customersLoading ? (
                <>
                  <p className="text-sm font-medium text-slate-500">
                    Loading customers...
                  </p>

                  <p className="text-xs text-slate-400">
                    Retrieving graph context
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-500">
                    No customer selected
                  </p>

                  <p className="text-xs text-slate-400">
                    No customers available
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Question */}

          <label
            htmlFor="question"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Your question
          </label>

          <textarea
            id="question"
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value,
              )
            }
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Who owns Acme's current payment issue?"
            className="min-h-36 w-full resize-none rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
          />

          {/* Example questions */}

          <div className="mt-4">
            <p className="mb-2 text-xs text-slate-400">
              Try asking
            </p>

            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map(
                (example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() =>
                      handleExampleClick(
                        example,
                      )
                    }
                    disabled={loading}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {example}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Action */}

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-400">
              Press Ctrl + Enter to ask
            </p>

            <button
              type="button"
              onClick={handleAsk}
              disabled={
                loading ||
                customersLoading ||
                !customerId ||
                !question.trim()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Thinking...
                </>
              ) : (
                <>
                  <Send size={16} />

                  Ask Agent
                </>
              )}
            </button>
          </div>
        </section>

        {/* ========================= */}
        {/* Error */}
        {/* ========================= */}

        {error && (
          <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to answer question
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ========================= */}
        {/* Answer */}
        {/* ========================= */}

        {answer && (
          <AnswerPanel
            answer={answer}
          />
        )}
      </div>
    </Layout>
  );
}

/*
 * ============================
 * Answer Panel
 * ============================
 */

function AnswerPanel({
  answer,
}: {
  answer: AIAnswerData;
}) {
  return (
    <div className="mt-6 space-y-6">

      {/* Answer */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Answer
              </h2>

              <p className="text-xs text-slate-400">
                Grounded in ContextGraph
              </p>
            </div>
          </div>

          <span className="max-w-[240px] truncate rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
            {answer.model}
          </span>
        </div>

        <div className="px-6 py-6">
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {answer.answer}
          </div>
        </div>
      </section>

      {/* Context summary */}

      <ContextSummary
        summary={answer.contextSummary}
      />

      {/* Evidence */}

      <EvidencePanel
        evidence={answer.evidence}
      />
    </div>
  );
}

/*
 * ============================
 * Context Summary
 * ============================
 */

function ContextSummary({
  summary,
}: {
  summary: AIAnswerData["contextSummary"];
}) {
  const stats = [
    {
      label: "Tickets",
      value: summary.ticketCount,
    },
    {
      label: "Products",
      value: summary.productCount,
    },
    {
      label: "Bugs",
      value: summary.bugCount,
    },
    {
      label: "Teams",
      value: summary.teamCount,
    },
    {
      label: "Experts",
      value: summary.expertCount,
    },
    {
      label: "Resolutions",
      value: summary.resolutionCount,
    },
    {
      label: "Documents",
      value: summary.documentCount,
    },
    {
      label: "Relationships",
      value: summary.relationshipCount,
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
          <Network
            size={17}
            className="text-slate-600"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Retrieved context
          </h2>

          <p className="text-xs text-slate-400">
            Graph entities used for this answer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <p className="text-xs text-slate-400">
              {stat.label}
            </p>

            <p className="mt-1 text-xl font-semibold text-slate-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/*
 * ============================
 * Evidence Panel
 * ============================
 */

function EvidencePanel({
  evidence,
}: {
  evidence: AIEvidence[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Graph evidence
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Relationships supporting the answer
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
          {evidence.length}{" "}
          {evidence.length === 1
            ? "relationship"
            : "relationships"}
        </span>
      </div>

      {evidence.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center">
          <p className="text-sm text-slate-400">
            No graph relationships were
            returned as evidence.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {evidence.map(
            (item, index) => (
              <EvidenceRow
                key={`${item.source}-${item.relationship}-${item.target}-${index}`}
                evidence={item}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}

/*
 * ============================
 * Evidence Row
 * ============================
 */

function EvidenceRow({
  evidence,
}: {
  evidence: AIEvidence;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">

      <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
        {evidence.source}
      </span>

      <div className="flex shrink-0 items-center gap-1.5">

        <ArrowRight
          size={13}
          className="text-slate-400"
        />

        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
          {evidence.relationship}
        </span>

        <ArrowRight
          size={13}
          className="text-slate-400"
        />

      </div>

      <span className="min-w-0 flex-1 truncate rounded-md bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
        {evidence.target}
      </span>
    </div>
  );
}

export default AskAgent;