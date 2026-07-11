<!-- CHATBOT -->
<div id="chatbotContainer" class="chatbot-container">
  <div class="chatbot-panel" id="chatbotPanel">
    <div class="chatbot-header">
      <h3>Ask About Omkar</h3>
      <button class="chatbot-close" id="chatbotClose" aria-label="Close chatbot">&times;</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages"></div>
    <div class="chatbot-input-wrapper">
      <input 
        type="text" 
        id="chatbotInput" 
        class="chatbot-input" 
        placeholder="Ask anything about Omkar 🤖" 
        autocomplete="off"
      />
      <button class="chatbot-send" id="chatbotSend" aria-label="Send message">→</button>
    </div>
  </div>
  <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chatbot">
    <span class="chatbot-icon">💬</span>
  </button>
</div>

<style>
/* ── CHATBOT STYLES ──────────────────────────────── */
.chatbot-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  font-family: 'Inter', system-ui, sans-serif;
}

.chatbot-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  transition: all 0.3s var(--ease);
}

.chatbot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(16, 185, 129, 0.4);
}

.chatbot-toggle.hidden {
  display: none;
}

.chatbot-panel {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 520px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  pointer-events: none;
  transition: all 0.3s var(--ease);
}

.chatbot-panel.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid var(--border);
}

.chatbot-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.chatbot-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s;
}

.chatbot-close:hover {
  color: var(--text);
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}

.chatbot-message {
  display: flex;
  gap: 0.6rem;
  animation: fadeUp 0.3s var(--ease);
}

.chatbot-message.user {
  justify-content: flex-end;
}

.chatbot-message-content {
  max-width: 78%;
  padding: 0.85rem 0.95rem;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.55;
  word-wrap: break-word;
  white-space: normal;
}

.chatbot-message.bot .chatbot-message-content {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text2);
  border: 1px solid var(--border);
}

.chatbot-message.user .chatbot-message-content {
  background: var(--accent);
  color: var(--btn-on-accent);
}

.chatbot-summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.chatbot-summary-title {
  font-weight: 700;
  color: var(--text);
}

.chatbot-summary-text {
  color: var(--text2);
}

.chatbot-summary-list {
  margin: 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: var(--text2);
}

.chatbot-summary-footer {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 0.2rem;
}

.chatbot-typing {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.7rem 0.9rem;
}

.chatbot-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted);
  animation: bounce 1s infinite ease-in-out;
}

.chatbot-typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.chatbot-typing span:nth-child(3) {
  animation-delay: 0.3s;
}

.chatbot-input-wrapper {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--border);
}

.chatbot-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.85rem;
  color: var(--text);
  outline: none;
  transition: all 0.2s;
}

.chatbot-input::placeholder {
  color: var(--muted);
}

.chatbot-input:focus {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
}

.chatbot-send {
  width: 40px;
  height: 40px;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  color: var(--btn-on-accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.chatbot-send:hover {
  transform: scale(1.05);
}

.chatbot-send:active {
  transform: scale(0.95);
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
  40% { transform: translateY(-4px); opacity: 1; }
}

@media (max-width: 480px) {
  .chatbot-container {
    bottom: 1rem;
    right: 1rem;
  }

  .chatbot-panel {
    width: 320px;
    height: 480px;
  }

  .chatbot-message-content {
    max-width: 85%;
  }
}
</style>

<script>
(function() {
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotMessages = document.getElementById('chatbotMessages');

  chatbotToggle.addEventListener('click', () => {
    chatbotPanel.classList.toggle('open');
    if (chatbotPanel.classList.contains('open')) {
      chatbotInput.focus();
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbotPanel.classList.remove('open');
  });

  const knowledgeBase = {
    greeting: {
      triggers: ['hello', 'hi', 'hey', 'start', 'help', 'about'],
      responses: [
        "Hi! 👋 I can help with Omkar’s background, projects, design philosophy, and how to get in touch.",
        "Hi there! I’m Omkar’s portfolio assistant. Ask me about his experience, work style, or current focus.",
        "Hello! I can give you a quick overview of Omkar’s experience, skills, and projects in a concise format."
      ]
    },
    experience: {
      triggers: ['experience', 'work', 'job', 'career', 'role', 'position', 'worked', 'working'],
      response: {
        title: 'Experience snapshot',
        summary: 'Omkar has built a career at the intersection of product design, UX strategy, and accessible digital experiences.',
        bullets: [
          'Senior UI Designer / Design Analyst at Zeus Learning (Jul 2025 – Present)',
          'Previously UI Designer / Design Analyst at Zeus Learning (Aug 2023 – Jun 2025)',
          'Earlier roles include UI Developer at MAI Labs and UX Designer Intern at Corbin Technology'
        ],
        footer: 'He combines design thinking with implementation awareness to create systems that are both useful and scalable.'
      }
    },
    education: {
      triggers: ['education', 'college', 'university', 'degree', 'studied', 'school', 'graduation', 'graduated'],
      response: {
        title: 'Education',
        summary: 'His academic foundation blends engineering rigor with design thinking.',
        bullets: [
          'B.E. in Electronics & Telecommunication from D Y Patil’s Ramrao Adik Institute of Technology, Mumbai University',
          'CGPA: 9.35/10',
          'Vice Chairman of IETE RAIT and active in hackathons, robotics, and workshops'
        ],
        footer: 'That background helps him approach product design with both analytical depth and user empathy.'
      }
    },
    projects: {
      triggers: ['projects', 'case study', 'portfolio', 'design', 'built', 'created'],
      response: {
        title: 'Featured work',
        summary: 'Omkar’s portfolio spans AI-assisted products, e-commerce trust flows, accessibility tools, and enterprise design systems.',
        bullets: [
          'Clio AI Investment Assistant for clearer, progressive financial data interaction',
          'Amazon Assure for trust-building in post-purchase experiences',
          'MAI Labs website with strong performance and a refined UI',
          'AccessIQ and fintech dashboard redesigns focused on usability and scale'
        ],
        footer: 'Each project reflects a strong mix of research, systems thinking, and polished execution.'
      }
    },
    compensation: {
      triggers: ['salary', 'compensation', 'pay', 'ctc', 'package', 'lpa', 'cost', 'rate', 'price'],
      response: {
        title: 'Compensation',
        summary: 'Current expectation is in the ₹16–20 LPA range.',
        bullets: [
          'Aligned with current market standards for his role and experience',
          'Open to discussing details during a direct conversation'
        ],
        footer: 'If you want the full context, a direct conversation is the best next step.'
      }
    },
    notice_period: {
      triggers: ['notice', 'availability', 'notice period', 'joining', 'when', 'start'],
      response: {
        title: 'Availability',
        summary: 'Omkar is currently available with a notice period of around 60 days.',
        bullets: [
          'This gives enough time to wrap up ongoing work properly',
          'He is generally ready to discuss next steps after that window'
        ],
        footer: 'A direct conversation is the fastest way to confirm timing.'
      }
    },
    accessibility: {
      triggers: ['accessibility', 'wcag', 'inclusive', 'a11y', 'accessible', 'inclusive design'],
      response: {
        title: 'Accessibility focus',
        summary: 'Accessibility is treated as a core design requirement, not a checkbox.',
        bullets: [
          'WCAG-compliant design practices',
          'Heuristic checks and usability evaluation built into the process',
          'Designs aimed at real users with different needs and contexts'
        ],
        footer: 'The goal is to make experiences usable for everyone, from the first draft onward.'
      }
    },
    team_work: {
      triggers: ['team', 'collaborate', 'mentoring', 'leadership', 'mentor', 'developers', 'engineers'],
      response: {
        title: 'Team impact',
        summary: 'Omkar works well across design, product, and engineering, especially in complex product environments.',
        bullets: [
          'Mentors junior designers and supports collaborative growth',
          'Acts as a design point of contact for large cross-functional teams',
          'Builds systems that are practical for both users and developers'
        ],
        footer: 'He is strong in both execution and shared decision-making.'
      }
    },
    creative: {
      triggers: ['creative', 'photography', 'podcast', 'youtube', 'vlog', 'video', 'content', 'codeos'],
      response: {
        title: 'Creative side',
        summary: 'His work extends beyond product design into storytelling, media, and community-driven content.',
        bullets: [
          'Photography with a strong eye for composition and place',
          'CodeOS podcast featuring industry insights and personal growth conversations',
          'Vlogs that explore culture, identity, and regional narratives'
        ],
        footer: 'That creative range adds depth to his visual and narrative thinking.'
      }
    },
    tools: {
      triggers: ['tools', 'skills', 'tech stack', 'software', 'figma', 'react', 'css', 'html', 'code'],
      response: {
        title: 'Skills & tools',
        summary: 'Omkar works comfortably across design, prototyping, and front-end implementation.',
        bullets: [
          'Design: Figma, systems thinking, prototyping',
          'Frontend: React, HTML, CSS, JavaScript, Next.js',
          'Research: usability testing, accessibility audits, competitive analysis'
        ],
        footer: 'That mix makes handoff smoother and design execution more realistic.'
      }
    },
    values: {
      triggers: ['values', 'believe', 'philosophy', 'approach', 'mindset', 'why'],
      response: {
        title: 'Design philosophy',
        summary: 'The core themes behind his work are clarity, empathy, and responsibility.',
        bullets: [
          'Accessibility first',
          'Research-led decisions over assumptions',
          'Simplicity through depth',
          'Systems thinking that scales well'
        ],
        footer: 'He tends to design for people, not just for screens.'
      }
    },
    size_scope: {
      triggers: ['scale', 'users', 'million', 'impact', 'size', 'scope'],
      response: {
        title: 'Scale of impact',
        summary: 'His work has touched large product ecosystems and high-traffic educational platforms.',
        bullets: [
          'Zeus Learning LMS used by 1M+ students',
          'Built solutions for large cross-functional teams',
          'Worked on multi-module products where design quality directly affects adoption'
        ],
        footer: 'He is comfortable operating at both strategic and execution levels.'
      }
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatText(text) {
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function buildSummaryMarkup(response) {
    const title = response.title ? `<div class="chatbot-summary-title">${escapeHtml(response.title)}</div>` : '';
    const summary = response.summary ? `<div class="chatbot-summary-text">${formatText(response.summary)}</div>` : '';
    const bullets = response.bullets && response.bullets.length ? `<ul class="chatbot-summary-list">${response.bullets.map(item => `<li>${formatText(item)}</li>`).join('')}</ul>` : '';
    const footer = response.footer ? `<div class="chatbot-summary-footer">${formatText(response.footer)}</div>` : '';

    return `<div class="chatbot-summary-card">${title}${summary}${bullets}${footer}</div>`;
  }

  function findBestResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    for (const content of Object.values(knowledgeBase)) {
      if (content.triggers.some(trigger => msg.includes(trigger))) {
        if (Array.isArray(content.responses)) {
          return content.responses[Math.floor(Math.random() * content.responses.length)];
        }
        return content.response;
      }
    }

    const defaultResponses = [
      "That’s a useful question. I don’t have an exact answer ready, but Omkar can help directly at oomkarsk6@gmail.com.",
      "I’d recommend reaching out directly to Omkar for that one—he can answer it faster than I can guess."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.innerHTML = '<div class="chatbot-message-content chatbot-typing"><span></span><span></span><span></span></div>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
  }

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'chatbot-message-content';

    if (text && typeof text === 'object' && !Array.isArray(text)) {
      contentDiv.innerHTML = buildSummaryMarkup(text);
    } else {
      contentDiv.innerHTML = formatText(String(text));
    }

    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    chatbotInput.value = '';

    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
      typingIndicator.remove();
      const response = findBestResponse(message);
      addMessage(response, false);
    }, 400);
  }

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  setTimeout(() => {
    if (!chatbotMessages.children.length) {
      addMessage({
        title: 'Welcome',
        summary: 'I can quickly answer questions about Omkar’s experience, projects, and contact details.',
        bullets: [
          'Experience and career background',
          'Portfolio highlights and design focus',
          'Availability and ways to contact him'
        ],
        footer: 'Try asking about his work, education, or skills.'
      }, false);
    }
  }, 500);
})();
</script>
