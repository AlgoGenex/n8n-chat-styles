# n8n-chat-styles

<link href="https://www.algogenex.com/n8n-chat-styles/style_dark.css" rel="stylesheet" />
<script type="module">
	import { createChat } from 'https://www.algogenex.com/n8n-chat-styles/script.js';

	createChat({
         webhookUrl: '',
         webhookConfig: {
            method: 'POST',
            headers: {}
         },
         target: '#n8n-chat',
         mode: 'window',
         chatInputKey: 'chatInput',
         chatSessionKey: 'sessionId',
         loadPreviousSession: true,
         metadata: {},
         showWelcomeScreen: false,
         defaultLanguage: 'en',
         initialMessages: [
            'Ciao! Come posso aiutarti?',
         ],
         i18n: {
            en: {
               title: 'Effeuno Car Detailing',
               subtitle: "Scrivici! Siamo qui per aiutarti 24/7",
               footer: '',
               getStarted: 'New Conversation',
               inputPlaceholder: 'Scrivi il tuo messaggio...',
            },
         },
         enableStreaming: false,
	});
</script>

<script>
  // Show helper bubble after 2 seconds, fade out and remove after 5 more seconds
  setTimeout(() => {
    const helper = document.createElement('div');
    helper.className = 'chat-helper-bubble';
    helper.innerText = 'How can I help you?';
    document.body.appendChild(helper);

    // Fade out after 5 seconds
    setTimeout(() => {
      helper.classList.add('fade-out');
      // Remove from DOM after fade-out duration (0.5s)
      setTimeout(() => helper.remove(), 500);
    }, 5000);

  }, 2000);
</script>

<style>
/* Helper bubble near bottom right above launcher */
.chat-helper-bubble {
  position: fixed;
  right: 20px;    
  bottom: 105px;   
  background: #88070A;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 16px;
  white-space: nowrap;
  z-index: 5000;
  animation: fadeInUp 0.6s ease;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Pointer triangle */
.chat-helper-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 16px;
  border-width: 6px;
  border-style: solid;
  border-color: #88070A transparent transparent transparent;
}

/* Fade-out class */
.chat-helper-bubble.fade-out {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
