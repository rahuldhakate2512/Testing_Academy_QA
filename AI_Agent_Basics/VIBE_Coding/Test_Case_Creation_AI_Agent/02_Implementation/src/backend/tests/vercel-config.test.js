import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("Vercel ignores deployment-wide Jira and Groq credentials", () => {
  const script = `
    const { default: app } = await import("./src/backend/app.js");
    const server = app.listen(0, "127.0.0.1", async () => {
      try {
        const response = await fetch("http://127.0.0.1:" + server.address().port + "/api/settings/status");
        const status = await response.json();
        console.log(String(status.jiraConfigured) + " " + String(status.groqConfigured));
      } finally {
        server.close();
      }
    });
  `;
  const output = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    encoding: "utf8",
    env: {
      ...process.env,
      VERCEL: "1",
      JIRA_EMAIL: "test@example.invalid",
      JIRA_API_KEY: "test",
      JIRA_URL: "https://example.atlassian.net",
      GROQ_API_KEY: "test"
    }
  });
  assert.equal(output.trim(), "false false");
});
