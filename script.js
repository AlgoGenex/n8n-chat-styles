// script.js

import { createChat } from "https://www.algogenex.com/n8n-chat-styles/chat.bundle.es.js";

export function initChat(container) {
  // createChat should accept a container or mount point
  createChat({
    target: container // <-- IMPORTANT: mount into shadow DOM
  });
}
