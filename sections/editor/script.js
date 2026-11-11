(() => {
  const tabs = Array.from(document.querySelectorAll('.editor-tab'));
  const hosts = Array.from(document.querySelectorAll('.code-editor'));
  if (!tabs.length || !hosts.length || !window.CodeMirror) return;

  const modes = { html: 'htmlmixed', css: 'css', js: 'javascript' };
  const samples = {
    html: '<h1>Hello World</h1>\n<p>This is a sample page.</p>\n<button>Click me</button>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}\n\nh1 {\n  color: royalblue;\n}',
    js: "const button = document.querySelector('button');\n\nbutton.addEventListener('click', () => {\n  alert('Hello!');\n});"
  };
  const editors = {};
  let isResetting = false;

  hosts.forEach((host) => {
    const language = host.dataset.language;
    editors[language] = CodeMirror(host, {
      value: samples[language],
      mode: modes[language],
      theme: 'material-darker',
      lineNumbers: true,
      lineWrapping: false,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      autofocus: language === 'html',
      matchBrackets: true,
      autoCloseBrackets: true,
      extraKeys: { 'Ctrl-Space': 'autocomplete' }
    });
    editors[language].on('change', () => {
      if (!isResetting) sendCode();
    });
  });

  function getCode() {
    return {
      html: editors.html.getValue(),
      css: editors.css.getValue(),
      js: editors.js.getValue()
    };
  }

  function sendCode() {
    window.parent.postMessage({
      type: 'EDITOR_CODE_UPDATE',
      code: getCode()
    }, window.location.origin);
  }

  function resetEditors() {
    isResetting = true;
    Object.keys(editors).forEach((language) => {
      editors[language].setValue(samples[language]);
      editors[language].clearHistory();
    });
    isResetting = false;
    sendCode();
    const activeTab = tabs.find((tab) => tab.classList.contains('is-active'));
    const activeEditor = activeTab && editors[activeTab.dataset.language];
    if (activeEditor) activeEditor.focus();
  }

  function activateTab(tab) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    hosts.forEach((host) => {
      host.hidden = host.dataset.language !== tab.dataset.language;
      host.classList.toggle('is-visible', !host.hidden);
    });
    const activeEditor = editors[tab.dataset.language];
    if (activeEditor) {
      activeEditor.refresh();
      activeEditor.focus();
    }
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab)));

  // Selection APIs preserve the editor's exact selected range for future tools.
  window.codeEditors = editors;
  window.getSelectedCode = (language) => {
    const editor = editors[language];
    return editor ? editor.getSelection() : '';
  };
  window.getCodeSelectionRange = (language) => {
    const editor = editors[language];
    if (!editor) return null;
    return { from: editor.getCursor('from'), to: editor.getCursor('to') };
  };
  window.replaceSelectedCode = (language, replacement) => {
    const editor = editors[language];
    if (!editor || typeof replacement !== 'string') return false;
    editor.replaceSelection(replacement, 'around');
    editor.focus();
    return true;
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) return;
    if (event.data?.type === 'LIVE_PREVIEW_READY') sendCode();
    if (event.data?.type === 'RESET_EDITOR') resetEditors();
  });

  sendCode();
})();
