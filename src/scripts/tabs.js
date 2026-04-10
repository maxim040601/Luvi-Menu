function init() {
  const navWrap = document.getElementById('nav-wrap');
  const buttons = document.querySelectorAll('.nav-chip[data-tab]');
  const sections = document.querySelectorAll('.section');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const searchAll = document.getElementById('search-all');

  const initialChip = document.querySelector('.nav-chip.active');
  let lastActiveTab = initialChip ? initialChip.dataset.tab : 'shisha';
  let showingAll = false;

  function deactivateAllTabs() {
    buttons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
  }

  function activateSingleTab(tab) {
    showingAll = false;
    if (searchAll) searchAll.classList.remove('active');
    deactivateAllTabs();

    const btn = document.querySelector(`.nav-chip[data-tab="${tab}"]`);
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    sections.forEach((s) => s.classList.remove('active'));
    const target = document.getElementById('sec-' + tab);
    if (target) target.classList.add('active');
    return target;
  }

  function showAll() {
    showingAll = true;
    deactivateAllTabs();
    if (searchAll) searchAll.classList.add('active');
    sections.forEach((s) => s.classList.add('active'));
  }

  function clearSearch() {
    searchInput.value = '';
    searchClear.classList.add('hidden');
    document.querySelectorAll('.search-hidden').forEach((el) => el.classList.remove('search-hidden'));
    document.querySelectorAll('.search-no-results').forEach((el) => el.classList.remove('search-no-results'));
  }

  function performSearch(query) {
    const q = query.toLowerCase().trim();

    if (!q) {
      clearSearch();
      if (showingAll) {
        showAll();
      } else {
        activateSingleTab(lastActiveTab);
      }
      return;
    }

    searchClear.classList.remove('hidden');
    showingAll = false;
    if (searchAll) searchAll.classList.remove('active');

    // Show all sections for searching
    sections.forEach((s) => {
      s.classList.add('active');
      s.classList.remove('search-no-results');
    });
    deactivateAllTabs();

    // Filter items
    sections.forEach((section) => {
      const items = section.querySelectorAll('.item');
      const brandLabels = section.querySelectorAll('.brand-label');
      const subCats = section.querySelectorAll('.sub-cat');
      let hasVisible = false;

      brandLabels.forEach((l) => l.classList.remove('search-hidden'));
      subCats.forEach((l) => l.classList.remove('search-hidden'));

      items.forEach((item) => {
        const name = item.querySelector('.item-name');
        const desc = item.querySelector('.item-desc');
        const text = (name ? name.textContent : '') + ' ' + (desc ? desc.textContent : '');

        if (text.toLowerCase().includes(q)) {
          item.classList.remove('search-hidden');
          hasVisible = true;
        } else {
          item.classList.add('search-hidden');
        }
      });

      // Hide brand labels with no visible items
      brandLabels.forEach((label) => {
        let next = label.nextElementSibling;
        let hasVisibleItem = false;
        while (next && !next.classList.contains('brand-label') && !next.classList.contains('extras-card')) {
          if (next.classList.contains('item') && !next.classList.contains('search-hidden')) {
            hasVisibleItem = true;
          }
          next = next.nextElementSibling;
        }
        if (!hasVisibleItem) label.classList.add('search-hidden');
      });

      // Hide sub-categories with no visible items
      subCats.forEach((cat) => {
        let next = cat.nextElementSibling;
        let hasVisibleItem = false;
        while (next && !next.classList.contains('sub-cat') && !next.classList.contains('premium-card')) {
          if (next.classList.contains('item') && !next.classList.contains('search-hidden')) {
            hasVisibleItem = true;
          }
          next = next.nextElementSibling;
        }
        if (!hasVisibleItem) cat.classList.add('search-hidden');
      });

      // Hide extras-card / premium-card if all their items are hidden
      section.querySelectorAll('.extras-card, .premium-card').forEach((card) => {
        const cardItems = card.querySelectorAll('.item');
        const hasVisibleCard = Array.from(cardItems).some((it) => !it.classList.contains('search-hidden'));
        card.classList.toggle('search-hidden', !hasVisibleCard);
      });

      if (!hasVisible) {
        section.classList.add('search-no-results');
      }
    });
  }

  // Tab click handler
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      clearSearch();
      lastActiveTab = tab;
      const target = activateSingleTab(tab);

      if (target && navWrap) {
        const navHeight = navWrap.offsetHeight;
        window.scrollTo({
          top: target.offsetTop - navHeight,
          behavior: 'smooth',
        });
      }
    });
  });

  // "All" pill toggle
  if (searchAll) {
    searchAll.addEventListener('click', () => {
      clearSearch();
      if (showingAll) {
        activateSingleTab(lastActiveTab);
        showingAll = false;
      } else {
        showAll();
        if (navWrap) {
          window.scrollTo({ top: navWrap.offsetTop, behavior: 'smooth' });
        }
      }
    });
  }

  // Search handlers
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      performSearch(searchInput.value);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      clearSearch();
      activateSingleTab(lastActiveTab);
      searchInput.focus();
    });
  }

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
