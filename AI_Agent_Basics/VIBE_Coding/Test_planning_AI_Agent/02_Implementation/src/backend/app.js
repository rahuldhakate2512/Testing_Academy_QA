import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../../../../.env") });

const app = express();
app.use(express.json({ limit: "1mb" }));

const defaults = process.env.VERCEL === "1" ? {
  jiraEmail: "",
  jiraApiKey: "",
  jiraUrl: "",
  groqApiKey: "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
} : {
  jiraEmail: process.env.JIRA_EMAIL || "",
  jiraApiKey: process.env.JIRA_API_KEY || "",
  jiraUrl: (process.env.JIRA_URL || "").replace(/\/+$/, ""),
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
};

const missing = "Insufficient information to determine.";

function getSettings(input = {}) {
  const provided = input && typeof input === "object" ? input : {};
  const setting = (key) => typeof provided[key] === "string" && provided[key].trim()
    ? provided[key].trim()
    : defaults[key];
  return {
    jiraEmail: setting("jiraEmail"),
    jiraApiKey: setting("jiraApiKey"),
    jiraUrl: setting("jiraUrl").replace(/\/+$/, ""),
    groqApiKey: setting("groqApiKey"),
    groqModel: setting("groqModel")
  };
}

function validateJiraUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw Object.assign(new Error("Enter a valid Jira Cloud URL."), { status: 400, code: "INVALID_JIRA_URL" });
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".atlassian.net")) {
    throw Object.assign(new Error("Jira URL must be an HTTPS Atlassian Cloud site."), { status: 400, code: "INVALID_JIRA_URL" });
  }
  return url.origin;
}

function textFromDescription(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) return String(value);
  const parts = [];
  function walk(node) {
    if (!node) return;
    if (typeof node.text === "string") parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(walk);
  }
  walk(value);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function issueDescription(fields) {
  return textFromDescription(fields.description) || missing;
}

function acceptanceCriteria(fields) {
  for (const name of ["Acceptance Criteria", "Acceptance criteria", "acceptance_criteria"]) {
    const key = Object.keys(fields).find((field) => field === name || fields[field]?.name === name);
    if (key) return textFromDescription(fields[key]);
  }
  return missing;
}

function fallbackPlan(issue) {
  const fields = issue.fields || {};
  const key = issue.key;
  const title = fields.summary || missing;
  const description = issueDescription(fields);
  const ac = acceptanceCriteria(fields);
  return `# Test Plan — ${key}: ${title}

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.
> AI fallback: Groq generation is unavailable. This source-based draft does not confirm inferred behavior.

## 1. Scope & Objectives
- **In scope:**
  - ${description}
- **Out of scope:** ${missing}
- **Objective:** Validate the documented Jira issue behavior and acceptance criteria.

## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Acceptance criteria | ${ac === missing ? "❌" : "⚠️"} | ${ac === missing ? "Please provide acceptance criteria." : "Are the listed acceptance criteria complete?"} |
| 2 | Test environment | ❌ | What test environment and feature flags are required? |
| 3 | Test data | ❌ | What test data and roles are required? |

## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 | pos | Proposed verification of the documented Jira description: ${description} | Jira description |
| TS-2 | P1 | neg | Proposed boundary/negative verification for missing acceptance criteria. | Gap 1 |
| TS-3 | P1 | boundary | Proposed boundary verification if the Jira ticket defines boundaries. | Gap 2 |

## 4. Test Data & Environment
- **Data:** ${missing}
- **Environment / flags:** ${missing}
- **Roles / permissions:** ${missing}

## 5. Risks & Assumptions
- **Assumptions made:** No product behavior is assumed beyond the retrieved Jira issue.
- **Risks:** Scope may be incomplete because Jira acceptance criteria or product details are missing.

## 6. Entry / Exit criteria
- **Entry:** ${missing}
- **Exit:** ${missing}

## 7. Resource Allocation
${missing}

## 8. Timelines, Sprint Details
${missing}

---
## HUMAN REVIEW GATE
- **I assumed:** No unconfirmed behavior.
- **I could not confirm:** Application details not provided in the Jira issue.
- **Open questions blocking sign-off:** Acceptance criteria, test environment, test data, roles, entry/exit criteria, resources, and timeline.
- **Approve, or edit, before I write test cases / automation.**`;
}

async function fetchIssue(issueKey, config) {
  if (!/^[A-Z][A-Z0-9]*-\d+$/.test(issueKey)) {
    throw Object.assign(new Error("Enter a valid Jira issue key, for example QA-123."), { status: 400, code: "INVALID_KEY" });
  }
  if (!config.jiraEmail || !config.jiraApiKey || !config.jiraUrl) {
    throw Object.assign(new Error("Jira is not configured. Add Jira email, API token, and URL."), { status: 503, code: "JIRA_NOT_CONFIGURED" });
  }
  const jiraUrl = validateJiraUrl(config.jiraUrl);
  const auth = Buffer.from(`${config.jiraEmail}:${config.jiraApiKey}`).toString("base64");
  const response = await fetch(`${jiraUrl}/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=*all`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" }
  });
  if (response.status === 401) throw Object.assign(new Error("Jira authentication failed."), { status: 401, code: "JIRA_AUTH" });
  if (response.status === 403) throw Object.assign(new Error("Jira permission denied."), { status: 403, code: "JIRA_PERMISSION" });
  if (response.status === 404) throw Object.assign(new Error("Jira issue was not found."), { status: 404, code: "JIRA_NOT_FOUND" });
  if (!response.ok) throw Object.assign(new Error(`Jira returned an unexpected error (${response.status}).`), { status: 502, code: "JIRA_ERROR" });
  return response.json();
}

async function generateWithGroq(issue, config) {
  if (!config.groqApiKey) return null;
  const fields = issue.fields || {};
  const source = JSON.stringify({
    key: issue.key,
    summary: fields.summary || missing,
    description: issueDescription(fields),
    acceptanceCriteria: acceptanceCriteria(fields),
    status: fields.status?.name,
    priority: fields.priority?.name,
    issuetype: fields.issuetype?.name
  });
  const template = `# Test Plan — <JIRA-KEY>: <title>
> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.
## 1. Scope & Objectives
- **In scope:**
- **Out of scope:**
- **Objective:** what "tested" means for this ticket.
## 2. Gaps & Questions for the author
| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 |      |                |                    |
## 3. Test Scenarios
| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | P0 |                       |          |                    |
## 4. Test Data & Environment
- **Data:**
- **Environment / flags:**
- **Roles / permissions:**
## 5. Risks & Assumptions
- **Assumptions made:**
- **Risks:**
## 6. Entry / Exit criteria
- **Entry:**
- **Exit:**
## 7. Resource Allocation
## 8. Timelines, Sprint Details
---
## HUMAN REVIEW GATE
- **I assumed:** …
- **I could not confirm:** …
- **Open questions blocking sign-off:** …
- **Approve, or edit, before I write test cases / automation.**`;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.groqApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
    model: config.groqModel,
      temperature: 0,
      messages: [
        { role: "system", content: `Fill the exact supplied test plan template. Use only the Jira source data below. Separate proposals. Use exactly "${missing}" for missing values. If necessary use exactly "Inference (low confidence)". Do not invent requirements or acceptance criteria.` },
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
    jira: { configured: Boolean(defaults.jiraEmail && defaults.jiraApiKey && defaults.jiraUrl) },
    llm: { configured: Boolean(defaults.groqApiKey), provider: "Groq", model: defaults.groqModel }
  });
});

app.post("/api/settings/test-jira", async (req, res, next) => {
  try {
    const config = getSettings(req.body);
    if (!config.jiraEmail || !config.jiraApiKey || !config.jiraUrl) {
      return res.status(503).json({ error: "Jira is not configured.", code: "JIRA_NOT_CONFIGURED" });
    }
    const jiraUrl = validateJiraUrl(config.jiraUrl);
    const auth = Buffer.from(`${config.jiraEmail}:${config.jiraApiKey}`).toString("base64");
    const response = await fetch(`${jiraUrl}/rest/api/3/myself`, {
      headers: { Authorization: `Basic ${auth}`, Accept: "application/json" }
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 502).json({ error: response.status === 401 ? "Jira authentication failed." : "Jira connection test failed.", code: "JIRA_TEST_FAILED" });
    res.json({ ok: true, message: "Jira connection successful." });
  } catch (error) {
    if (error.status) return next(error);
    next(Object.assign(new Error("Jira connection test failed."), { status: 502, code: "JIRA_NETWORK" }));
  }
});

app.post("/api/settings/test-groq", async (req, res, next) => {
  try {
    const config = getSettings(req.body);
    if (!config.groqApiKey) return res.status(503).json({ error: "Groq API key is not configured.", code: "GROQ_NOT_CONFIGURED" });
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${config.groqApiKey}` }
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 502).json({ error: "Groq connection test failed.", code: "GROQ_TEST_FAILED" });
    res.json({ ok: true, message: "Groq connection successful." });
  } catch (_error) {
    next(Object.assign(new Error("Groq connection test failed."), { status: 502, code: "GROQ_NETWORK" }));
  }
});

app.post("/api/generate", async (req, res, next) => {
  try {
    const config = getSettings(req.body);
    const issueKey = typeof req.body.issueKey === "string" ? req.body.issueKey.trim().toUpperCase() : "";
    const issue = await fetchIssue(issueKey, config);
    let plan;
    let generator = "groq";
    try {
      plan = await generateWithGroq(issue, config);
      if (!plan) { plan = fallbackPlan(issue); generator = "source-based fallback"; }
    } catch (_error) {
      plan = fallbackPlan(issue);
      generator = "source-based fallback";
    }
    res.json({
      issueKey: issue.key,
      issueUrl: `${validateJiraUrl(config.jiraUrl)}/browse/${encodeURIComponent(issue.key)}`,
      title: issue.fields?.summary || missing,
      plan,
      generator
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  res.status(error.status || 500).json({ error: error.message || "Unexpected server error.", code: error.code || "INTERNAL_ERROR" });
});

export default app;
