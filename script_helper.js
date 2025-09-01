import { createChat } from 'https://www.algogenex.com/n8n-chat-styles/chat.bundle.es.js';

// Custom createChat wrapper
export function createChatWithHelper(options) {
  const chatInstance = createChat(options);

  // Wait for the shadow root to attach
  setTimeout(() => {
    const launcher = document.querySelector('n8n-chat').shadowRoot.querySelector('.n8n-chat__launcher');
    
    if (launcher) {
      const helper = document.createElement('div');
      helper.className = 'chat-helper-bubble';
      helper.innerText = 'How can I help you?';
      helper.style.position = 'absolute';
      helper.style.bottom = '60px';
      helper.style.right = '0';
      helper.style.background = '#0056d2';
      helper.style.color = '#fff';
      helper.style.padding = '8px 12px';
      helper.style.borderRadius = '16px';
      helper.style.fontFamily = 'Montserrat,sans-serif';
      helper.style.fontSize = '14px';
      helper.style.zIndex = '9999';
      helper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      launcher.parentNode.appendChild(helper);

      // Fade out after 5 seconds
      setTimeout(() => {
        helper.style.opacity = '0';
        helper.style.transform = 'translateY(10px)';
        setTimeout(() => helper.remove(), 500);
      }, 5000);
    }
  }, 500); // small delay to allow shadow root to attach

  return chatInstance;
}
