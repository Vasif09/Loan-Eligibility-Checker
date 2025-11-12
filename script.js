// Simple EMI & eligibility utility functions + UI handlers

/**
 * Calculate monthly EMI for a loan.
 * @param {number} principal
 * @param {number} annualRatePercent
 * @param {number} years
 * @returns {number} monthly EMI
 */
function calculateEMI(principal, annualRatePercent, years) {
    const n = Number(years) * 12;
    const r = Number(annualRatePercent) / 1200; // monthly rate
    if (!isFinite(principal) || principal <= 0 || n <= 0) return 0;
    if (r === 0) return principal / n;
    const pow = Math.pow(1 + r, n);
    return principal * r * pow / (pow - 1);
}


/**
 * Basic eligibility checks (very simplified):
 * - age 18-65
 * - income >= 8000
 * - creditScore >= 600
 * - DTI (existing EMIs + requested EMI) / income <= 0.5
 */
function checkEligibility({ age, income, existingEmi = 0, creditScore, requestedLoan, tenure, interest }) {
    if (age < 18 || age > 65) return { eligible: false, reason: 'Age outside acceptable range (18-65).' };
    if (income <= 0) return { eligible: false, reason: 'Income must be positive.' };
    if (creditScore < 300 || creditScore > 900) return { eligible: false, reason: 'Credit score out of range.' };
    if (income < 8000) return { eligible: false, reason: 'Income too low for standard loans.' };
    if (creditScore < 600) return { eligible: false, reason: 'Credit score below acceptable threshold (600).' };

    const emi = calculateEMI(requestedLoan, interest, tenure);
    const dti = (Number(existingEmi) + emi) / income;
    if (dti > 0.5) return { eligible: false, reason: `DTI too high. (${(dti * 100).toFixed(1)}%)`, emi, dti };
    return { eligible: true, reason: 'Looks good — basic checks passed.', emi, dti };
}


function estimateMaxLoan({ income, existingEmi = 0, tenure, interest, creditScore }) {
    if (creditScore < 600 || income < 8000) return 0;
    // Binary search for max principal where DTI <= 0.5
    let low = 0;
    let high = income * 200; // arbitrary upper bound (200x monthly income)
    for (let i = 0; i < 60; i++) {
        const mid = (low + high) / 2;
        const emi = calculateEMI(mid, interest, tenure);
        const dti = (existingEmi + emi) / income;
        if (dti > 0.5) high = mid; else low = mid;
    }
    return Math.round(low);
}


// --- UI wiring ---
const form = document.getElementById('loanForm');
const out = document.getElementById('output');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
        age: +document.getElementById('age').value,
        income: +document.getElementById('income').value,
        existingEmi: +document.getElementById('existingEmi').value || 0,
        creditScore: +document.getElementById('creditScore').value,
        requestedLoan: +document.getElementById('loanAmount').value,
        tenure: +document.getElementById('tenure').value,
        interest: +document.getElementById('interest').value
    };
    const res = checkEligibility(data);
    out.style.display = 'block';
    if (res.eligible) {
        out.innerHTML = `<strong class="ok">Eligible ✅</strong><br>EMI: ₹ ${Math.round(res.emi).toLocaleString()}<br>DTI: ${(res.dti * 100).toFixed(1)}%<br><small>${res.reason}</small>`;
    } else {
        out.innerHTML = `<strong class="bad">Not Eligible ✖</strong><br>${res.reason}${res.emi ? ('<br>EMI: ₹ ' + Math.round(res.emi).toLocaleString()) : ''}`;
    }
});


document.getElementById('estimateMax').addEventListener('click', function () {
    const params = {
        income: +document.getElementById('income').value,
        existingEmi: +document.getElementById('existingEmi').value || 0,
        tenure: +document.getElementById('tenure').value,
        interest: +document.getElementById('interest').value,
        creditScore: +document.getElementById('creditScore').value
    };
    const maxLoan = estimateMaxLoan(params);
    out.style.display = 'block';
    if (maxLoan <= 0) {
        out.innerHTML = `<strong class="bad">No loan recommended</strong><br><small>Profile doesn't meet criteria.</small>`;
    } else {
        const emi = calculateEMI(maxLoan, params.interest, params.tenure);
        out.innerHTML = `<strong class="ok">Max Loan: ₹ ${maxLoan.toLocaleString()}</strong><br>Approx EMI: ₹ ${Math.round(emi).toLocaleString()} / month`;
    }
});


document.getElementById('resetBtn').addEventListener('click', function () {
    form.reset();
    document.getElementById('age').value = 0;
    document.getElementById('income').value = 0;
    document.getElementById('existingEmi').value = 0;
    document.getElementById('creditScore').value = 0;
    document.getElementById('loanAmount').value = 0;
    document.getElementById('tenure').value = 0;
    document.getElementById('interest').value = 0;
    out.style.display = 'none';
});