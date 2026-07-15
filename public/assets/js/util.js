(function () {
  const prioritizedElements = new WeakMap();

  function toElements(elements) {
    if (typeof elements === 'string') return Array.from(document.querySelectorAll(elements));
    if (elements instanceof Element) return [elements];
    return Array.from(elements || []);
  }

  function navList(nav) {
    const element = nav instanceof Element ? nav : document.querySelector(nav);
    if (!element) return '';
    return Array.from(element.querySelectorAll('a'))
      .map((link) => {
        let indent = -1;
        let parent = link.parentElement;
        while (parent) {
          if (parent.tagName === 'LI') indent += 1;
          parent = parent.parentElement;
        }
        const target = link.getAttribute('target');
        const href = link.getAttribute('href');
        const targetAttribute = target ? ` target="${target}"` : '';
        const hrefAttribute = href ? ` href="${href}"` : '';
        return `<a class="link depth-${indent}"${targetAttribute}${hrefAttribute}><span class="indent-${indent}"></span>${link.textContent}</a>`;
      })
      .join('');
  }

  function panel(elements, userConfig) {
    const defaults = {
      delay: 0,
      hideOnClick: false,
      hideOnEscape: false,
      hideOnSwipe: false,
      resetScroll: false,
      resetForms: false,
      side: null,
      target: null,
      visibleClass: 'visible',
    };

    return toElements(elements).map((panelElement) => {
      const config = Object.assign({}, defaults, userConfig, {
        target: (userConfig && userConfig.target instanceof Element && userConfig.target) || panelElement,
      });
      const id = panelElement.id;
      let touchStart = null;

      function hide(event) {
        if (!config.target.classList.contains(config.visibleClass)) return;
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        config.target.classList.remove(config.visibleClass);
        window.setTimeout(() => {
          if (config.resetScroll) panelElement.scrollTop = 0;
          if (config.resetForms) panelElement.querySelectorAll('form').forEach((form) => form.reset());
        }, config.delay);
      }

      panelElement.style.msOverflowStyle = '-ms-autohiding-scrollbar';
      panelElement.style.webkitOverflowScrolling = 'touch';

      if (config.hideOnClick) {
        panelElement.querySelectorAll('a').forEach((link) => {
          link.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
          link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === `#${id}`) return;
            event.preventDefault();
            event.stopPropagation();
            hide();
            window.setTimeout(() => {
              if (link.target === '_blank') window.open(href);
              else window.location.href = href;
            }, config.delay + 10);
          });
        });
      }

      panelElement.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStart = touch ? { x: touch.pageX, y: touch.pageY } : null;
      });
      panelElement.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (!touchStart || !touch) return;
        const diffX = touchStart.x - touch.pageX;
        const diffY = touchStart.y - touch.pageY;
        const atTop = panelElement.scrollTop <= 0;
        const atBottom = panelElement.scrollHeight - panelElement.scrollTop - panelElement.clientHeight < 2;
        const horizontal = Math.abs(diffY) < 20;
        const vertical = Math.abs(diffX) < 20;
        const swipe =
          (config.side === 'left' && horizontal && diffX > 50) ||
          (config.side === 'right' && horizontal && diffX < -50) ||
          (config.side === 'top' && vertical && diffY > 50) ||
          (config.side === 'bottom' && vertical && diffY < -50);
        if (config.hideOnSwipe && swipe) {
          touchStart = null;
          hide();
          return;
        }
        if ((atTop && diffY < 0) || (atBottom && diffY > 0)) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, { passive: false });
      ['click', 'touchend', 'touchstart', 'touchmove'].forEach((eventName) => {
        panelElement.addEventListener(eventName, (event) => event.stopPropagation());
      });
      panelElement.addEventListener('click', (event) => {
        const link = event.target.closest(`a[href="#${id}"]`);
        if (!link || !panelElement.contains(link)) return;
        event.preventDefault();
        event.stopPropagation();
        config.target.classList.remove(config.visibleClass);
      });
      document.body.addEventListener('click', hide);
      document.body.addEventListener('touchend', hide);
      document.body.addEventListener('click', (event) => {
        const link = event.target.closest(`a[href="#${id}"]`);
        if (!link) return;
        event.preventDefault();
        event.stopPropagation();
        config.target.classList.toggle(config.visibleClass);
      });
      if (config.hideOnEscape) {
        window.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') hide(event);
        });
      }
      return { element: panelElement, hide };
    });
  }

  function placeholder(elements) {
    if ('placeholder' in document.createElement('input')) return toElements(elements);
    return toElements(elements).map((form) => {
      form.querySelectorAll('input[type="text"], textarea').forEach((input) => {
        const placeholderText = input.getAttribute('placeholder') || '';
        if (!input.value || input.value === placeholderText) {
          input.classList.add('polyfill-placeholder');
          input.value = placeholderText;
        }
        input.addEventListener('blur', () => {
          if (!input.value) {
            input.classList.add('polyfill-placeholder');
            input.value = placeholderText;
          }
        });
        input.addEventListener('focus', () => {
          if (input.value === placeholderText) {
            input.classList.remove('polyfill-placeholder');
            input.value = '';
          }
        });
      });
      form.addEventListener('submit', () => {
        form.querySelectorAll('input[type="text"], textarea').forEach((input) => {
          if (input.value === input.getAttribute('placeholder')) input.value = '';
        });
      });
      return form;
    });
  }

  function prioritize(elements, condition) {
    toElements(elements).forEach((element) => {
      const parent = element.parentElement;
      if (!parent) return;
      const previousSibling = prioritizedElements.get(element);
      if (!previousSibling) {
        if (!condition || !element.previousElementSibling) return;
        prioritizedElements.set(element, element.previousElementSibling);
        parent.prepend(element);
      } else if (!condition) {
        previousSibling.insertAdjacentElement('afterend', element);
        prioritizedElements.delete(element);
      }
    });
  }

  window.SiteUtils = { navList, panel, placeholder, prioritize };
})();
