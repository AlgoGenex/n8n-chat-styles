// chat-loader.js

(function () {
  // --- Persistent Session ID ---
  const sid = localStorage.getItem('n8nChatSid') || crypto.randomUUID();
  localStorage.setItem('n8nChatSid', sid);

  // --- Create Shadow DOM container ---
  const container = document.createElement("div");
  container.id = "n8n-chat-container";
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: "open" });

  // --- Load chat CSS inside Shadow DOM ---
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://www.algogenex.com/n8n-chat-styles/style_voltest.css";
  shadow.appendChild(link);

  // --- Create chat div inside Shadow DOM ---
  const chatDiv = document.createElement("div");
  chatDiv.id = "n8n-chat";
  shadow.appendChild(chatDiv);

  // --- Import chat bundle and start ---
  import("https://www.algogenex.com/n8n-chat-styles/script.js")
    .then(({ createChat }) => {
      createChat({
        webhookUrl: "https://n8n.algogenex.com/webhook/e0f5234e-f4ae-4971-9435-a39f576cfe86/chat",
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
        initialMessages: ["Hi! How can I help you? 😊"],
        i18n: {
          en: {
            title: "",
            subtitle: "Contact us! We are here to help you 24/7",
            footer: "",
            getStarted: "New Conversation",
            inputPlaceholder: "Write your message...",
          },
        },
        enableStreaming: false,
      });
    });

  // --- Helper bubble (outside Shadow DOM) ---
  setTimeout(() => {
    const helper = document.createElement("div");
    helper.className = "chat-helper-bubble";
    helper.innerText = "Hi! How can I help you? 😊";
    document.body.appendChild(helper);

    setTimeout(() => {
      helper.classList.add("fade-out");
      setTimeout(() => helper.remove(), 500);
    }, 5000);
  }, 2000);
})();
