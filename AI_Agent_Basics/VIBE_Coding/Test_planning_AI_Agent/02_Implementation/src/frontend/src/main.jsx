import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [page, setPage] = useState("main");
  const [issueKey, setIssueKey] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [jira, setJira] = useState({ email: "", url: "", apiKey: "" });
  const [llm, setLlm] = useState({ apiKey: "", model: "llama-3.3-70b-versatile" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/status")
      .then((response) => response.json())
      .then((data) => {
        setSettings(data);
        setLlm({ apiKey: "", model: data.llm?.model || "llama-3.3-70b-versatile" });
      })
      .catch(() => setSettings(null));
  }, []);

  function requestSettings() {
    return {
      jiraEmail: jira.email,
      jiraApiKey: jira.apiKey,
      jiraUrl: jira.url,
      groqApiKey: llm.apiKey,
      groqModel: llm.model
    };
  }

  async function importEnvFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const values = {};
    for (const line of (await file.text()).split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      } else {
        value = value.replace(/\s+#.*$/, "").trim();
      }
      values[match[1]] = value;
    }
    setJira((previous) => ({
      email: values.JIRA_EMAIL || previous.email,
      apiKey: values.JIRA_API_KEY || previous.apiKey,
      url: values.JIRA_URL || previous.url
    }));
    setLlm((previous) => ({
      apiKey: values.GROQ_API_KEY || previous.apiKey,
      model: values.GROQ_MODEL || previous.model
    }));
    setMessage("Recognized environment values loaded locally. The file was not uploaded.");
    event.target.value = "";
  }

  async function generate(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueKey, ...requestSettings() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate a test plan.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setMessage("Settings are ready for this page session only; they are not saved.");
  }

  async function testConnection(kind) {
    setMessage("");
    const response = await fetch(`/api/settings/test-${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestSettings())
    });
    const data = await response.json();
    setMessage(response.ok ? data.message : data.error);
  }

  return (
    <main className="shell">
      <nav className="tabs" aria-label="Application navigation">
        <button className={page === "main" ? "active" : ""} onClick={() => setPage("main")}>Main page</button>
        <button className={page === "settings" ? "active" : ""} onClick={() => setPage("settings")}>Settings</button>
      </nav>

      {page === "main" ? (
        <section className="card main-card">
          <h1>Main page</h1>
          <form onSubmit={generate} className="issue-form">
            <label htmlFor="issue-key">Jira issue ID</label>
            <div className="form-row">
              <input id="issue-key" value={issueKey} onChange={(event) => setIssueKey(event.target.value)} placeholder="QA-123" disabled={loading} />
              <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate test plan"}</button>
            </div>
          </form>

          {loading && <div className="state">Retrieving Jira issue and generating the draft...</div>}
          {error && <div className="state error" role="alert">{error}</div>}
          {result && (
            <article className="plan">
              <div className="plan-heading">
                <div>
                  <strong>{result.issueKey}</strong>
                  {result.issueUrl && <a href={result.issueUrl} target="_blank" rel="noreferrer">Open in Jira</a>}
                </div>
                <span>{result.generator === "groq" ? "AI-generated draft" : "Source-based fallback"}</span>
              </div>
              <pre>{result.plan}</pre>
            </article>
          )}
        </section>
      ) : (
        <section className="card settings-card">
          <h1>Settings</h1>
          <label className="env-import">Import .env file (read locally; not uploaded)
            <input type="file" accept=".env,text/plain" onChange={importEnvFile} />
          </label>
          <div className="settings-grid">
            <div className="setting-panel">
              <h2>JIRA Connection</h2>
              <label>Email<input type="email" value={jira.email} onChange={(event) => setJira({ ...jira, email: event.target.value })} placeholder={settings?.jira?.configured ? "Optional if set in deployment" : ""} /></label>
              <label>API token<input type="password" value={jira.apiKey} onChange={(event) => setJira({ ...jira, apiKey: event.target.value })} placeholder={settings?.jira?.configured ? "Optional if set in deployment" : ""} /></label>
              <label>URL<input value={jira.url} onChange={(event) => setJira({ ...jira, url: event.target.value })} placeholder={settings?.jira?.configured ? "Optional if set in deployment" : "https://example.atlassian.net"} /></label>
              <button type="button" onClick={() => testConnection("jira")}>Test connection</button>
            </div>
            <div className="setting-panel">
              <h2>LLM Configuration</h2>
              <div className="provider"><span>1.</span> Ollama Connection <em>Local LLM</em></div>
              <div className="provider groq"><span>2.</span> Groq.com</div>
              <label>API Key<input type="password" value={llm.apiKey} onChange={(event) => setLlm({ ...llm, apiKey: event.target.value })} placeholder={settings?.llm?.configured ? "Optional if set in deployment" : ""} /></label>
              <label>Model<input value={llm.model} onChange={(event) => setLlm({ ...llm, model: event.target.value })} /></label>
              <button type="button" onClick={() => testConnection("groq")}>Test Groq.com</button>
            </div>
          </div>
          <button className="save" type="button" onClick={saveSettings}>Use settings</button>
          {message && <div className="settings-message" role="status">{message}</div>}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
