# Jira Test Plan Generator

## Run locally

Requires Node.js 18+. From this folder:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`. The backend reads the workspace-root `.env` for optional defaults: `JIRA_EMAIL`, `JIRA_API_KEY`, `JIRA_URL`, `GROQ_API_KEY`, and `GROQ_MODEL`. Never commit credentials.

## Configure

In Settings, enter values directly or select a `.env` file. The file is parsed in the browser; it is not uploaded or saved. The app accepts Jira Cloud values (`JIRA_EMAIL`, `JIRA_API_KEY`, `JIRA_URL`) and Groq values (`GROQ_API_KEY`, `GROQ_MODEL`). Entered credentials remain in page memory, are sent to the backend over HTTPS only when testing or generating, and are not persisted.

For safety, a Vercel deployment ignores Jira/Groq secret environment variables and requires each user to provide their own credentials; otherwise a public visitor could use a shared account. `GROQ_MODEL` may be set as a non-secret default. Do not put Vercel deployment credentials in the app.

## Deploy to Vercel

This folder contains the Vercel function entry point, SPA output configuration, and build command. Authenticate with your own Vercel account from this folder:

```powershell
npm install
npx vercel
```

On the first run, create/link the project as `testplanaiagent`. Add `testplanaiagent.vercel.app` to the project's Domains if Vercel does not assign it automatically. For later production deployments, run:

```powershell
npx vercel --prod
```

## Notes

- The API accepts HTTPS Atlassian Cloud URLs only.
- Local `.env` credentials are used only outside Vercel.
- If Groq is unavailable or not configured, the app returns a clearly labeled source-based fallback draft.
- Live Jira/Groq checks require valid credentials and network access.
