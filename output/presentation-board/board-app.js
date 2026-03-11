document.documentElement.classList.add('js-ready');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.title = 'XETA Pay Dashboard Presentation Board';
  }, { once: true });
} else {
  document.title = 'XETA Pay Dashboard Presentation Board';
}
