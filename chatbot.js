(() => {
  const panel = document.getElementById('chatbotPanel');
  const toggle = document.getElementById('chatbotToggle');
  const close = document.getElementById('chatbotClose');
  const input = document.getElementById('chatbotInput');
  const send = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const suggestions = document.getElementById('chatbotSuggestions');
  const clear = document.getElementById('chatbotClear');

  if (!panel || !toggle || !close || !input || !send || !messages) return;

  const starters = [
    'What does Omkar actually do?',
    'Tell me about his accessibility experience',
    'What is his most interesting project?',
    'Omkar ne LMS pe kya kaam kiya?',
    'ओंकार काय काम करतो?',
    'Ask me something unexpected'
  ];
  const unexpectedQuestions = [
    'Would Omkar survive without Figma?',
    'What would Omkar probably argue with a PM about?',
    'What is something Omkar learned the hard way?',
    'What would Omkar do if he was not a designer?'
  ];
  const conversation = [];
  let pending = false;
  let lastQuestion = '';

  function setOpen(isOpen) {
    panel.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close Ask Omkar' : 'Open Ask Omkar');
    toggle.setAttribute('title', isOpen ? 'Close Ask Omkar' : 'Open Ask Omkar');
    if (isOpen) {
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function scrollToLatest() {
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
  }

  function renderActions(container, actions) {
    if (!Array.isArray(actions) || !actions.length) return;
    const actionRow = document.createElement('div');
    actionRow.className = 'chatbot-actions';
    actions.forEach((action) => {
      if (!action || typeof action.label !== 'string' || typeof action.href !== 'string') return;
      const isInternal = action.href.startsWith('#');
      const isKnownExternal = /^https:\/\/(accessiq-codeos\.netlify\.app|mai-website-nldxkgar8-sakshi1520s-projects\.vercel\.app)\//.test(action.href);
      if (!isInternal && !isKnownExternal) return;
      const link = document.createElement('a');
      link.className = 'chatbot-action';
      link.href = action.href;
      link.textContent = action.label;
      if (!isInternal) {
        link.target = '_blank';
        link.rel = 'noopener';
      } else {
        link.addEventListener('click', () => {
          panel.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
      actionRow.appendChild(link);
    });
    if (actionRow.children.length) container.appendChild(actionRow);
  }

  function addMessage(text, role, options = {}) {
    const item = document.createElement('article');
    item.className = `chatbot-message ${role}`;
    item.setAttribute('aria-label', role === 'user' ? 'You' : 'Ask Omkar');

    const content = document.createElement('div');
    content.className = 'chatbot-message-content';
    content.textContent = text;
    item.appendChild(content);

    if (role === 'assistant' && options.actions) renderActions(item, options.actions);
    if (role === 'assistant' && options.copyable) {
      const copy = document.createElement('button');
      copy.className = 'chatbot-copy';
      copy.type = 'button';
      copy.textContent = 'Copy';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text);
          copy.textContent = 'Copied';
          setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
        } catch (error) {
          copy.textContent = 'Unavailable';
        }
      });
      item.appendChild(copy);
    }

    messages.appendChild(item);
    scrollToLatest();
    return item;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.id = 'chatbotTyping';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Ask Omkar is thinking');
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    scrollToLatest();
  }

  function hideTyping() {
    document.getElementById('chatbotTyping')?.remove();
  }

  function renderSuggestions() {
    if (!suggestions) return;
    suggestions.replaceChildren();
    starters.forEach((question) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chatbot-suggestion';
      button.textContent = question;
      button.addEventListener('click', () => sendMessage(question));
      suggestions.appendChild(button);
    });
  }

  function pageContext() {
    const activeSection = [...document.querySelectorAll('section[id]')]
      .map((section) => ({ section, distance: Math.abs(section.getBoundingClientRect().top - 120) }))
      .sort((a, b) => a.distance - b.distance)[0]?.section;
    return {
      path: window.location.hash || window.location.pathname,
      title: activeSection?.getAttribute('aria-label') || document.title
    };
  }

  function setBusy(isBusy) {
    pending = isBusy;
    send.disabled = isBusy;
    input.disabled = isBusy;
    send.setAttribute('aria-busy', String(isBusy));
  }

  async function sendMessage(value = input.value.trim()) {
    const question = value.trim();
    if (!question || pending || question.length > 1200) return;

    lastQuestion = question;
    input.value = '';
    suggestions?.replaceChildren();
    addMessage(question, 'user');
    setBusy(true);
    showTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, conversation, pageContext: pageContext() })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Request failed');
      conversation.push({ role: 'user', content: question });
      conversation.push({ role: 'assistant', content: payload.message });
      addMessage(payload.message, 'assistant', { actions: payload.actions, copyable: true });
    } catch (error) {
      const errorMessage = error.message && error.message !== 'Request failed'
        ? error.message
        : 'Oops. My brain temporarily disconnected from the internet. Try again in a moment.';
      addMessage(errorMessage, 'assistant', {
        copyable: false
      });
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'chatbot-retry';
      retry.textContent = 'Try again';
      retry.addEventListener('click', () => sendMessage(lastQuestion));
      messages.lastElementChild.appendChild(retry);
    } finally {
      hideTyping();
      setBusy(false);
      input.focus();
    }
  }

  function resetConversation() {
    conversation.length = 0;
    messages.replaceChildren();
    addMessage("Hey! I'm Omkar's AI sidekick. Ask me about his work, projects, skills, career journey, or something completely random. I promise to know more than his LinkedIn bio does.", 'assistant', { copyable: false });
    renderSuggestions();
  }

  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  close.addEventListener('click', () => setOpen(false));
  clear?.addEventListener('click', resetConversation);
  send.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
  });
  document.getElementById('chatbotUnexpected')?.addEventListener('click', () => {
    sendMessage(unexpectedQuestions[Math.floor(Math.random() * unexpectedQuestions.length)]);
  });

  resetConversation();
  setOpen(false);
})();
