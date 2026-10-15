/**
 * Red Social - Facebook Clone
 * Interactive features: posts, comments, likes, chat, toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Like Button Interaction
  initLikeButtons();

  // 2. Comments System
  initCommentSystem();

  // 3. Create Post System
  initCreatePostSystem();

  // 4. Chat System
  initChatSystem();

  // 5. Tooltips & Toasts
  initBootstrapComponents();
});

function initBootstrapComponents() {
  // Initialize tooltips if Bootstrap Tooltip is available
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}

function initLikeButtons() {
  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.btn-like');
    if (!likeBtn) return;

    const card = likeBtn.closest('.fb-card');
    const countSpan = card.querySelector('.like-count');
    let count = parseInt(countSpan.getAttribute('data-count') || countSpan.textContent || '0', 10);
    const icon = likeBtn.querySelector('i');

    if (likeBtn.classList.contains('active-like')) {
      // Dislike
      likeBtn.classList.remove('active-like');
      if (icon) {
        icon.className = 'bi bi-heart me-2';
      }
      count = Math.max(0, count - 1);
    } else {
      // Like
      likeBtn.classList.add('active-like');
      if (icon) {
        icon.className = 'bi bi-heart-fill me-2 text-danger';
      }
      count += 1;
    }

    countSpan.setAttribute('data-count', count);
    countSpan.textContent = count;
  });
}

function initCommentSystem() {
  // Toggle comment section visibility
  document.addEventListener('click', (e) => {
    const commentBtn = e.target.closest('.btn-toggle-comment');
    if (!commentBtn) return;

    const card = commentBtn.closest('.fb-card');
    const commentSection = card.querySelector('.fb-comments-section');
    if (commentSection) {
      if (commentSection.classList.contains('d-none')) {
        commentSection.classList.remove('d-none');
        const input = commentSection.querySelector('.fb-comment-input');
        if (input) input.focus();
      } else {
        commentSection.classList.add('d-none');
      }
    }
  });

  // Handle Enter key inside comment input
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('fb-comment-input')) {
      e.preventDefault();
      const input = e.target;
      const text = input.value.trim();
      if (!text) return;

      const card = input.closest('.fb-card');
      const list = card.querySelector('.fb-comments-list');
      const commentCountEl = card.querySelector('.comment-count');

      // Create new comment element
      const commentHtml = `
        <div class="d-flex align-items-start gap-2 mb-2 animate__animated animate__fadeIn">
          <img src="img/persona1.jpg" alt="Carlos" class="fb-avatar fb-avatar-sm mt-1">
          <div class="fb-comment-bubble">
            <div class="fb-comment-author">Carlos Arturo</div>
            <p class="fb-comment-text">${escapeHtml(text)}</p>
          </div>
        </div>
      `;

      list.insertAdjacentHTML('beforeend', commentHtml);
      input.value = '';

      // Update count
      if (commentCountEl) {
        let current = parseInt(commentCountEl.getAttribute('data-count') || '7', 10);
        current += 1;
        commentCountEl.setAttribute('data-count', current);
        commentCountEl.textContent = `${current} comentarios`;
      }
    }
  });
}

function initCreatePostSystem() {
  const publishBtn = document.getElementById('btnPublishPost');
  const postTextInput = document.getElementById('postModalText');
  const postImageInput = document.getElementById('postModalImage');
  const feedContainer = document.getElementById('postsFeed');
  const postModalEl = document.getElementById('modalCreatePost');

  if (!publishBtn || !postTextInput || !feedContainer) return;

  publishBtn.addEventListener('click', () => {
    const text = postTextInput.value.trim();
    const imageChoice = postImageInput ? postImageInput.value : '';

    if (!text && !imageChoice) {
      alert('Por favor escribe algo o selecciona una imagen para publicar.');
      return;
    }

    let mediaHtml = '';
    if (imageChoice) {
      mediaHtml = `
        <div class="fb-post-media mt-2">
          <img src="img/${escapeHtml(imageChoice)}" alt="Publicación" class="img-fluid">
        </div>
      `;
    }

    const newPostId = 'post-' + Date.now();
    const postHtml = `
      <div class="fb-card" id="${newPostId}">
        <div class="fb-post-header">
          <div class="d-flex align-items-center gap-2">
            <img src="img/persona1.jpg" alt="Carlos Arturo" class="fb-avatar fb-avatar-md">
            <div>
              <a href="#" class="fb-post-author">Carlos Arturo</a>
              <div class="fb-post-time">
                <span>Hace un momento</span>
                <span>·</span>
                <i class="bi bi-globe"></i>
              </div>
            </div>
          </div>
          <button class="fb-icon-btn"><i class="bi bi-three-dots"></i></button>
        </div>

        <div class="fb-post-body">
          <p class="mb-0">${escapeHtml(text)}</p>
        </div>

        ${mediaHtml}

        <div class="fb-post-stats">
          <div class="fb-reactions-count">
            <span class="fb-reaction-icon fb-reaction-heart"><i class="bi bi-heart-fill"></i></span>
            <span class="like-count" data-count="1">1</span>
          </div>
          <div>
            <span class="comment-count" data-count="0">0 comentarios</span>
          </div>
        </div>

        <div class="d-flex justify-content-between px-2 py-1 border-top" style="border-color: var(--fb-border) !important;">
          <button class="fb-card-action-btn btn-like active-like">
            <i class="bi bi-heart-fill me-2 text-danger"></i> Me gusta
          </button>
          <button class="fb-card-action-btn btn-toggle-comment">
            <i class="bi bi-chat-left-text me-2"></i> Comentar
          </button>
          <button class="fb-card-action-btn btn-share" onclick="showShareToast()">
            <i class="bi bi-share me-2"></i> Compartir
          </button>
        </div>

        <div class="fb-comments-section">
          <div class="fb-comments-list"></div>
          <div class="d-flex align-items-center gap-2 mt-2">
            <img src="img/persona1.jpg" alt="Carlos" class="fb-avatar fb-avatar-sm">
            <div class="fb-comment-input-box">
              <input type="text" class="fb-comment-input" placeholder="Escribe un comentario...">
            </div>
          </div>
        </div>
      </div>
    `;

    feedContainer.insertAdjacentHTML('afterbegin', postHtml);

    // Reset and close modal
    postTextInput.value = '';
    if (postImageInput) postImageInput.value = '';

    const modalInstance = bootstrap.Modal.getInstance(postModalEl);
    if (modalInstance) {
      modalInstance.hide();
    }

    showToast('¡Tu publicación ha sido compartida con éxito!');
  });
}

function initChatSystem() {
  const chatPopup = document.getElementById('chatPopup');
  const chatUserName = document.getElementById('chatUserName');
  const chatUserAvatar = document.getElementById('chatUserAvatar');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const btnCloseChat = document.getElementById('btnCloseChat');
  const btnSendChat = document.getElementById('btnSendChat');

  if (!chatPopup) return;

  // Open chat on contact click
  document.querySelectorAll('.fb-contact-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const name = item.getAttribute('data-name');
      const avatar = item.getAttribute('data-avatar');

      chatUserName.textContent = name;
      chatUserAvatar.src = avatar;

      // Populate default greeting
      chatMessages.innerHTML = `
        <div class="fb-chat-msg fb-chat-msg-received">
          ¡Hola Carlos! ¿Cómo estás hoy?
        </div>
      `;

      chatPopup.classList.add('active');
      if (chatInput) chatInput.focus();
    });
  });

  // Close chat
  if (btnCloseChat) {
    btnCloseChat.addEventListener('click', () => {
      chatPopup.classList.remove('active');
    });
  }

  // Send message function
  function sendMessage() {
    if (!chatInput) return;
    const msg = chatInput.value.trim();
    if (!msg) return;

    chatMessages.insertAdjacentHTML('beforeend', `
      <div class="fb-chat-msg fb-chat-msg-sent">
        ${escapeHtml(msg)}
      </div>
    `);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate friend response after 1s
    setTimeout(() => {
      const responses = [
        "¡Excelente! Qué bueno saber de ti.",
        "Totalmente de acuerdo, nos vemos más tarde.",
        "¡Jajaja genial! Me encantó tu foto.",
        "¡Dale! Te aviso en un rato.",
        "¡Perfecto! Un saludo."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

      chatMessages.insertAdjacentHTML('beforeend', `
        <div class="fb-chat-msg fb-chat-msg-received">
          ${reply}
        </div>
      `);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 900);
  }

  if (btnSendChat) {
    btnSendChat.addEventListener('click', sendMessage);
  }
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

// Helpers
function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return String(string).replace(/[&<>"'/]/g, (s) => entityMap[s]);
}

window.showShareToast = function() {
  showToast('Enlace de la publicación copiado al portapapeles.');
};

window.showToast = function(message) {
  const toastContainer = document.getElementById('toastNotification');
  const toastBody = document.getElementById('toastMessageText');
  if (toastContainer && toastBody) {
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastContainer);
    toast.show();
  } else {
    alert(message);
  }
};
