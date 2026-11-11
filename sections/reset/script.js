(() => {
  const button = document.querySelector('.reset-button');
  if (!button) return;

  button.addEventListener('click', () => {
    window.parent.postMessage({ type: 'RESET_EDITOR_REQUEST' }, '*');
  });
})();
