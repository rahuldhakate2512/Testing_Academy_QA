import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

async function readResponse(response) {
  const body = await response.text();
  let data;
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`The server returned an invalid response (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(data.error || `The request failed (HTTP ${response.status}).`);
  }
  if (!body) {
    throw new Error(`The server returned an empty response (HTTP ${response.status}).`);
  }
  return data;
}

function App() {
  const [page, setPage] = useState("main");
  const [issueKey, setIssueKey] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jira, setJira] = useState({ email: "", apiKey: "", url: "" });
  const [llm, setLlm] = useState({ apiKey: "", model: "llama-3.3-70b-versatile" });

  useEffect(() => {
    fetch("/api/settings/status").then(readResponse).then((data) =>
      setLlm((old) => ({ ...old, model: data.llmModel || old.model }))
    ).catch(() => {});
  }, []);

  function values() {
    return {
      jiraEmail: jira.email,
      jiraApiKey: jira.apiKey,
      jiraUrl: jira.url,
      groqApiKey: llm.apiKey,
      groqModel: llm.model
    };
  }

  async function importEnv(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const found = {};
    for (const line of (await file.text()).split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      let value = match[2];
      if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
      found[match[1]] = value;
    }
    setJira({
      email: found.JIRA_EMAIL || "",
      apiKey: found.JIRA_API_KEY || "",
      url: found.JIRA_URL || ""
    });
    setLlm((old) => ({
      apiKey: found.GROQ_API_KEY || "",
      model: found.GROQ_MODEL || old.model
    }));
    setMessage("Environment values loaded locally. The file was not uploaded.");
    event.target.value = "";
  }

  async function generate(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey, ...values() })
      });
      const data = await readResponse(response);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function testConnection(kind) {
    setMessage("");
    try {
      const response = await fetch(`/api/settings/test-${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values())
      });
      const data = await readResponse(response);
      setMessage(data.message || "Connection successful.");
    } catch (requestError) {
      setMessage(requestError.message);
    }
  }

  return (
    <main className="shell">
      <div className="topbar">
        <button className={page === "main" ? "active" : ""} onClick={() => setPage("main")}>Main page</button>
        <button className={page === "settings" ? "active" : ""} onClick={() => setPage("settings")}>Settings</button>
      </div>

      {page === "main" ? (
        <section className="card">
          <h1>Main page</h1>
          <form onSubmit={generate}>
            <label htmlFor="issue">Jira issue ID</label>
            <div className="issue-row">
              <input id="issue" value={issueKey} onChange={(e) => setIssueKey(e.target.value)} placeholder="QA-123" disabled={loading} />
              <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate test cases"}</button>
            </div>
          </form>
          {loading && <div className="state">Retrieving Jira issue and generating test cases...</div>}
          {error && <div className="state error" role="alert">{error}</div>}
          {result && (
            <article className="result">
              <div className="result-head">
                <strong>{result.issueKey}</strong>
                {result.issueUrl && <a href={result.issueUrl} target="_blank" rel="noreferrer">Open in Jira</a>}
                <span>{result.generator === "groq" ? "AI-generated draft" : "Source-based fallback"}</span>
              </div>
              <pre>{result.testCases}</pre>
            </article>
          )}
        </section>
      ) : (
        <section className="card settings-card">
          <h1>Settings</h1>
          <label className="env-file">Import .env file
            <input type="file" accept=".env,text/plain" onChange={importEnv} />
          </label>
          <div className="settings-grid">
            <div className="panel">
              <h2>JIRA Connection</h2>
              <label>Email<input type="email" value={jira.email} onChange={(e) => setJira({ ...jira, email: e.target.value })} /></label>
              <label>API token<input type="password" value={jira.apiKey} onChange={(e) => setJira({ ...jira, apiKey: e.target.value })} /></label>
              <label>URL<input value={jira.url} onChange={(e) => setJira({ ...jira, url: e.target.value })} placeholder="https://example.atlassian.net" /></label>
              <button type="button" onClick={() => testConnection("jira")}>Test connection</button>
            </div>
            <div className="panel">
              <h2>LLM Configuration</h2>
              <div className="provider">1. Ollama Connection <em>Local LLM</em></div>
              <div className="provider groq">2. Groq.com (API Key)</div>
              <label>API Key<input type="password" value={llm.apiKey} onChange={(e) => setLlm({ ...llm, apiKey: e.target.value })} /></label>
              <label>Model<input value={llm.model} onChange={(e) => setLlm({ ...llm, model: e.target.value })} /></label>
              <button type="button" onClick={() => testConnection("groq")}>Test Groq.com</button>
            </div>
          </div>
          {message && <div className="settings-message" role="status">{message}</div>}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
