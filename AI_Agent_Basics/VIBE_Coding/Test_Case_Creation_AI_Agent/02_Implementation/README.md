# Jira Test Case Generator

Simple React and Express application for reading a Jira issue and generating test cases.

## Run

From this folder:

```powershell
npm install
npm run dev
```

Open `http://localhost:5175`.

## Configuration

Locally, the backend reads `JIRA_EMAIL`, `JIRA_API_KEY`, `JIRA_URL`, `GROQ_API_KEY`, and `GROQ_MODEL` from the workspace-root `.env`. On Vercel, users enter those values in Settings or select their `.env` file. The file is parsed in the browser and is not uploaded; entered values are sent to this app's backend only when generating or testing a connection and are not saved.

Vercel deployment environment variables are not used for Jira or Groq credentials, so users do not share a deployment owner's account. Live Jira and Groq calls require network access and valid credentials.

## Use

Enter an issue key such as `QA-123`, then select **Generate test cases**. If Groq is unavailable or not configured, the app clearly displays a source-based fallback draft.

## Deploy to Vercel

From this folder, install and deploy using the Vercel CLI while signed in to your own account:

```powershell
npm install
npx vercel --name aitestcase-agent
npx vercel --prod --name aitestcase-agent
```

Select this folder as the project root and assign `aitestcase-agent.vercel.app` as a project domain if it is available in your Vercel account. No Jira or Groq secrets are needed as Vercel environment variables.

## Verification

```powershell
npm run build
npm test
```
