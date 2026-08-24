import Layout from "../components/Layout";

function AskAgent() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Ask ContextGraph Agent
        </h1>

        <p className="mt-2 text-slate-500">
          Ask questions and receive answers grounded in graph context.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <textarea
            placeholder="Who owns Acme's current payment issue?"
            className="min-h-32 w-full resize-none rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-slate-400"
          />

          <button className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
            Ask Agent
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default AskAgent;