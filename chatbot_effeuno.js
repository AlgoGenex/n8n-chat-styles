// chat-loader.js

(function () {
  // --- Persistent Session ID ---
  const sid = localStorage.getItem("n8nChatSid") || crypto.randomUUID();
  localStorage.setItem("n8nChatSid", sid);

  // --- Create host container ---
  const host = document.createElement("div");
  document.body.appendChild(host);

  // --- Attach Shadow DOM ---
  const shadow = host.attachShadow({ mode: "open" });

  // --- Load chat CSS INSIDE shadow ---
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://www.algogenex.com/n8n-chat-styles/style_voltest.css";
  shadow.appendChild(link);

  // --- Load preload image (optional) ---
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "image";
  preload.href =
    "https://github.com/AlgoGenex/AlgoGenex.github.io/blob/main/demo/voltest_logo.webp";
  shadow.appendChild(preload);

  // --- Chat container inside shadow ---
  const chatContainer = document.createElement("div");
  chatContainer.id = "n8n-chat";

    // --- Import chat bundle and mount inside shadow ---
  import("https://www.algogenex.com/n8n-chat-styles/script.js").then(
    ({ createChat }) => {
      createChat({
        webhookUrl: "",
        webhookConfig: {
          method: "POST",
          headers: {},
        },
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
    }
  );
  shadow.appendChild(chatContainer);

  // --- Helper bubble outside shadow (optional) ---
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
