/**
 * toolboxpay - Clean Production Build
 * Theme: Orange, White & Slate | British English
 * Logic: Removed dev markers, local addresses, and platform badges.
 */

const root = document.getElementById('root');
if (root) {
  let showTutorial = true; 

  /**
   * BRANDING SCRUB: This function targets the "Made in Bolt" badge 
   * specifically to ensure the app looks fully bespoke.
   */
  const scrubBranding = () => {
    // Target common selectors and text patterns used by the platform badge
    const platformElements = document.querySelectorAll('a[href*="bolt.new"], [class*="bolt-badge"], #bolt-logo');
    platformElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    // Safety check: Remove by searching for the text content directly if necessary
    const allDivs = document.getElementsByTagName('div');
    for (let i = 0; i < allDivs.length; i++) {
        if (allDivs[i].textContent === 'Made in Bolt') {
            allDivs[i].style.display = 'none';
        }
    }
  };

  const render = () => {
    if (!root) return;
    root.innerHTML = '';
    
    const ui = document.createElement('div');
    ui.style.cssText = "background:#2F3542; min-height:100dvh; display:flex; flex-direction:column; color:#fff; font-family:sans-serif; overflow:hidden;";

    // Header
    const head = document.createElement('div');
    head.style.cssText = "padding:20px; background:#111; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center; padding-top: env(safe-area-inset-top);";
    head.innerHTML = `<b style="color:orange; font-size:1.2rem;">toolbox<span style="color:#fff;">pay</span></b>`;
    ui.appendChild(head);

    const body = document.createElement('div');
    body.style.cssText = "padding:20px; flex:1; overflow-y:auto; padding-bottom: calc(env(safe-area-inset-bottom) + 80px);";

    if (showTutorial) {
      body.innerHTML = `
        <div style="margin-top:10px;">
            <div style="display:flex; gap:15px; margin-bottom:25px; align-items: flex-start;">
                <div style="background:orange; color:#000; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; flex-shrink:0;">1</div>
                <div>
                    <b style="font-size:1.1rem;">Set Up Your Brand</b>
                    <p style="font-size:0.85rem; color:#a4b0be; margin-top:8px; line-height:1.4;">
                        Go to the <b>ADMIN</b> tab. Enter your business name, business address, and bank details. Upload your logo to appear on all professional paperwork.
                    </p>
                </div>
            </div>
            <button id="close-guide" style="width:100%; padding:18px; background:orange; color:#000; border:none; border-radius:12px; font-weight:bold; cursor:pointer; font-size:0.9rem;">
                GET STARTED
            </button>
        </div>
      `;
    } else {
      body.innerHTML = `<div style="text-align:center; padding-top:100px; color:#57606f;">Terminal Active & Secure</div>`;
    }

    ui.appendChild(body);
    root.appendChild(ui);

    // Run scrub immediately and then on a short interval to catch late injections
    scrubBranding();
    setTimeout(scrubBranding, 500);
    setTimeout(scrubBranding, 2000);

    const btn = document.getElementById('close-guide');
    if (btn) btn.onclick = () => { showTutorial = false; render(); };
  };

  render();
}