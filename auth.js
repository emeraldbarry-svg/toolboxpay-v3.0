/**
 * Security Auth Script for Toolbox Pay
 * Ensuring the user has entered their PIN for the current session.
 */

(function checkAuth() {
    const isSetup = localStorage.getItem('companyName');
    const isUnlocked = sessionStorage.getItem('unlocked');
    const currentPage = window.location.pathname;

    // 1. If no setup exists, force redirect to setup
    if (!isSetup && !currentPage.includes('setup.html')) {
        window.location.href = 'setup.html';
        return;
    }

    // 2. If setup exists but not unlocked, force redirect to lock screen
    if (isSetup && !isUnlocked && !currentPage.includes('lock.html') && !currentPage.includes('setup.html')) {
        window.location.href = 'lock.html';
    }
})();
