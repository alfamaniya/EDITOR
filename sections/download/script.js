(() => {
  const overlay = document.querySelector('.download-overlay');
  const closeButton = document.querySelector('.close-button');
  const cancelButton = document.querySelector('.cancel-button');
  const downloadButton = document.querySelector('.download-button');
  const chooseLocationButton = document.querySelector('.choose-location');
  const methodInputs = [...document.querySelectorAll('input[name="download-method"]')];
  const fileOptions = document.querySelector('.file-options');
  const singleFilename = document.querySelector('#single-filename');
  const individualNames = document.querySelector('.individual-names');
  const locationStatus = document.querySelector('.location-status');
  const errorMessage = document.querySelector('.error-message');
  let currentCode = null;
  let directoryHandle = null;

  const method = () => methodInputs.find((input) => input.checked)?.value || 'single';
  const selectedFiles = () => [...document.querySelectorAll('.file-choice input:checked')].map((input) => input.value);
  const showError = (message) => { errorMessage.textContent = message; errorMessage.hidden = false; };
  const clearError = () => { errorMessage.textContent = ''; errorMessage.hidden = true; };
  const openDialog = () => {
    overlay.hidden = false;
    directoryHandle = null;
    locationStatus.textContent = 'Not selected';
    clearError();
    window.parent.postMessage({ type: 'DOWNLOAD_CODE_REQUEST' }, '*');
    closeButton.focus();
  };
  const closeDialog = () => {
    overlay.hidden = true;
    directoryHandle = null;
    window.parent.postMessage({ type: 'DOWNLOAD_DIALOG_CLOSED' }, '*');
  };
  const updateMethod = () => {
    const individual = method() === 'individual';
    fileOptions.hidden = !individual;
    singleFilename.parentElement.querySelector('.field-label').hidden = individual;
    singleFilename.hidden = individual;
    individualNames.hidden = !individual;
  };
  methodInputs.forEach((input) => input.addEventListener('change', updateMethod));
  closeButton.addEventListener('click', closeDialog);
  cancelButton.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDialog(); });
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) closeDialog(); });

  const makeStandaloneHtml = (code) => {
    const html = code.html || '';
    if (!/^\s*<!doctype\s+html\s*>/i.test(html) || !/<html\b/i.test(html) || !/<head\b/i.test(html) || !/<body\b/i.test(html)) {
      throw new Error('The HTML editor must contain <!DOCTYPE html>, <html>, <head> and <body> tags.');
    }
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    if (code.css?.trim()) {
      const style = parsed.createElement('style');
      style.textContent = code.css;
      parsed.head.appendChild(style);
    }
    if (code.js?.trim()) {
      const script = parsed.createElement('script');
      script.textContent = code.js;
      parsed.body.appendChild(script);
    }
    return '<!DOCTYPE html>\n' + parsed.documentElement.outerHTML;
  };
  const normalizeFilename = (value, extension) => {
    let name = value.trim().replace(/[\\/:*?"<>|]/g, '-');
    if (!name) throw new Error('Enter a file name.');
    if (!name.toLowerCase().endsWith('.' + extension)) name += '.' + extension;
    return name;
  };
  const getFiles = () => {
    if (!currentCode) throw new Error('Project code is not ready yet. Please try again.');
    if (method() === 'single') return [{ name: normalizeFilename(singleFilename.value, 'html'), content: makeStandaloneHtml(currentCode) }];
    const chosen = selectedFiles();
    if (!chosen.length) throw new Error('Select at least one file.');
    const config = {
      html: ['html-filename', 'html', currentCode.html || ''],
      css: ['css-filename', 'css', currentCode.css || ''],
      js: ['js-filename', 'js', currentCode.js || '']
    };
    return chosen.map((key) => {
      const [inputId, extension, content] = config[key];
      return { name: normalizeFilename(document.getElementById(inputId).value, extension), content };
    });
  };
  chooseLocationButton.addEventListener('click', async () => {
    clearError();
    try {
      const pickerWindow = window.parent;
      if (!pickerWindow.showDirectoryPicker) throw new Error('Folder selection is not supported in this browser. You can still download using the browser save option.');
      directoryHandle = await pickerWindow.showDirectoryPicker({ mode: 'readwrite' });
      locationStatus.textContent = 'Folder selected';
    } catch (error) {
      if (error.name !== 'AbortError') showError(error.message);
    }
  });
  const saveWithDirectory = async (files) => {
    for (const file of files) {
      const handle = await directoryHandle.getFileHandle(file.name, { create: true });
      const writable = await handle.createWritable();
      await writable.write(file.content);
      await writable.close();
    }
  };
  const saveWithBrowser = async (files) => {
    const pickerWindow = window.parent;
    if (files.length === 1 && pickerWindow.showSaveFilePicker) {
      const file = files[0];
      const extension = file.name.split('.').pop();
      const mime = extension === 'html' ? 'text/html' : extension === 'css' ? 'text/css' : 'text/javascript';
      const handle = await pickerWindow.showSaveFilePicker({ suggestedName: file.name, types: [{ description: 'Project file', accept: { [mime]: ['.' + extension] } }] });
      const writable = await handle.createWritable();
      await writable.write(file.content);
      await writable.close();
      return;
    }
    files.forEach((file) => {
      const extension = file.name.split('.').pop();
      const mime = extension === 'html' ? 'text/html' : extension === 'css' ? 'text/css' : 'text/javascript';
      const blob = new Blob([file.content], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  };
  downloadButton.addEventListener('click', async () => {
    clearError();
    try {
      const files = getFiles();
      if (directoryHandle) await saveWithDirectory(files);
      else await saveWithBrowser(files);
      closeDialog();
    } catch (error) {
      if (error.name !== 'AbortError') showError(error.message);
    }
  });
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) return;
    if (event.data?.type === 'OPEN_DOWNLOAD_DIALOG') openDialog();
    if (event.data?.type === 'DOWNLOAD_CODE_UPDATE') currentCode = event.data.code;
  });
  updateMethod();
  window.parent.postMessage({ type: 'DOWNLOAD_COMPONENT_READY' }, '*');
})();