(() => {
  const root = document.documentElement;

  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  const filters = [...document.querySelectorAll('.filter')];
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((item) => {
        item.classList.toggle('is-active', item === filter);
        item.setAttribute('aria-pressed', String(item === filter));
      });
      document.querySelectorAll('.post-item').forEach((post) => {
        const categories = JSON.parse(post.dataset.categories || '[]');
        post.hidden = filter.dataset.filter !== 'all' && !categories.includes(filter.dataset.filter);
      });
    });
  });

  document.querySelector('.share')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(button.dataset.url);
      button.classList.add('is-copied');
      setTimeout(() => button.classList.remove('is-copied'), 1500);
    } catch (e) {}
  });

  const charts = document.querySelectorAll('.vt-chart');
  if (charts.length) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        chartObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    charts.forEach((chart) => chartObserver.observe(chart));
  }

  const prose = document.getElementById('prose');
  const toc = document.getElementById('toc');
  if (!prose || !toc) return;
  const headings = [...prose.querySelectorAll('h2, h3')];
  if (headings.length === 0) {
    toc.closest('.toc').remove();
    return;
  }
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
    const item = document.createElement('li');
    item.className = heading.tagName === 'H3' ? 'toc__sub' : '';
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.appendChild(link);
    toc.appendChild(item);
  });
  const links = new Map([...toc.querySelectorAll('a')].map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.remove('is-active'));
      links.get(entry.target.id)?.classList.add('is-active');
    });
  }, { rootMargin: '0px 0px -75% 0px' });
  headings.forEach((heading) => observer.observe(heading));
})();
