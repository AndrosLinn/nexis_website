// Minimal interactivity: scroll reveal, smooth anchors, active link highlight, read-more
(function(){
  const onReady = (fn) => (document.readyState !== 'loading') ? fn() : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    // Scroll reveal
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('in-view'));
    }

    // Smooth scroll for same-page anchors (fallback if CSS smooth not supported)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = id && id !== '#' ? document.querySelector(id) : null;
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
        }
      });
    });

    // Active nav highlight based on current pathname
    try {
      const path = location.pathname.split('/').pop() || 'home.html';
      document.querySelectorAll('.navbar a.nav-link').forEach((link) => {
        const btn = link.querySelector('button');
        const href = link.getAttribute('href');
        if (!btn || !href) return;
        const isActive = href === path;
        btn.classList.toggle('active-btn', isActive);
      });
    } catch(_){}

    // Read-more toggles
    document.querySelectorAll('.read-more').forEach((rm) => {
      const p = rm.querySelector('p');
      const toggle = rm.querySelector('.read-more-toggle');
      if (!p || !toggle) return;
      const maxChars = parseInt(rm.getAttribute('data-truncate') || '420', 10);
      const fullText = p.textContent || '';
      if (fullText.length <= maxChars) {
        toggle.style.display = 'none';
        return;
      }
      const shortText = fullText.slice(0, maxChars).trim() + '… ';
      let expanded = false;
      const render = () => {
        p.textContent = expanded ? fullText : shortText;
        rm.setAttribute('data-expanded', String(expanded));
        toggle.textContent = expanded ? 'Show less' : 'Read more';
      };
      render();
      toggle.addEventListener('click', () => { expanded = !expanded; render(); });
    });
  });
})();
