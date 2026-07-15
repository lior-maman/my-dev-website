(function () {
  const records = new Map();
  const elementRecords = new WeakMap();
  let nextId = 1;

  function toElements(elements) {
    if (typeof elements === 'string') return Array.from(document.querySelectorAll(elements));
    if (elements instanceof Element) return [elements];
    return Array.from(elements || []);
  }

  function parseOffset(value, elementHeight, viewportHeight) {
    if (typeof value !== 'string') return value;
    if (value.endsWith('%')) return (parseInt(value, 10) / 100) * elementHeight;
    if (value.endsWith('vh')) return (parseInt(value, 10) / 100) * viewportHeight;
    if (value.endsWith('px')) return parseInt(value, 10);
    return value;
  }

  function isActive(mode, scrollTop, midpoint, viewportBottom, elementTop, elementBottom) {
    switch (mode) {
      case 'top':
        return scrollTop >= elementTop && elementBottom >= scrollTop;
      case 'bottom':
        return viewportBottom >= elementTop && elementBottom >= viewportBottom;
      case 'middle':
        return midpoint >= elementTop && elementBottom >= midpoint;
      case 'top-only':
        return elementTop >= scrollTop && viewportBottom >= elementTop;
      case 'bottom-only':
        return viewportBottom >= elementBottom && elementBottom >= scrollTop;
      default:
        return viewportBottom >= elementTop && elementBottom >= scrollTop;
    }
  }

  function runRecord(record, scrollTop) {
    const viewportHeight = window.innerHeight;
    const midpoint = scrollTop + viewportHeight / 2;
    const viewportBottom = scrollTop + viewportHeight;
    const rect = record.element.getBoundingClientRect();
    const elementTop = rect.top + scrollTop;
    const elementHeight = rect.height;
    const activeTop = elementTop + parseOffset(record.options.top, elementHeight, viewportHeight);
    const activeBottom = elementTop + elementHeight - parseOffset(record.options.bottom, elementHeight, viewportHeight);
    const active = isActive(
      record.options.mode,
      scrollTop,
      midpoint,
      viewportBottom,
      activeTop,
      activeBottom,
    );

    if (active !== record.state) {
      record.state = active;
      const callback = active ? record.options.enter : record.options.leave;
      if (callback) callback.call(record.element);
    }

    if (record.options.scroll) {
      record.options.scroll.call(record.element, (midpoint - activeTop) / (activeBottom - activeTop));
    }
  }

  function update() {
    const scrollTop = window.scrollY;
    records.forEach((record) => {
      window.clearTimeout(record.timeoutId);
      record.timeoutId = window.setTimeout(
        () => runRecord(record, scrollTop),
        record.options.delay,
      );
    });
  }

  function observe(elements, userOptions) {
    const options = Object.assign(
      {
        top: 0,
        bottom: 0,
        delay: 0,
        mode: 'default',
        enter: null,
        leave: null,
        initialize: null,
        terminate: null,
        scroll: null,
      },
      userOptions,
    );

    return toElements(elements).filter((element) => {
      if (elementRecords.has(element)) return false;
      const record = {
        id: nextId,
        element,
        options,
        state: null,
        timeoutId: null,
      };
      nextId += 1;
      records.set(record.id, record);
      elementRecords.set(element, record);
      if (options.initialize) options.initialize.call(element);
      return true;
    });
  }

  function unobserve(elements) {
    toElements(elements).forEach((element) => {
      const record = elementRecords.get(element);
      if (!record) return;
      window.clearTimeout(record.timeoutId);
      records.delete(record.id);
      elementRecords.delete(element);
      if (record.options.terminate) record.options.terminate.call(element);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('load', update);
  window.Scrollex = { observe, unobserve, update };
})();
