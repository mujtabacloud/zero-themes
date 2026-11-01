---
title: "Saving Form Submissions to Google Sheets"
slug: "google-sheets-contact-form"
section: "Form Integration"
order: 3
summary: "Capture customer leads, inquiries, and newsletter signups directly into a free Google Spreadsheet without a backend database."
---

# Saving Form Submissions to Google Sheets

Zero Themes includes a serverless contact form handler that posts directly to a Google Apps Script web app endpoint.

## How It Works

1. In your Google Sheet, create column headers:
   `timestamp | name | email | subject | message | source`

2. Open **Extensions > Apps Script** and deploy the Web App with:
   - **Execute as**: Me
   - **Who has access**: Anyone

3. In `assets/js/main.js` (or via PagesCMS Settings), set your `GOOGLE_SHEET_ENDPOINT`:
   ```javascript
   const GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/.../exec";
   ```

4. Submissions are dispatched using `application/x-www-form-urlencoded` under `mode: 'no-cors'`, ensuring 100% success without CORS preflight blocks.
