(() => {
  const tabs = Array.from(document.querySelectorAll('.editor-tab'));
  const hosts = Array.from(document.querySelectorAll('.code-editor'));
  if (!tabs.length || !hosts.length || !window.CodeMirror) return;
  const modes = { html: 'htmlmixed', css: 'css', js: 'javascript' };
  const samples = {
    html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>This is a sample page.</p>\n  <button>Click me</button>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}\n\nh1 {\n  color: royalblue;\n}',
    js: "const button = document.querySelector('button');\n\nbutton.addEventListener('click', () => {\n  alert('Hello!');\n});"
  };
  const editors = {};
  const STORAGE_KEY = 'editor-project-code-v1';
  let isResetting = false;
  function loadSavedCode() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return {};
      const restored = Object.fromEntries(
        Object.keys(samples).filter((language) => typeof saved[language] === 'string')
          .map((language) => [language, saved[language]])
      );
      if (typeof restored.html === 'string' && !/<html\b/i.test(restored.html)) {
        const oldSampleContent = '  <h1>Hello World</h1>\n  <p>This is a sample page.</p>\n  <button>Click me</button>';
        restored.html = samples.html.replace(oldSampleContent, restored.html);
      }
      return restored;
    } catch (error) {
      return {};
    }
  }
  function saveCode() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(getCode())); }
    catch (error) { /* Editing remains available if browser storage is unavailable. */ }
  }
  const savedCode = loadSavedCode();
  hosts.forEach((host) => {
    const language = host.dataset.language;
    editors[language] = CodeMirror(host, {
      value: Object.prototype.hasOwnProperty.call(savedCode, language) ? savedCode[language] : samples[language],
      mode: modes[language], theme: 'material-darker', lineNumbers: true, lineWrapping: false,
      indentUnit: 2, tabSize: 2, indentWithTabs: false, autofocus: language === 'html',
      matchBrackets: true, autoCloseBrackets: true, extraKeys: { 'Ctrl-Space': 'autocomplete' }
    });
    editors[language].on('change', () => {
      if (!isResetting) { saveCode(); sendCode(); }
    });
  });
  function getCode() {
    return { html: editors.html.getValue(), css: editors.css.getValue(), js: editors.js.getValue() };
  }
  function sendCode() {
    window.parent.postMessage({ type: 'EDITOR_CODE_UPDATE', code: getCode() }, window.location.origin);
  }
  function resetEditors() {
    isResetting = true;
    Object.keys(editors).forEach((language) => { editors[language].setValue(samples[language]); editors[language].clearHistory(); });
    isResetting = false;
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* Reset still completes. */ }
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
    if (activeEditor) { activeEditor.refresh(); activeEditor.focus(); }
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab)));
  window.codeEditors = editors;
  window.getSelectedCode = (language) => editors[language] ? editors[language].getSelection() : '';
  window.getCodeSelectionRange = (language) => {
    const editor = editors[language];
    return editor ? { from: editor.getCursor('from'), to: editor.getCursor('to') } : null;
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
