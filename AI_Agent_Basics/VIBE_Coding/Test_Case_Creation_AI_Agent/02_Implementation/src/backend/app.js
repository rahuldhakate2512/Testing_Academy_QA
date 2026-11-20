import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.VERCEL !== "1") {
  dotenv.config({ path: path.resolve(__dirname, "../../../../../..", ".env") });
}

const app = express();
app.use(express.json({ limit: "1mb" }));

const missing = "Insufficient information to determine.";
const isVercel = process.env.VERCEL === "1";
const defaults = {
  jiraEmail: isVercel ? "" : process.env.JIRA_EMAIL || "",
  jiraApiKey: isVercel ? "" : process.env.JIRA_API_KEY || "",
  jiraUrl: isVercel ? "" : (process.env.JIRA_URL || "").replace(/\/+$/, ""),
  groqApiKey: isVercel ? "" : process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
};

function settings(input = {}) {
  const value = (key) => typeof input[key] === "string" && input[key].trim() ? input[key].trim() : defaults[key];
  return {
    jiraEmail: value("jiraEmail"),
    jiraApiKey: value("jiraApiKey"),
    jiraUrl: value("jiraUrl").replace(/\/+$/, ""),
    groqApiKey: value("groqApiKey"),
    groqModel: value("groqModel")
  };
}

function text(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  const parts = [];
  function walk(node) {
    if (!node) return;
    if (typeof node.text === "string") parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(walk);
  }
  walk(value);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function acceptanceCriteria(fields) {
  for (const name of ["Acceptance Criteria", "Acceptance criteria", "acceptance_criteria"]) {
    const key = Object.keys(fields).find((field) =>
      field === name || (fields[field]?.name === name)
    );
    if (key) return text(fields[key]);
  }
  return "";
}

function validateJiraUrl(value) {
  let url;
  try { url = new URL(value); } catch {
    throw Object.assign(new Error("Enter a valid Jira Cloud URL."), { status: 400 });
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".atlassian.net")) {
    throw Object.assign(new Error("Jira URL must be an HTTPS Atlassian Cloud site."), { status: 400 });
  }
  return url.origin;
}

function fallbackTestCases(issue) {
  const fields = issue.fields || {};
  const summary = text(fields.summary) || missing;
  const description = text(fields.description) || missing;
  const ac = acceptanceCriteria(fields) || missing;
  return `# Test Cases — ${issue.key}: ${summary}

Source Jira issue: ${issue.key}

| TID | Category | Description | Pre-conditions | Steps | Expected | Priority |
|---|---|---|---|---|---|---|
| TC-1 | Functional (happy path) | Proposed verification of the Jira summary: ${summary} | ${missing} | 1. Open the relevant application area.<br>2. Perform the documented action. | Verify the documented behavior: ${description} | P0 |
| TC-2 | Negative | Proposed negative verification. | ${missing} | 1. Repeat the relevant action with invalid or unavailable input.<br>2. Observe the result. | ${missing} | P1 |
| TC-3 | Boundary | Proposed boundary verification based only on the Jira source. | ${missing} | 1. Identify a source-defined boundary.<br>2. Test the boundary and adjacent values. | ${missing} | P1 |
| TC-4 | Edge case | Proposed verification of acceptance criteria. | ${missing} | 1. Review the acceptance criteria.<br>2. Perform the relevant scenario. | ${ac} | P1 |

> Proposed testing activities are not confirmed product requirements.
> Missing application details: ${missing}`;
}

async function fetchIssue(issueKey, config) {
  if (!/^[A-Z][A-Z0-9]*-\d+$/.test(issueKey)) {
    throw Object.assign(new Error("Enter a valid Jira issue key, for example QA-123."), { status: 400 });
  }
  if (!config.jiraEmail || !config.jiraApiKey || !config.jiraUrl) {
    throw Object.assign(new Error("Jira is not configured. Add Jira email, API token, and URL."), { status: 503 });
  }
  const baseUrl = validateJiraUrl(config.jiraUrl);
  const auth = Buffer.from(`${config.jiraEmail}:${config.jiraApiKey}`).toString("base64");
  const response = await fetch(`${baseUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=*all`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" }
  });
  if (response.status === 401) throw Object.assign(new Error("Jira authentication failed."), { status: 401 });
  if (response.status === 403) throw Object.assign(new Error("Jira permission denied."), { status: 403 });
  if (response.status === 404) throw Object.assign(new Error("Jira issue was not found."), { status: 404 });
  if (!response.ok) throw Object.assign(new Error(`Jira returned an unexpected error (${response.status}).`), { status: 502 });
  return response.json();
}

async function generateWithGroq(issue, config) {
  if (!config.groqApiKey) return null;
  const fields = issue.fields || {};
  const source = JSON.stringify({
    key: issue.key,
    summary: text(fields.summary) || missing,
    description: text(fields.description) || missing,
    acceptanceCriteria: acceptanceCriteria(fields) || missing,
    status: fields.status?.name,
    priority: fields.priority?.name,
    issueType: fields.issuetype?.name
  });
  const template = `| TID | Category | Description | Pre-conditions | Steps | Expected | Priority |
|---|---|---|---|---|---|---|
| ... | Functional/Negative/Boundary/Edge case | ... | ... | ... | ... | P0/P1/P2 |`;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.groqApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.groqModel,
      temperature: 0,
      messages: [
        { role: "system", content: `Generate test cases using only the supplied Jira source. Use the exact table section names and order. Use exactly "${missing}" for missing details. Mark every testing activity as a proposal. Do not invent requirements or acceptance criteria.` },
        { role: "user", content: `Template:\n${template}\n\nJira source JSON:\n${source}` }
      ]
    })
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

app.get("/api/settings/status", (_req, res) => {
  res.json({
    jiraConfigured: Boolean(defaults.jiraEmail && defaults.jiraApiKey && defaults.jiraUrl),
    groqConfigured: Boolean(defaults.groqApiKey),
    llmModel: defaults.groqModel
  });
});

app.post("/api/settings/test-jira", async (req, res) => {
  try {
    const config = settings(req.body);
    if (!config.jiraEmail || !config.jiraApiKey || !config.jiraUrl) {
      return res.status(503).json({ error: "Jira is not configured." });
    }
    const baseUrl = validateJiraUrl(config.jiraUrl);
    const auth = Buffer.from(`${config.jiraEmail}:${config.jiraApiKey}`).toString("base64");
    const response = await fetch(`${baseUrl}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" }
    });
    if (!response.ok) return res.status(response.status).json({ error: "Jira connection test failed." });
    res.json({ message: "Jira connection successful." });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.post("/api/settings/test-groq", async (req, res) => {
  const config = settings(req.body);
  if (!config.groqApiKey) return res.status(503).json({ error: "Groq API key is not configured." });
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${config.groqApiKey}` }
    });
    if (!response.ok) return res.status(502).json({ error: "Groq connection test failed." });
    res.json({ message: "Groq connection successful." });
  } catch (error) {
    res.status(502).json({ error: "Groq could not be reached." });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const issueKey = typeof req.body.issueKey === "string" ? req.body.issueKey.trim().toUpperCase() : "";
    const issue = await fetchIssue(issueKey, settings(req.body));
    const config = settings(req.body);
    let testCases = await generateWithGroq(issue, config);
    let generator = "groq";
    if (!testCases) {
      testCases = fallbackTestCases(issue);
      generator = "fallback";
    }
    res.json({
      issueKey: issue.key,
      issueUrl: config.jiraUrl ? `${validateJiraUrl(config.jiraUrl)}/browse/${issue.key}` : null,
      testCases,
      generator
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Unable to generate test cases." });
  }
});

app.use((error, _req, res, _next) => {
  if (res.headersSent) return;
  const status = error.status || (error.type === "entity.parse.failed" ? 400 : 500);
  res.status(status).json({
    error: status === 400 ? "Invalid request body. Send valid JSON." : "The server could not complete the request."
  });
});

export default app;
