# Security Policy

## Supported Versions

MatdataApp is actively developed on the `main` branch. Only the latest deployed version at
[matdata-app-2977556014.asia-south1.run.app](https://matdata-app-2977556014.asia-south1.run.app) receives security fixes.

| Version         | Supported |
| ---------------- | --------- |
| `main` (latest)  | ✅        |
| Older commits    | ❌        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**.

Instead, use GitHub's private vulnerability reporting for this repository:
1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability** under "Private vulnerability reporting."
3. Provide as much detail as possible: steps to reproduce, affected endpoint/file, and potential impact.

You can expect an initial response within 5 business days. If the report is confirmed, a fix will be prioritized
and you will be credited in the release notes unless you prefer to remain anonymous.

## Scope

This project handles the following categories of data and functionality — please prioritize reports related to:
- The `/api/chat` endpoint and its interaction with the Gemini API
- The `/api/booth` endpoint (currently returns demo data only — no real voter data is stored)
- Any exposed secrets, API keys, or credentials in the codebase or git history
- Authentication/authorization bypass (note: this app currently has no user login system)
- Cross-site scripting (XSS) or injection vulnerabilities in user-submitted input (chat messages, EPIC number field)

## Out of Scope

- The mock/demo nature of candidate and booth data is a known, intentional limitation documented in the README,
  not a security issue.
- Third-party services this app depends on (Google Gemini API, Google Analytics, Google Translate, OpenStreetMap/
  Nominatim) should be reported to those providers directly, not here.
