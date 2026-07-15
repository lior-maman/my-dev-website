(function () {
  function toElements(elements) {
    if (typeof elements === 'string') return Array.from(document.querySelectorAll(elements));
    if (elements instanceof Element) return [elements];
    return Array.from(elements || []);
  }

  function getTarget(link) {
    const href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#' || href.length < 2) return null;
    return document.getElementById(href.slice(1));
  }

  function getDestination(target, options) {
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    let destination = targetTop;

    if (options.anchor === 'middle') {
      destination -= (window.innerHeight - target.getBoundingClientRect().height) / 2;
    }

    const offset = typeof options.offset === 'function' ? options.offset() : options.offset;
    return Math.max(destination - offset, 0);
  }

  function scrollWindow(destination, duration) {
    const start = window.scrollY;
    const distance = destination - start;
    const startTime = performance.now();

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      window.scrollTo(0, start + distance * easedProgress);
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  function init(elements, userOptions) {
    const options = Object.assign(
      {
        anchor: 'top',
        offset: 0,
        pollOnce: false,
        speed: 1000,
      },
      userOptions,
    );

    return toElements(elements).map((link) => {
      const cachedTarget = options.pollOnce ? getTarget(link) : null;
      const clickHandler = (event) => {
        const target = cachedTarget || getTarget(link);
        if (!target) return;
        event.preventDefault();
        scrollWindow(getDestination(target, options), options.speed);
      };

      link.addEventListener('click', clickHandler);
      return () => link.removeEventListener('click', clickHandler);
    });
  }

  window.Scrolly = { init };
})();
