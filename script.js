/* ============================================================
   RISHI — CYBERSECURITY PORTFOLIO
   JavaScript: Matrix Canvas, Typing, Scroll, Filters, Modals
   ============================================================ */

// ===== YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MATRIX CANVAS =====
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let drops = [];
  const chars = '01アイウエオカキクケコｱｲｳｴｵABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789><{}[]#$%';
  const fontSize = 14;
  let cols;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -canvas.height / fontSize);
  }

  function draw() {
    ctx.fillStyle = 'rgba(3,6,16,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f5ff';
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;
    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      // Vary brightness
      ctx.fillStyle = drops[i] * fontSize < canvas.height * 0.3
        ? 'rgba(0,245,255,0.9)'
        : 'rgba(0,200,212,0.35)';
      ctx.fillText(char, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 45);
})();

// ===== TYPING EFFECT =====
(function initTyping() {
  const phrases = [
    'Blue Team Security Analyst',
    'Threat Hunter',
    'Incident Responder',
    'Penetration Tester',
    'Vulnerability Assessor',
    'SIEM Engineer',
  ];
  const el = document.getElementById('typing-text');
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = deleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    let delay = deleting ? 55 : 90;
    if (!deleting && charIdx > current.length) { delay = 1800; deleting = true; }
    if (deleting && charIdx < 0)  { deleting = false; charIdx = 0; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 350; }
    setTimeout(type, delay);
  }
  type();
})();

// ===== NAVBAR: SCROLL + ACTIVE SECTION =====
(function initNav() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    // Scrolled style
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  // Close on link click
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
})();

// ===== SCROLL REVEAL (IntersectionObserver) =====
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Animate skill bars after reveal
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // Animate stat counters
        e.target.querySelectorAll('.stat-num[data-count]').forEach(animateCounter);
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ===== STAT COUNTER ANIMATION =====
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = +el.dataset.count;
  const duration = 1200;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ===== PROJECT FILTER =====
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

// ===== ADD PROJECT MODAL =====
(function initAddProject() {
  const btn     = document.getElementById('add-project-btn');
  const modal   = document.getElementById('add-modal');
  const closeBtn= document.getElementById('modal-close');
  const submit  = document.getElementById('modal-submit');
  const grid    = document.getElementById('projects-grid');

  const open  = () => modal.classList.add('open');
  const close = () => modal.classList.remove('open');

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  submit.addEventListener('click', () => {
    const title = document.getElementById('proj-title').value.trim();
    const cat   = document.getElementById('proj-cat').value;
    const desc  = document.getElementById('proj-desc').value.trim();
    const tags  = document.getElementById('proj-tags').value.trim();
    const link  = document.getElementById('proj-link').value.trim();

    if (!title || !desc) {
      alert('Please fill in at least the Title and Description fields.');
      return;
    }

    const tagsHTML = tags
      ? tags.split(',').map(t => `<span>${t.trim()}</span>`).join('')
      : '';
    const linkHTML = link
      ? `<a href="${link}" class="proj-link" target="_blank" rel="noopener">View →</a>`
      : '';

    const card = document.createElement('div');
    card.className = 'project-card reveal visible';
    card.dataset.category = cat;
    card.innerHTML = `
      <div class="project-header">
        <span class="project-badge ${cat === 'blue' ? 'blue-badge' : 'red-badge'}">${cat === 'blue' ? '🛡️ Blue Team' : '⚔️ Red Team'}</span>
        <span class="project-status">Completed</span>
      </div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="project-tags">${tagsHTML}</div>
      <div class="project-links">${linkHTML}</div>`;

    grid.appendChild(card);

    // Reset & close
    ['proj-title','proj-desc','proj-tags','proj-link'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('proj-cat').value = 'blue';
    close();

    // Re-apply current filter
    const active = document.querySelector('.filter-btn.active');
    if (active && active.dataset.filter !== 'all') {
      card.classList.toggle('hidden', card.dataset.category !== active.dataset.filter);
    }
  });
})();

// ===== ADD CERTIFICATION MODAL =====
(function initAddCert() {
  const btn     = document.getElementById('add-cert-btn');
  const modal   = document.getElementById('add-cert-modal');
  const closeBtn= document.getElementById('cert-modal-close');
  const submit  = document.getElementById('cert-modal-submit');
  const grid    = document.querySelector('.certs-grid');

  const open  = () => modal.classList.add('open');
  const close = () => modal.classList.remove('open');

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  submit.addEventListener('click', () => {
    const name     = document.getElementById('cert-name').value.trim();
    const provider = document.getElementById('cert-provider').value.trim();
    const level    = document.getElementById('cert-level-sel').value;

    if (!name) { alert('Please enter a certification name.'); return; }

    const levelLabel = { beginner: 'Foundational', mid: 'Intermediate', advanced: 'Advanced' }[level];

    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML = `
      <div class="cert-icon">🏅</div>
      <div class="cert-body">
        <h4>${name}</h4>
        <p>${provider || 'Unknown Provider'} · Added</p>
        <span class="cert-level ${level}">${levelLabel}</span>
      </div>`;

    // Insert before the "+" add button
    grid.insertBefore(card, btn);

    document.getElementById('cert-name').value = '';
    document.getElementById('cert-provider').value = '';
    document.getElementById('cert-level-sel').value = 'beginner';
    close();
  });
})();

// ===== CONTACT FORM (front-end only) =====
(function initForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.textContent = 'Sending… ⏳';
    submitBtn.disabled = true;
    setTimeout(() => {
      note.textContent = '✅ Message sent! (This is a front-end demo — hook up your backend or Formspree to make it functional.)';
      note.style.color = '#22c55e';
      form.reset();
      submitBtn.textContent = 'Send Message 🚀';
      submitBtn.disabled = false;
    }, 1400);
  });
})();

// ===== SMOOTH EXTERNAL LINKS (resume download placeholder) =====
document.getElementById('download-resume').addEventListener('click', e => {
  e.preventDefault();
  alert('Replace this with a link to your actual resume PDF!\n\nEdit the href of the Resume button in index.html to point to your CV.');
});
