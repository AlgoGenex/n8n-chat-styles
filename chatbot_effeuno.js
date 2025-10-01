// chat-loader.js

// chat-loader.js
(function () {
  // --- persistent session id ---
  const sid = localStorage.getItem('n8nChatSid') || crypto.randomUUID();
  localStorage.setItem('n8nChatSid', sid);

  // --- create host and shadow root ---
  const host = document.createElement('div');
  // optionally give host a class so site owners can target it if needed:
  host.className = 'n8n-chat-host';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  // --- inject chat CSS into shadow root (scoped) ---
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  // recommended: use the official dist style (CDN) or your hosted CSS
  styleLink.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  shadow.appendChild(styleLink);

  // --- optional: small inline safety style to ensure host positioning ---
  const safetyStyle = document.createElement('style');
  safetyStyle.textContent = `
    :host { all: initial; } /* optional: prevents site CSS from affecting host element itself */
    /* you can keep host visible for debugging */
  `;
  // NOTE: :host in shadow's stylesheet references the shadow host element
  shadow.appendChild(safetyStyle);

  // --- create chat container inside shadow root ---
  const chatDiv = document.createElement('div');
  chatDiv.id = 'n8n-chat';
  shadow.appendChild(chatDiv);

  // --- helper bubble (keeps it in page DOM, not in shadow) ---
  setTimeout(() => {
    const helper = document.createElement('div');
    helper.className = 'chat-helper-bubble';
    helper.innerText = 'Ciao! Come posso aiutarti? 😊';
    document.body.appendChild(helper);
    setTimeout(() => {
      helper.classList.add('fade-out');
      setTimeout(() => helper.remove(), 500);
    }, 5000);
  }, 2000);

  // --- import n8n chat bundle and start; pass the DOM element directly ---
  // Use the same bundle path used in official examples. If you host your own script.js,
  // replace the import path accordingly.
  import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
    .then(({ createChat }) => {
      createChat({
        webhookUrl: 'https://n8n.algogenex.com/webhook/ff6c311c-cfeb-4539-ac18-6de3eb238cb1/chat',
        webhookConfig: { method: 'POST', headers: {} },
        // PASS THE ELEMENT (not a selector)
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
            inputPlaceholder: 'Scrivi il tuo messaggio...',
          },
        },
        enableStreaming: false,
      });
    })
    .catch((err) => {
      // graceful fallback if import fails (CSP, network, etc.)
      console.error('Failed to load n8n chat bundle:', err);
    });
})();
