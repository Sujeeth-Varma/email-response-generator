import { useMemo, useState } from "react";

type ApiResponse = {
  data: string;
  errorMessage: string | null;
  success: boolean;
};

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  const tones = useMemo(() => [
      "professional",
      "friendly",
      "casual",
      "empathetic",
      "assertive",
      "apologetic",
      "enthusiastic",
      "encouraging",
      "urgent",
      "neutral",
    ],
    []
  );

  async function handleGenerate() {
    setError(null);
    setResponse("");
    setLoading(true);
    setCopied(false)
    try {
      const res = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, tone }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json = (await res.json()) as ApiResponse;
      if (!json.success) {
        throw new Error(json.errorMessage || "Failed to generate response");
      }
      setResponse(json.data);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = emailContent.trim().length > 0 && !loading;

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-neutral-900" />
            <span className="font-semibold tracking-tight">ReplyCraft</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Input
            </h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Email content
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email you received or write your context here..."
                className="h-48 w-full resize-y rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-800"
              />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-800"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.186l3.71-3.956a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  disabled={!canSubmit}
                  onClick={handleGenerate}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="relative inline-flex size-4">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex size-4 rounded-full bg-white" />
                      </span>
                      Generating...
                    </>
                  ) : (
                    <>Generate response</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold tracking-tight">
              Response
            </h2>

            <div className="min-h-48 rounded-xl border border-dashed border-neutral-300 p-4">
              {loading && !response ? (
                <div className="space-y-3">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
                </div>
              ) : response ? (
                <div className="prose prose-neutral max-w-none text-sm">
                  <pre className="whitespace-pre-wrap break-words font-sans text-[0.925rem] leading-6">
                    {response}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  Your AI-crafted reply will appear here.
                </p>
              )}
            </div>

            {response && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(response);
                    setCopied(true);
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-800"
                >
                  Copy
                </button>
                <button
                  onClick={() => setResponse("")}
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-800"
                >
                  Clear
                </button>
              </div>
            )}
            {copied && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm">
                  Copied to clipboard
                </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
