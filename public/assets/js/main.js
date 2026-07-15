(function () {
  const body = document.body;
  const sidebar = document.getElementById('sidebar');

  breakpoints({
    xlarge: ['1281px', '1680px'],
    large: ['981px', '1280px'],
    medium: ['737px', '980px'],
    small: ['481px', '736px'],
    xsmall: [null, '480px'],
  });

  if (browser.name === 'ie') body.classList.add('is-ie');

  window.addEventListener('load', () => {
    window.setTimeout(() => body.classList.remove('is-preload'), 100);
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('click', (event) => {
      const submit = event.target.closest('.submit');
      if (!submit || !form.contains(submit)) return;
      event.stopPropagation();
      event.preventDefault();
      form.submit();
    });
  });

  if (sidebar) {
    const sidebarLinks = Array.from(sidebar.querySelectorAll('a'));
    sidebarLinks.forEach((link) => {
      link.classList.add('scrolly');
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        sidebarLinks.forEach((sidebarLink) => sidebarLink.classList.remove('active'));
        link.classList.add('active', 'active-locked');
      });

      const href = link.getAttribute('href');
      const section = href && href.charAt(0) === '#' ? document.getElementById(href.slice(1)) : null;
      if (!section) return;
      Scrollex.observe(section, {
        mode: 'middle',
        top: '-20vh',
        bottom: '-20vh',
        initialize() {
          section.classList.add('inactive');
        },
        enter() {
          section.classList.remove('inactive');
          if (!sidebarLinks.some((sidebarLink) => sidebarLink.classList.contains('active-locked'))) {
            sidebarLinks.forEach((sidebarLink) => sidebarLink.classList.remove('active'));
            link.classList.add('active');
          } else if (link.classList.contains('active-locked')) {
            link.classList.remove('active-locked');
          }
        },
      });
    });
  }

  Scrolly.init(document.querySelectorAll('.scrolly'), {
    speed: 1000,
    offset() {
      if (breakpoints.active('<=large') && !breakpoints.active('<=small') && sidebar) {
        const styles = window.getComputedStyle(sidebar);
        return sidebar.getBoundingClientRect().height
          - parseFloat(styles.paddingTop)
          - parseFloat(styles.paddingBottom)
          - parseFloat(styles.borderTopWidth)
          - parseFloat(styles.borderBottomWidth);
      }
      return 0;
    },
  });

  const spotlights = Array.from(document.querySelectorAll('.spotlights > section'));
  Scrollex.observe(spotlights, {
    mode: 'middle',
    top: '-10vh',
    bottom: '-10vh',
    initialize() {
      this.classList.add('inactive');
    },
    enter() {
      this.classList.remove('inactive');
    },
  });
  spotlights.forEach((spotlight) => {
    const image = spotlight.querySelector('.image');
    const img = image && image.querySelector('img');
    if (!image || !img) return;
    image.style.backgroundImage = `url(${img.getAttribute('src')})`;
    if (img.dataset.position) image.style.backgroundPosition = img.dataset.position;
    img.style.display = 'none';
  });

  Scrollex.observe(document.querySelectorAll('.features'), {
    mode: 'middle',
    top: '-20vh',
    bottom: '-20vh',
    initialize() {
      this.classList.add('inactive');
    },
    enter() {
      this.classList.remove('inactive');
    },
  });
})();
