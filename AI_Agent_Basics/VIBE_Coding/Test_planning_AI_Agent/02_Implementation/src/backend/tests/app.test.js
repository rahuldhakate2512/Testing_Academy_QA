import assert from "node:assert/strict";
import { after, before, mock, test } from "node:test";
import { once } from "node:events";

process.env.VERCEL = "1";
const { default: app } = await import("../app.js");
let server;
let origin;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.close();
  await once(server, "close");
});

test("uses submitted credentials for that request only", async (context) => {
  let fetchCount = 0;
  const nativeFetch = globalThis.fetch;
  const fetchMock = mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).startsWith(origin)) return nativeFetch(url, options);
    fetchCount += 1;
    assert.match(String(url), /^https:\/\/test\.atlassian\.net\/rest\/api\/3\/issue\/QA-1/);
    assert.equal(options.headers.Authorization, `Basic ${Buffer.from("qa@example.test:temporary-token").toString("base64")}`);
    return new Response(JSON.stringify({
      key: "QA-1",
      fields: { summary: "Example", description: "Documented requirement" }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  });
  context.after(() => fetchMock.mock.restore());

  const result = await fetch(`${origin}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      issueKey: "QA-1",
      jiraEmail: "qa@example.test",
      jiraApiKey: "temporary-token",
      jiraUrl: "https://test.atlassian.net"
    })
  });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).generator, "source-based fallback");

  const nextRequest = await fetch(`${origin}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issueKey: "QA-1" })
  });
  assert.equal(nextRequest.status, 503);
  assert.equal((await nextRequest.json()).code, "JIRA_NOT_CONFIGURED");
  assert.equal(fetchCount, 1);
});

test("rejects non-Atlassian URLs before making an outbound request", async (context) => {
  const nativeFetch = globalThis.fetch;
  const fetchMock = mock.method(globalThis, "fetch", (url, options) => {
    if (String(url).startsWith(origin)) return nativeFetch(url, options);
    assert.fail("Invalid Jira URLs must not trigger outbound requests.");
  });
  context.after(() => fetchMock.mock.restore());

  const response = await fetch(`${origin}/api/settings/test-jira`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jiraEmail: "qa@example.test",
      jiraApiKey: "temporary-token",
      jiraUrl: "http://127.0.0.1"
    })
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "INVALID_JIRA_URL");
});
