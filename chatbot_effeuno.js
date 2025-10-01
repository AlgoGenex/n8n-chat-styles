// chat-loader.js

(function () {
  // --- Persistent Session ID ---
  const sid = localStorage.getItem('n8nChatSid') || crypto.randomUUID();
  localStorage.setItem('n8nChatSid', sid);

  // --- Create host for Shadow DOM ---
  const host = document.createElement('div');
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  // --- Load chat CSS inside Shadow DOM ---
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://www.algogenex.com/n8n-chat-styles/style_voltest.css';
  shadow.appendChild(style);

  // --- Create chat container inside Shadow DOM ---
  const div = document.createElement('div');
  div.id = 'n8n-chat';
  shadow.appendChild(div);

  // --- Import chat bundle and start ---
  import("https://www.algogenex.com/n8n-chat-styles/script.js")
    .then(({ createChat }) => {
      createChat({
        webhookUrl: "",
        webhookConfig: { method: "POST", headers: {} },
        target: "#n8n-chat",
        mode: "window",
        chatInputKey: "chatInput",
        chatSessionKey: "sessionId",
        loadPreviousSession: true,
        metadata: { sessionId: sid },
        showWelcomeScreen: false,
        defaultLanguage: "en",
        initialMessages: ["Ciao! Come posso aiutarti? 😊"],
        i18n: {
          en: {
            title: "Effeuno Car Detailing",
            subtitle: "Scrivici! Siamo qui per aiutarti 24/7",
            footer: "",
            getStarted: "Nuova Conversazione",
            inputPlaceholder: "Scrivi il tuo messaggio...",
          },
        },
        enableStreaming: false,
      });
    });

  // --- Helper bubble outside Shadow DOM (optional) ---
  setTimeout(() => {
    const helper = document.createElement("div");
    helper.className = "chat-helper-bubble";
    helper.innerText = "Ciao! Come posso aiutarti? 😊";
    document.body.appendChild(helper);

    setTimeout(() => {
      helper.classList.add("fade-out");
      setTimeout(() => helper.remove(), 500);
    }, 5000);
  }, 2000);
})();
