(() => {
  const previewFrame = document.querySelector('.preview-frame');
  if (!previewFrame) return;

  const renderPreview = (code) => {
    if (!code || typeof code !== 'object') return;

    const html = typeof code.html === 'string' ? code.html : '';
    const css = typeof code.css === 'string' ? code.css : '';
    const js = typeof code.js === 'string' ? code.js : '';
    const hasDoctype = /^\\s*<!doctype\\s+html\\s*>/i.test(html);
    const hasHtml = /<html\\b[^>]*>/i.test(html);
    const hasHead = /<head\\b[^>]*>/i.test(html);
    const hasBody = /<body\\b[^>]*>/i.test(html);

    if (!hasDoctype || !hasHtml || !hasHead || !hasBody) {
      previewFrame.srcdoc = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invalid HTML Document</title></head><body><p style="font-family:Arial,sans-serif;padding:20px;color:#b91c1c">The HTML editor must contain <!DOCTYPE html>, <html>, <head>, and <body> tags.</p></body></html>';
      return;
    }

    const parsed = new DOMParser().parseFromString(html, 'text/html');
    if (css.trim()) {
      const style = parsed.createElement('style');
      style.textContent = css;
      parsed.head.appendChild(style);
    }
    if (js.trim()) {
      const script = parsed.createElement('script');
      script.textContent = js;
      parsed.body.appendChild(script);
    }

    previewFrame.srcdoc = '<!DOCTYPE html>\\n' + parsed.documentElement.outerHTML;
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== 'EDITOR_CODE_UPDATE') return;
    renderPreview(event.data.code);
  });

  window.parent.postMessage({ type: 'LIVE_PREVIEW_READY' }, '*');
})();
