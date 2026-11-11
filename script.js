(() => {
  const workspace = document.querySelector('.workspace');
  const splitter = document.querySelector('.splitter');
  if (!workspace || !splitter) return;

  let dragging = false;

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
