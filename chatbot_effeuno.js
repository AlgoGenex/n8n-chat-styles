// production chat-loader.js
(function () {
  // --- Persistent session ID ---
  const sid = localStorage.getItem('n8nChatSid') || crypto.randomUUID();
  localStorage.setItem('n8nChatSid', sid);

  // --- Create host ---
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

  // --- Attach shadow root ---
  const sr = host.attachShadow({ mode: 'open' });

  // --- Create chat container inside shadow ---
  const chatDiv = document.createElement('div');
  chatDiv.id = 'n8n-chat';
  Object.assign(chatDiv.style, { width: '100%', height: '100%', minHeight: '200px' });
  sr.appendChild(chatDiv);

  // --- Fetch and inline CSS ---
  const cssUrl = 'https://www.algogenex.com/n8n-chat-styles/style_voltest.css';
  (async () => {
    try {
      const res = await fetch(cssUrl, { cache: 'no-cache', mode: 'cors' });
      if (!res.ok) throw new Error('CSS fetch failed: ' + res.status);
      let cssText = await res.text();

      // Remove @font-face rules (avoids blocked fonts/CORS)
      cssText = cssText.replace(/@font-face\s*\{[^}]*\}/gmi, '');

      // Safety overrides: system fonts + visible chat
      const safety = `
        :host, :host * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial !important;
        }
        .chat-window {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `;

      const style = document.createElement('style');
      style.textContent = cssText + '\n' + safety;
      sr.appendChild(style);
      console.log('Chat CSS inlined into shadow root');
    } catch (err) {
      console.error('Failed to fetch/inline CSS:', err);
    }
  })();

  // --- Import and mount chat ---
  const bundleUrl = 'https://www.algogenex.com/n8n-chat-styles/script.js';
  (async () => {
    try {
      const module = await import(bundleUrl);
      const createChat = module.createChat || module.default || module;
      if (typeof createChat !== 'function') throw new Error('createChat not found in module');

      await createChat({
        webhookUrl: '', // set your webhook
        webhookConfig: { method: 'POST', headers: {} },
        target: chatDiv,
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
            title: 'Effeuno Car Detailing',
            subtitle: 'Scrivici! Siamo qui per aiutarti 24/7',
            footer: '',
            getStarted: 'Nuova Conversazione',
            inputPlaceholder: 'Scrivi il tuo messaggio...'
          }
        },
        enableStreaming: false
      });

      // Auto-open chat
      setTimeout(() => {
        try {
          const toggle = sr.querySelector('.chat-window-toggle');
          if (toggle) toggle.click();
          const win = sr.querySelector('.chat-window');
          if (win) Object.assign(win.style, { display: 'block', opacity: '1', visibility: 'visible' });
        } catch (e) { console.warn('Auto-open failed', e); }
      }, 150);

    } catch (err) {
      console.error('Failed to load chat bundle:', err);
    }
  })();
})();
