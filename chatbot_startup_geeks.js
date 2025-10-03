// chat-loader-shadow-adopted.js
(async function () {
  const SID_KEY = 'n8nChatSid';
  const sid = localStorage.getItem(SID_KEY) || crypto.randomUUID();
  localStorage.setItem(SID_KEY, sid);

  const cssUrl = 'https://www.algogenex.com/n8n-chat-styles/style_startup_geeks.css'; // change if needed
  const bundleUrl = 'https://www.algogenex.com/n8n-chat-styles/script.js';     // change if needed

  // 1) create host and attach shadow root
  const host = document.createElement('div');
  host.className = 'n8n-chat-host';
  Object.assign(host.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    width: '360px',
    height: '600px',
    zIndex: '2147483647',
    display: 'block',
    pointerEvents: 'auto',
    overflow: 'visible'
  });
  document.body.appendChild(host);
  const sr = host.attachShadow({ mode: 'open' });

  // 2) make a container for the chat UI
  const chatDiv = document.createElement('div');
  chatDiv.id = 'n8n-chat';
  Object.assign(chatDiv.style, { width: '100%', height: '100%', minHeight: '200px' });
  sr.appendChild(chatDiv);

  // 3) fetch CSS text and preprocess it
  let cssText = '';
  try {
    const resp = await fetch(cssUrl, { cache: 'no-cache', mode: 'cors' });
    if (!resp.ok) throw new Error('CSS fetch failed: ' + resp.status);
    cssText = await resp.text();
  } catch (err) {
    console.warn('n8n: failed to fetch CSS, falling back to link in shadow. Error:', err);
    // fallback: attach <link> inside shadow (may work in many browsers)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    sr.appendChild(link);
  }

  if (cssText) {
    try {
      // remove @font-face blocks to avoid blocked cross-origin font fetches
      cssText = cssText.replace(/@font-face\s*\{[\s\S]*?\}/gmi, '');

      // extract :root custom properties and move them to :host
      let hostVars = '';
      const rootMatch = cssText.match(/:root\s*\{([\s\S]*?)\}/i);
      if (rootMatch) {
        hostVars = `:host{${rootMatch[1]}}`;
        cssText = cssText.replace(/:root\s*\{[\s\S]*?\}/i, '');
      }

      // rewrite relative url(...) to absolute (so assets referenced from CSS resolve)
      try {
        const base = new URL(cssUrl, location.href);
        cssText = cssText.replace(/url\((['"]?)(?!data:|https?:|\/)([^'")]+)\1\)/gi,
          (m, q, p) => `url(${q}${base.origin}/${p.replace(/^\/+/, '')}${q})`);
      } catch (e) {
        // if URL parsing fails, ignore
      }

      // final stylesheet content to apply to shadow
      const finalCss = hostVars + '\n' + cssText + '\n' + `
        /* safety overrides for predictable rendering */
        :host, :host * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial !important; }
      `;

      // 4) apply stylesheet using adoptedStyleSheets when available
      if (typeof CSSStyleSheet === 'function' && 'adoptedStyleSheets' in sr) {
        const sheet = new CSSStyleSheet();
        // replace returns a Promise; await it for correctness
        await sheet.replace(finalCss);
        // append to any existing sheets
        sr.adoptedStyleSheets = [...sr.adoptedStyleSheets, sheet];
        console.log('n8n: applied CSS via adoptedStyleSheets');
      } else {
        // fallback: inject <style> (textContent) into shadow
        const style = document.createElement('style');
        style.textContent = finalCss;
        sr.appendChild(style);
        console.log('n8n: applied CSS via <style> fallback');
      }
    } catch (e) {
      console.error('n8n: error preprocessing/applying CSS:', e);
    }
  }

  // 5) import and mount the chat bundle, passing the element (not a selector)
  try {
    const module = await import(bundleUrl);
    const createChat = module.createChat || module.default || module;
    if (typeof createChat !== 'function') throw new Error('createChat not exported from module');

    await createChat({
      webhookUrl: 'https://n8n.algogenex.com/webhook/ff6c311c-cfeb-4539-ac18-6de3eb238cb1/chat',
      webhookConfig: { method: 'POST', headers: {} },
      target: chatDiv, // PASS THE ELEMENT so it mounts inside the shadow
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: true,
      metadata: { sessionId: sid },
      showWelcomeScreen: false,
      defaultLanguage: 'en',
      initialMessages: ['Ciao! Come posso aiutarti? 😊'],
      i18n: {
        en: {
          title: '',
          subtitle: 'Scrivici! Siamo qui per aiutarti 24/7',
          footer: '',
          getStarted: 'Nuova Conversazione',
          inputPlaceholder: 'Scrivi il tuo messaggio...'
        }
      },
      enableStreaming: false
    });

    console.log('n8n: chat mounted inside shadow root');
  } catch (err) {
    console.error('n8n: failed to import/mount chat bundle:', err);
    // show minimal error inside shadow so you at least see something
    const errNode = document.createElement('div');
    errNode.textContent = 'Chat failed to load — check console.';
    Object.assign(errNode.style, { padding: '12px', fontSize: '13px', background: '#fee', color: '#900' });
    chatDiv.appendChild(errNode);
  }

  // --- Helper bubble inside shadow ---
setTimeout(() => {
  const helper = document.createElement("div");
  helper.className = "chat-helper-bubble";
  helper.innerText = "Ciao! Come posso aiutarti? 😊";

  sr.appendChild(helper);

  // fade out after 5s
  //setTimeout(() => {
    //helper.style.opacity = "0";
    //setTimeout(() => helper.remove(), 500);
  //}, 5000);
  setTimeout(() => {
    helper.style.opacity = "0";
    setTimeout(() => helper.remove(), 500);
  }, 5000);
}, 2000);
})();
