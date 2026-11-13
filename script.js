(() => {
  const workspace = document.querySelector('.workspace');
  const splitter = document.querySelector('.splitter');
  const editorFrame = document.querySelector('iframe[src="sections/editor/index.html"]');
  const liveFrame = document.querySelector('iframe[src="sections/live/index.html"]');
  const resetFrame = document.querySelector('iframe[src="sections/reset/index.html"]');
  const clearAllFrame = document.querySelector('iframe[src="sections/clear-all/index.html"]');
  const downloadFrame = document.querySelector('.download-frame');
  const downloadButton = document.querySelector('[aria-label="Download"]');
  if (!workspace || !splitter) return;

  let dragging = false;
  let latestCode = null;

  const requestCodeFromEditor = () => editorFrame?.contentWindow?.postMessage({ type: 'REQUEST_EDITOR_CODE' }, '*');
  const sendCodeToPreview = () => {
    if (latestCode && liveFrame?.contentWindow) liveFrame.contentWindow.postMessage({ type: 'EDITOR_CODE_UPDATE', code: latestCode }, '*');
  };
  const sendCodeToDownload = () => {
    if (latestCode && downloadFrame?.contentWindow) downloadFrame.contentWindow.postMessage({ type: 'DOWNLOAD_CODE_UPDATE', code: latestCode }, '*');
  };

  downloadButton?.addEventListener('click', () => {
    downloadFrame?.classList.add('is-open');
    downloadFrame?.contentWindow?.postMessage({ type: 'OPEN_DOWNLOAD_DIALOG' }, '*');
    requestCodeFromEditor();
  });

  window.addEventListener('message', (event) => {
    if (event.source === clearAllFrame?.contentWindow && event.data?.type === 'CLEAR_ALL_EDITOR_REQUEST') {
      editorFrame?.contentWindow?.postMessage({ type: 'CLEAR_ALL_EDITOR' }, '*');
      return;
    }
    if (event.source === resetFrame?.contentWindow && event.data?.type === 'RESET_EDITOR_REQUEST') {
      editorFrame?.contentWindow?.postMessage({ type: 'RESET_EDITOR' }, '*');
      return;
    }
    if (event.source === downloadFrame?.contentWindow && event.data?.type === 'DOWNLOAD_DIALOG_CLOSED') {
      downloadFrame.classList.remove('is-open');
      return;
    }
    if (event.source === downloadFrame?.contentWindow && event.data?.type === 'DOWNLOAD_CODE_REQUEST') {
      requestCodeFromEditor();
      sendCodeToDownload();
      return;
    }
    if (event.source === liveFrame?.contentWindow && event.data?.type === 'LIVE_PREVIEW_READY') {
      requestCodeFromEditor();
      sendCodeToPreview();
      return;
    }
    if (event.source !== editorFrame?.contentWindow || event.data?.type !== 'EDITOR_CODE_UPDATE') return;
    latestCode = event.data.code;
    sendCodeToPreview();
    sendCodeToDownload();
  });

  editorFrame?.addEventListener('load', requestCodeFromEditor);
  liveFrame?.addEventListener('load', () => { requestCodeFromEditor(); sendCodeToPreview(); });
  downloadFrame?.addEventListener('load', sendCodeToDownload);

  const resize = (clientX) => {
    const bounds = workspace.getBoundingClientRect();
    const position = ((clientX - bounds.left) / bounds.width) * 100;
    const value = Math.min(75, Math.max(25, position));
    workspace.style.setProperty('--split', value + '%');
    splitter.setAttribute('aria-valuenow', String(Math.round(value)));
  };
  splitter.addEventListener('pointerdown', (event) => {
    dragging = true;
    splitter.setPointerCapture(event.pointerId);
    document.body.classList.add('is-resizing');
    resize(event.clientX);
  });
  splitter.addEventListener('pointermove', (event) => { if (dragging) resize(event.clientX); });
  const stopDragging = () => { dragging = false; document.body.classList.remove('is-resizing'); };
  splitter.addEventListener('pointerup', stopDragging);
  splitter.addEventListener('pointercancel', stopDragging);
  splitter.addEventListener('lostpointercapture', stopDragging);
  splitter.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = Number(splitter.getAttribute('aria-valuenow')) || 50;
    const next = Math.min(75, Math.max(25, current + (event.key === 'ArrowRight' ? 2 : -2)));
    workspace.style.setProperty('--split', next + '%');
    splitter.setAttribute('aria-valuenow', String(next));
  });
})();
