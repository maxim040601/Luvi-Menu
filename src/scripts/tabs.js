document.addEventListener('DOMContentLoaded', () => {
  const navWrap = document.getElementById('nav-wrap');
  const buttons = document.querySelectorAll('.nav-chip[data-tab]');
  const sections = document.querySelectorAll('.section');

  function activateTab(tab) {
    buttons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    const btn = document.querySelector(`.nav-chip[data-tab="${tab}"]`);
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    sections.forEach((s) => s.classList.remove('active'));
    const target = document.getElementById('sec-' + tab);
    if (target) {
      target.classList.add('active');
    }

    return target;
  }

  // Tab click handler
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const target = activateTab(tab);

      if (target && navWrap) {
        const navHeight = navWrap.offsetHeight;
        window.scrollTo({
          top: target.offsetTop - navHeight,
          behavior: 'smooth',
        });
      }
    });
  });

  // Sticky nav shadow on scroll
  if (navWrap) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        navWrap.classList.toggle('scrolled', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );

    const sentinel = document.querySelector('.header');
    if (sentinel) {
      observer.observe(sentinel);
    }
  }
});
