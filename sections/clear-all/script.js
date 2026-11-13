(() => {
  const button = document.querySelector('.clear-all-button');
  if (!button) return;
  button.addEventListener('click', () => {
    window.parent.postMessage({ type: 'CLEAR_ALL_EDITOR_REQUEST' }, '*');
  });
})();
