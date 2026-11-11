(() => {
  const workspace = document.querySelector('.workspace');
  const splitter = document.querySelector('.splitter');
  if (!workspace || !splitter) return;

  const mobileQuery = window.matchMedia('(max-width: 680px)');
  let dragging = false;

  const setSplit = (clientX, clientY) => {
    const bounds = workspace.getBoundingClientRect();
    const isMobile = mobileQuery.matches;
    const position = isMobile
      ? ((clientY - bounds.top) / bounds.height) * 100
      : ((clientX - bounds.left) / bounds.width) * 100;
    const value = Math.min(75, Math.max(25, position));
    workspace.style.setProperty('--split', value + '%');
    splitter.setAttribute('aria-valuenow', String(Math.round(value)));
  };

  splitter.addEventListener('pointerdown', (event) => {
    dragging = true;
    splitter.setPointerCapture(event.pointerId);
    document.body.classList.add('is-resizing');
    setSplit(event.clientX, event.clientY);
  });

  splitter.addEventListener('pointermove', (event) => {
    if (dragging) setSplit(event.clientX, event.clientY);
  });

  const stopDragging = () => {
    dragging = false;
    document.body.classList.remove('is-resizing');
  };
  splitter.addEventListener('pointerup', stopDragging);
  splitter.addEventListener('pointercancel', stopDragging);
  splitter.addEventListener('lostpointercapture', stopDragging);

  splitter.addEventListener('keydown', (event) => {
    const isMobile = mobileQuery.matches;
    const decrement = isMobile ? 'ArrowUp' : 'ArrowLeft';
    const increment = isMobile ? 'ArrowDown' : 'ArrowRight';
    if (event.key !== decrement && event.key !== increment) return;
    event.preventDefault();
    const current = Number(splitter.getAttribute('aria-valuenow')) || 50;
    const next = Math.min(75, Math.max(25, current + (event.key === increment ? 2 : -2)));
    workspace.style.setProperty('--split', next + '%');
    splitter.setAttribute('aria-valuenow', String(next));
  });

  mobileQuery.addEventListener?.('change', () => {
    workspace.style.setProperty('--split', '50%');
    splitter.setAttribute('aria-valuenow', '50');
  });
})();
