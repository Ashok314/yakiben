# Deployment Guide (Automated CI/CD)

This project uses GitHub Actions to automatically deploy both the Frontend (GitHub Pages) and the Backend (Google Apps Script) whenever you push to the `develop` branch.

## 🔐 1. Prerequisite: GitHub Secrets
To make the automation work, you must add these secrets in **Settings > Secrets and variables > Actions**:

| Secret Name | How to get it |
| :--- | :--- |
| `CLASPRC_JSON` | Run `clasp login` locally, then copy the content of `~/.clasprc.json` |
| `SCRIPT_ID` | The ID found in `apps/api/.clasp.json` |
| `GITHUB_TOKEN` | Automatically provided by GitHub (no action needed) |

## 🚀 2. How to Update
Just push your code!
```bash
git add .
git commit -m "Your changes"
git push origin develop
```

## 🛠 3. Troubleshooting
### Deployment Fails with "Authentication Error"
Your Google login token might have expired.
1. Run `clasp login` on your local machine.
2. Copy the new contents of `~/.clasprc.json`.
3. Update the `CLASPRC_JSON` secret in GitHub.

### API URL Changed
If you accidentally created a new deployment instead of updating the old one:
1. Find the new ID: `npx @google/clasp deployments`.
2. Update the `DEPLOYMENT_ID` secret in GitHub.
3. Trigger the workflow manually or push a small change.
