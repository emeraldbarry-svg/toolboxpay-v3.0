/**
 * toolboxpay System Audit & Security Controller
 * Verifies PIN status and Business Setup before allowing access.
 */

(function systemAudit() {
    const isSetup = localStorage.getItem('companyName');
    const isUnlocked = sessionStorage.getItem('unlocked');
    const path = window.location.pathname;
    const page = path.split("/").pop();

    // 1. Check for valid setup
    if (!isSetup) {
        if (page !== "setup.html") {
            console.warn("Audit: No Business Profile found. Redirecting to Setup.");
            window.location.href = "setup.html";
            return;
        }
    }

    // 2. Check for security lock status
    if (isSetup && isUnlocked !== "true") {
        const publicPages = ["lock.html", "setup.html"];
        if (!publicPages.includes(page) && page !== "") {
            console.warn("Audit: Session Locked. Redirecting to Security Gate.");
            window.location.href = "lock.html";
        }
    }

    // 3. Prevent logged-in users from seeing the lock screen
    if (isUnlocked === "true" && page === "lock.html") {
        window.location.href = "index.html";
    }

    console.log("toolboxpay: Audit Complete. System Secure.");
})();
