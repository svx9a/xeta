document.documentElement.classList.add('js-ready');

const initFlipbook = () => {
  document.title = 'XETA Pay Global Standard Guidebook';

  const pages = Array.from(document.querySelectorAll('.book .page'));
  const prevButton = document.querySelector('[data-flipbook-prev]');
  const nextButton = document.querySelector('[data-flipbook-next]');
  const counter = document.querySelector('[data-flipbook-count]');
  const currentLabel = document.querySelector('[data-flipbook-current]');

  if (!pages.length || !prevButton || !nextButton || !counter || !currentLabel) {
    return;
  }

  pages.forEach((page, index) => {
    page.dataset.pageIndex = String(index + 1);
  });

  let currentIndex = 0;
  const total = pages.length;

  const render = () => {
    pages.forEach((page, index) => {
      const active = index === currentIndex;
      page.classList.toggle('is-active', active);
      page.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    counter.textContent = `${currentIndex + 1} / ${total}`;
    currentLabel.textContent = pages[currentIndex]?.dataset.flipbookLabel || `Page ${currentIndex + 1}`;
    prevButton.toggleAttribute('disabled', currentIndex === 0);
    nextButton.toggleAttribute('disabled', currentIndex === total - 1);
  };

  const goTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, total - 1));
    render();
  };

  prevButton.addEventListener('click', () => goTo(currentIndex - 1));
  nextButton.addEventListener('click', () => goTo(currentIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (event.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  render();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFlipbook, { once: true });
} else {
  initFlipbook();
}
