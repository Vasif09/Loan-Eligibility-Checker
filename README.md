# Loan Eligibility Checker

A small, client-side web app that provides a simplified loan eligibility estimate, approximate EMI (monthly payment) and an estimated maximum loan amount based on monthly income, existing EMIs, tenure and an assumed interest rate.

This project is intended for learning and demonstration only — real lenders use far more checks and secure backends.

## Files
- `index.html` — the single-page UI
- `style.css` — simple styling
- `script.js` — calculation and UI logic (EMI calculation, eligibility checks, max-loan estimator)

## Features
- Calculate monthly EMI for a requested loan amount.
- Run basic eligibility checks (age, income, credit score, Debt-to-Income ratio).
- Estimate the maximum loan a borrower can afford given a DTI threshold (50% by default).
- Reset the form to defaults.

## Quick start
No build step or server is required — this is a static page.

On Windows (PowerShell) from the project folder:
```powershell
start 'index.html'
```

Or open `index.html` directly in any modern browser.

## How to use
- Fill the fields in the form and click **Check Eligibility** to see whether the applicant passes the basic checks and to view the computed EMI and DTI.
- Click **Estimate Max Loan** to compute an approximate maximum loan that keeps the borrower's DTI under the 50% threshold.
- Click **Reset** to return inputs to their default values (currently all zeros).

Form fields:
- Age — applicant age (validated 18–100 in the UI)
- Monthly Income (₹) — gross monthly income
- Existing monthly EMI (₹) — any existing loan payments
- Credit score (300–900)
- Requested loan amount (₹)
- Tenure (years) — loan duration in years
- Assumed Annual Interest Rate (%) — annual interest rate used for EMI calculation

Important: Some inputs have HTML `min`/`max` constraints (for example `age` minimum is 18 and `tenure` minimum is 1). Although the inputs are initialized to `0` per project settings, submitting invalid values will trigger browser validation.

## Calculation details
- EMI uses the standard amortization formula. If interest = 0, EMI = principal / months.
- DTI (Debt-to-Income) = (existing EMIs + new EMI) / monthly income.
- Eligibility rules in this demo:
	- Age between 18 and 65
	- Income >= ₹8,000
	- Credit score >= 600
	- DTI <= 50%

These rules are intentionally simple and are only for demonstration.

## Development notes
- The logic lives in `script.js`. It's pure client-side JavaScript and can be extended or replaced with backend checks for production use.

## Troubleshooting
- If the app shows no result after clicking the buttons, open the browser console to see errors (right-click → Inspect → Console).
- Ensure `script.js` is loaded (check in Network tab or console).

## License
MIT
