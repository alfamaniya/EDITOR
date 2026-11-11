(() => {
  const tabs = Array.from(document.querySelectorAll('.editor-tab'));
  const inputs = Array.from(document.querySelectorAll('.code-input'));
  if (!tabs.length || !inputs.length) return;

  const getCode = () => ({
    html: document.getElementById('html-editor').value,
    css: document.getElementById('css-editor').value,
    js: document.getElementById('js-editor').value
  });

  const sendCode = () => {
    window.parent.postMessage({
      type: 'EDITOR_CODE_UPDATE',
      code: getCode()
    }, window.location.origin);
  };

  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });

    inputs.forEach((input) => {
      const active = input.dataset.language === tab.dataset.language;
      input.hidden = !active;
      input.classList.toggle('is-visible', active);
    });

    const activeInput = inputs.find((input) => input.dataset.language === tab.dataset.language);
    if (activeInput) activeInput.focus();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  inputs.forEach((input) => {
    input.addEventListener('input', sendCode);
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      event.preventDefault();
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.setRangeText('  ', start, end, 'end');
      sendCode();
    });
  });

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== 'LIVE_PREVIEW_READY') return;
    sendCode();
  });

  sendCode();
})();
