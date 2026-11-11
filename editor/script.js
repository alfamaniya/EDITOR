(() => {
  const editorTabs = document.querySelectorAll('.editor-tab');
  const editorArea = document.querySelector('.editor-area');

  if (!editorTabs.length || !editorArea) return;

  editorTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      editorTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });
      editorArea.setAttribute('aria-labelledby', tab.id);
    });
  });
})();
