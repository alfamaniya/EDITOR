(() => {
  const workspace = document.querySelector('.workspace');
  const splitter = document.querySelector('.splitter');
  const editorFrame = document.querySelector('iframe[src="sections/editor/index.html"]');
  const liveFrame = document.querySelector('iframe[src="sections/live/index.html"]');
  if (!workspace || !splitter) return;

  let dragging = false;
  let latestCode = null;

  const sendCodeToPreview = () => {
    if (!latestCode || !liveFrame?.contentWindow) return;
    liveFrame.contentWindow.postMessage({
      type: 'EDITOR_CODE_UPDATE',
      code: latestCode
    }, '*');
  };

  window.addEventListener('message', (event) => {
    if (event.source === liveFrame?.contentWindow && event.data?.type === 'LIVE_PREVIEW_READY') {
      sendCodeToPreview();
      return;
    }
    if (event.source !== editorFrame?.contentWindow) return;
    if (event.data?.type !== 'EDITOR_CODE_UPDATE') return;
    latestCode = event.data.code;
    sendCodeToPreview();
  });

  liveFrame?.addEventListener('load', sendCodeToPreview);

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

  splitter.addEventListener('pointermove', (event) => {
    if (dragging) resize(event.clientX);
  });

  const stopDragging = () => {
    dragging = false;
    document.body.classList.remove('is-resizing');
  };

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
