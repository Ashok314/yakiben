# Yakiben API

This folder contains the backend implementation for the Yakiben project using Google Apps Script.

## Setup Instructions

1. **Install clasp**:
   - Install clasp globally: `npm install -g @google/clasp`.

2. **Authenticate clasp**:
   - Run `clasp login` to authenticate with your Google account.

3. **Initialize the project**:
   - Navigate to the `apps/api/` folder: `cd apps/api`.
   - Create a new Apps Script project: `clasp create --type standalone --title "Yakiben Backend"`.

4. **Pull the Apps Script files**:
   - If the project already exists, pull the files: `yarn clasp pull`.

5. **Push changes**:
   - After making changes, push them to Apps Script: `yarn clasp push`.

6. **Deploy the backend**:
   - Deploy the Apps Script as a web app: `yarn clasp deploy`.

## Folder Structure
- `Code.gs`: Main backend logic.
- `appsscript.json`: Apps Script project configuration.
- Additional files and folders will be added as needed.