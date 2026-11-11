(() => {
  const previewFrame = document.querySelector('.preview-frame');
  if (!previewFrame) return;

  const renderPreview = (code) => {
    if (!code || typeof code !== 'object') return;

    const html = typeof code.html === 'string' ? code.html : '';
    const css = typeof code.css === 'string' ? code.css : '';
    const js = typeof code.js === 'string' ? code.js : '';

    previewFrame.srcdoc = `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>${js}
<\/script>
</body>
</html>`;
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== 'EDITOR_CODE_UPDATE') return;
    renderPreview(event.data.code);
  });

  window.parent.postMessage({ type: 'LIVE_PREVIEW_READY' }, '*');
})();
