(() => {
  const nav = document.querySelector('.memorial-nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('#navbarMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navbarMenu');
      const instance = bootstrap.Collapse.getInstance(menu);
      if (instance) instance.hide();
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const galleryModal = document.getElementById('galleryModal');
  const galleryModalBody = document.getElementById('galleryModalBody');
  galleryModal?.addEventListener('show.bs.modal', event => {
    const trigger = event.relatedTarget;
    const image = trigger?.dataset.image;
    const placeholder = trigger?.dataset.placeholder;
    if (image) {
      galleryModalBody.innerHTML = `<img src="${image}" alt="Gallery preview">`;
    } else {
      galleryModalBody.innerHTML = `<div class="modal-placeholder">${placeholder || 'Photo placeholder'}</div>`;
    }
  });

  const form = document.getElementById('memoryForm');
  const list = document.getElementById('memoryList');
  const status = document.getElementById('formStatus');
  const STORAGE_KEY = 'tengMemorialMessages';

  const escapeHtml = (value='') => value.replace(/[&<>'"]/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;'
  }[char]));

  const getMemories = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  };

  const renderMemories = () => {
    const memories = getMemories();
    if (!memories.length) {
      list.innerHTML = '<p class="empty-memory">No messages posted in this browser yet.</p>';
      return;
    }
    list.innerHTML = memories.slice().reverse().map(item => `
      <article class="memory-entry">
        <p class="memory-entry-name">${escapeHtml(item.name)}</p>
        <div class="memory-entry-meta">${escapeHtml(item.relationship || 'Guest')} · ${escapeHtml(item.date)}</div>
        <p class="memory-entry-text">${escapeHtml(item.message)}</p>
      </article>
    `).join('');
  };

  renderMemories();

  const copyAccountBtn = document.getElementById('copyAccountBtn');
  const donationAccount = document.getElementById('donationAccount');
  const copyStatus = document.getElementById('copyStatus');

  copyAccountBtn?.addEventListener('click', async () => {
    const value = donationAccount?.textContent.replace(/\s/g, '') || '';
    try {
      await navigator.clipboard.writeText(value);
      copyStatus.textContent = 'Account number copied.';
      copyAccountBtn.textContent = 'Copied';
      setTimeout(() => {
        copyStatus.textContent = '';
        copyAccountBtn.textContent = 'Copy';
      }, 2500);
    } catch {
      copyStatus.textContent = `Account number: ${donationAccount?.textContent || ''}`;
    }
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const memory = {
      name: document.getElementById('name').value.trim(),
      relationship: document.getElementById('relationship').value.trim(),
      message: document.getElementById('message').value.trim(),
      date: new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date())
    };

    const memories = getMemories();
    memories.push(memory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    form.reset();
    form.classList.remove('was-validated');
    renderMemories();
    status.textContent = 'Your message has been added on this device.';
    setTimeout(() => status.textContent = '', 4500);
  });
})();
