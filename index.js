/* toolboxpay Core Logic
   Handles data persistence and dashboard updates for live deployment
*/

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

/**
 * Pulls data from local storage to update the orange and white command centre
 */
function updateDashboard() {
    // Business Branding
    const bizName = localStorage.getItem('companyName') || "Business Name";
    const userLoc = localStorage.getItem('userLocation') || "Location Not Set";
    
    const bizDisplay = document.getElementById('bizName');
    const locDisplay = document.getElementById('displayLoc');

    if (bizDisplay) bizDisplay.innerText = bizName;
    if (locDisplay) locDisplay.innerText = "Service Area: " + userLoc;

    // Financial Totals
    const quotes = JSON.parse(localStorage.getItem('quoteHistory')) || [];
    const expenses = JSON.parse(localStorage.getItem('expenseHistory')) || [];

    const totalIncome = quotes.reduce((sum, q) => sum + parseFloat(q.total || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amt || 0), 0);
    
    // Net profit calculation (assuming 20% tax set-aside)
    const netProfit = (totalIncome - totalExpenses) * 0.8;
    
    const profitDisplay = document.getElementById('totalProfit');
    if (profitDisplay) {
        profitDisplay.innerText = "£" + netProfit.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Recent Activity Logic
    loadRecentActivity(quotes);
}

/**
 * Displays the last recorded labour quote on the dashboard
 */
function loadRecentActivity(quotes) {
    const quickQuote = document.getElementById('quickQuote');
    const lastQuoteVal = document.getElementById('lastQuoteVal');

    if (quotes.length > 0 && quickQuote && lastQuoteVal) {
        const lastQ = quotes[quotes.length - 1];
        lastQuoteVal.innerText = "£" + parseFloat(lastQ.total).toLocaleString('en-GB');
        quickQuote.style.display = "flex";
    }
}
