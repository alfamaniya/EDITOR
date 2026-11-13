(() => {
  'use strict';
  const STORAGE_KEY = 'html-editor-libs-v1';
  const PRESETS = [
            // ---------- ۳۰ کتابخانه اصلی ----------
            { name: 'Bootstrap 5 CSS', type: 'css', desc: 'Popular CSS framework', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' },
            { name: 'Animate.css', type: 'css', desc: 'Ready-made animations', cdn: 'https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css' },
            { name: 'Tailwind CSS', type: 'js', desc: 'Utility-first (Play CDN script)', cdn: 'https://cdn.tailwindcss.com/3.4.16' },
            { name: 'Font Awesome 6', type: 'css', desc: 'Vector icons', cdn: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css' },
            { name: 'Normalize.css', type: 'css', desc: 'CSS reset', cdn: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css' },
            { name: 'jQuery 3.7', type: 'js', desc: 'DOM library', cdn: 'https://code.jquery.com/jquery-3.7.1.min.js' },
            { name: 'Bootstrap 5 JS', type: 'js', desc: 'Interactive components', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js' },
            { name: 'Lodash', type: 'js', desc: 'Utility functions', cdn: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js' },
            { name: 'Axios', type: 'js', desc: 'HTTP requests', cdn: 'https://cdn.jsdelivr.net/npm/axios@1.7.7/dist/axios.min.js' },
            { name: 'React 18', type: 'js', desc: 'UI library', cdn: 'https://unpkg.com/react@18/umd/react.production.min.js' },
            { name: 'Vue 3', type: 'js', desc: 'UI framework', cdn: 'https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.global.prod.js' },
            { name: 'Chart.js', type: 'js', desc: 'Charts', cdn: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js' },
            { name: 'D3.js', type: 'js', desc: 'Visualization', cdn: 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js' },
            { name: 'Bulma', type: 'css', desc: 'Modern and lightweight', cdn: 'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css' },
            { name: 'UIkit', type: 'css', desc: 'Lightweight and modular', cdn: 'https://cdn.jsdelivr.net/npm/uikit@3.21.6/dist/css/uikit.min.css' },
            { name: 'Foundation', type: 'css', desc: 'Professional', cdn: 'https://cdn.jsdelivr.net/npm/foundation-sites@6.8.1/dist/css/foundation.min.css' },
            { name: 'Materialize CSS', type: 'css', desc: 'Material Design', cdn: 'https://cdn.jsdelivr.net/npm/materialize-css@1.0.0/dist/css/materialize.min.css' },
            { name: 'Pure CSS', type: 'css', desc: 'Minimal', cdn: 'https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css' },
            { name: 'Alpine.js', type: 'js', desc: 'Lightweight and simple', cdn: 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js' },
            { name: 'SweetAlert2', type: 'js', desc: 'Beautiful alerts', cdn: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.12.0/dist/sweetalert2.all.min.js' },
            { name: 'Swiper', type: 'js', desc: 'Touch slider', cdn: 'https://cdn.jsdelivr.net/npm/swiper@11.1.4/swiper-bundle.min.js' },
            { name: 'GSAP', type: 'js', desc: 'Professional animations', cdn: 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js' },
            { name: 'AOS', type: 'js', desc: 'Scroll animations', cdn: 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js' },
            { name: 'Toastify JS', type: 'js', desc: 'Simple notifications', cdn: 'https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js' },
            { name: 'Day.js', type: 'js', desc: 'Lightweight date handling', cdn: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js' },
            { name: 'Moment.js', type: 'js', desc: 'Date and time', cdn: 'https://cdn.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js' },
            { name: 'Clipboard.js', type: 'js', desc: 'Clipboard copying', cdn: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js' },
            { name: 'CountUp.js', type: 'js', desc: 'Animated counters', cdn: 'https://cdn.jsdelivr.net/npm/countup.js@2.8.0/dist/countUp.min.js' },
            { name: 'Typed.js', type: 'js', desc: 'Typing effects', cdn: 'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js' },
            { name: 'Lottie', type: 'js', desc: 'JSON animations', cdn: 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js' },
            // ---------- ۳۰ کتابخانه جدید (آفیس، محاسبات، کاربردی) ----------
            // --- آفیس و اسناد (۱۰) ---
            { name: 'SheetJS (xlsx)', type: 'js', desc: 'Read/write Excel and CSV', cdn: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js' },
            { name: 'ExcelJS', type: 'js', desc: 'Excel file handling', cdn: 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js' },
            { name: 'PDF.js', type: 'js', desc: 'PDF viewer', cdn: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.js' },
            { name: 'jsPDF', type: 'js', desc: 'Create PDFs in the browser', cdn: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js' },
            { name: 'pdfmake', type: 'js', desc: 'Create PDFs from JSON', cdn: 'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/pdfmake.min.js' },
            { name: 'docx', type: 'js', desc: 'Create Word documents', cdn: 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js' },
            { name: 'docx-preview', type: 'js', desc: 'Preview Word documents in the browser', cdn: 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.3/dist/docx-preview.min.js' },
            { name: 'mammoth', type: 'js', desc: 'Convert Word to HTML', cdn: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js' },
            { name: 'PDF-LIB', type: 'js', desc: 'Create and edit PDFs', cdn: 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js' },
            { name: 'docxtemplater', type: 'js', desc: 'Fill Word templates', cdn: 'https://cdn.jsdelivr.net/npm/docxtemplater@3.61.2/build/docxtemplater.js' },
            // --- محاسبات (۱۰) ---
            { name: 'math.js', type: 'js', desc: 'Advanced math calculations', cdn: 'https://cdn.jsdelivr.net/npm/mathjs@13.2.0/lib/browser/math.js' },
            { name: 'decimal.js', type: 'js', desc: 'Precise decimal calculations', cdn: 'https://cdn.jsdelivr.net/npm/decimal.js@10.4.3/decimal.min.js' },
            { name: 'expr-eval', type: 'js', desc: 'Evaluate mathematical expressions', cdn: 'https://cdn.jsdelivr.net/npm/expr-eval@2.0.2/dist/bundle.min.js' },
            { name: 'currency.js', type: 'js', desc: 'Precise currency calculations', cdn: 'https://cdn.jsdelivr.net/npm/currency.js@2.0.3/dist/currency.min.js' },
            { name: 'numeral.js', type: 'js', desc: 'Format numbers and currencies', cdn: 'https://cdn.jsdelivr.net/npm/numeral@2.0.6/numeral.min.js' },
            { name: 'convert', type: 'js', desc: 'Convert measurement units', cdn: 'https://cdn.jsdelivr.net/npm/convert@5.9.0/dist/index.js' },
            { name: 'date-fns', type: 'js', desc: 'Useful date functions', cdn: 'https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js' },
            { name: 'Luxon', type: 'js', desc: 'Dates with time zones', cdn: 'https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js' },
            { name: 'big.js', type: 'js', desc: 'Big-number arithmetic', cdn: 'https://cdn.jsdelivr.net/npm/big.js@6.2.2/big.min.js' },
            { name: 'Fraction.js', type: 'js', desc: 'Fraction calculations', cdn: 'https://cdn.jsdelivr.net/npm/fraction.js@4.3.7/fraction.min.js' },
            // --- کاربردی (۱۰) ---
            { name: 'PapaParse', type: 'js', desc: 'Fast CSV parsing', cdn: 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js' },
            { name: 'JSZip', type: 'js', desc: 'Create and read ZIP files', cdn: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js' },
            { name: 'SortableJS', type: 'js', desc: 'Drag and drop lists', cdn: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js' },
            { name: 'Tabulator', type: 'js', desc: 'Advanced data tables', cdn: 'https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min.js' },
            { name: 'QRCode.js', type: 'js', desc: 'Generate QR codes', cdn: 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js' },
            { name: 'JsBarcode', type: 'js', desc: 'Generate barcodes', cdn: 'https://cdn.jsdelivr.net/npm/jsbarcode@3.12.1/dist/JsBarcode.all.min.js' },
            { name: 'CryptoJS', type: 'js', desc: 'Encryption and hashing', cdn: 'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js' },
            { name: 'DOMPurify', type: 'js', desc: 'Sanitize HTML against XSS', cdn: 'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js' },
            { name: 'Tesseract.js', type: 'js', desc: 'Extract text from images (OCR)', cdn: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js' },
            { name: 'Marked', type: 'js', desc: 'Convert Markdown to HTML', cdn: 'https://cdn.jsdelivr.net/npm/marked@15.0.0/marked.min.js' },
            // ---------- Additional visual, UI, data and utility libraries ----------
            { name: 'Prism.js', type: 'js', desc: 'Syntax highlighting core', cdn: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js' },
            { name: 'Prism.css', type: 'css', desc: 'Syntax highlighting theme', cdn: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css' },
            { name: 'Highlight.js', type: 'js', desc: 'Code syntax highlighting', cdn: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/highlight.min.js' },
            { name: 'Highlight.js CSS', type: 'css', desc: 'Code highlight theme', cdn: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.10.0/build/styles/github-dark.min.css' },
            { name: 'Bootstrap Icons', type: 'css', desc: 'Bootstrap icon font', cdn: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css' },
            { name: 'Remix Icon', type: 'css', desc: 'Large icon collection', cdn: 'https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css' },
            { name: 'ECharts', type: 'js', desc: 'Interactive data charts', cdn: 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js' },
            { name: 'ApexCharts', type: 'js', desc: 'Interactive charts', cdn: 'https://cdn.jsdelivr.net/npm/apexcharts@3.54.1/dist/apexcharts.min.js' },
            { name: 'Leaflet CSS', type: 'css', desc: 'Interactive map styles', cdn: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css' },
            { name: 'Leaflet JS', type: 'js', desc: 'Interactive maps', cdn: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js' },
            { name: 'Flatpickr CSS', type: 'css', desc: 'Date picker styles', cdn: 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css' },
            { name: 'Flatpickr JS', type: 'js', desc: 'Date and time picker', cdn: 'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js' },
            { name: 'Choices.js CSS', type: 'css', desc: 'Enhanced select styles', cdn: 'https://cdn.jsdelivr.net/npm/choices.js@11.0.2/public/assets/styles/choices.min.css' },
            { name: 'Choices.js', type: 'js', desc: 'Enhanced select controls', cdn: 'https://cdn.jsdelivr.net/npm/choices.js@11.0.2/public/assets/scripts/choices.min.js' },
            { name: 'Fuse.js', type: 'js', desc: 'Fuzzy search for lists', cdn: 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js' },
            { name: 'FileSaver.js', type: 'js', desc: 'Save files from browser', cdn: 'https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js' },
            { name: 'html2canvas', type: 'js', desc: 'Capture DOM as image', cdn: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js' },
            { name: 'Cropper.js CSS', type: 'css', desc: 'Image cropper styles', cdn: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css' },
            { name: 'Cropper.js', type: 'js', desc: 'Crop images in browser', cdn: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.js' },
            { name: 'p5.js', type: 'js', desc: 'Creative coding and canvas', cdn: 'https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/p5.min.js' },
            { name: 'Anime.js', type: 'js', desc: 'JavaScript animations', cdn: 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js' },
            { name: 'FullCalendar', type: 'js', desc: 'Calendar and scheduling UI', cdn: 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js' },
            { name: 'Three.js', type: 'js', desc: '3D graphics with WebGL', cdn: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js' },
            { name: 'Pikaday CSS', type: 'css', desc: 'Lightweight date picker theme', cdn: 'https://cdn.jsdelivr.net/npm/pikaday@1.8.2/css/pikaday.css' },
            { name: 'Pikaday JS', type: 'js', desc: 'Lightweight date picker', cdn: 'https://cdn.jsdelivr.net/npm/pikaday@1.8.2/pikaday.js' }
        ];
  const el = {
    search: document.getElementById('librarySearch'), filter: document.getElementById('libraryTypeFilter'),
    grid: document.getElementById('catalogGrid'), count: document.getElementById('catalogCount'),
    name: document.getElementById('libraryName'), type: document.getElementById('libraryType'),
    code: document.getElementById('libraryCode'), status: document.getElementById('formStatus'),
    add: document.getElementById('addLibraryButton'), saved: document.getElementById('savedLibraries'),
    savedCount: document.getElementById('savedCount')
  };
  let libraries = loadLibraries(), activeRequest = null, requestNumber = 0;
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function makeId() { return 'lib_' + Date.now() + '_' + Math.random().toString(36).slice(2,8); }
  function loadLibraries() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(value)) return [];
      return value.filter(item => item && typeof item.name === 'string' && typeof item.code === 'string' && (item.type === 'css' || item.type === 'js'))
        .map(item => ({id:typeof item.id === 'string' ? item.id : makeId(),name:item.name.slice(0,100),type:item.type,code:item.code,enabled:item.enabled === true}));
    } catch (error) { return []; }
  }
  function saveLibraries() {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(libraries)); return true; }
    catch (error) { setStatus('Could not save. Check browser storage availability.',true); return false; }
  }
  function setStatus(message,isError=false) { el.status.textContent=message; el.status.style.color=isError?'#ff9ca7':''; }
  function renderCatalog() {
    const query=el.search.value.trim().toLowerCase(), type=el.filter.value;
    const filtered=PRESETS.map((preset,index)=>({preset,index})).filter(({preset})=>(!query||(preset.name+' '+preset.desc).toLowerCase().includes(query))&&(type==='all'||preset.type===type));
    el.count.textContent=filtered.length+' of '+PRESETS.length+' libraries';
    if(!filtered.length){el.grid.innerHTML='<div class="empty-state">No libraries match your search.</div>';return;}
    el.grid.innerHTML=filtered.map(({preset,index})=>'<button type="button" class="catalog-item" data-preset-index="'+index+'"><strong>'+escapeHTML(preset.name)+'</strong><small>'+escapeHTML(preset.desc)+'</small><span class="type-tag '+preset.type+'">'+preset.type.toUpperCase()+'</span></button>').join('');
  }
  function renderSaved() {
    const enabled=libraries.filter(item=>item.enabled).length;
    el.savedCount.textContent=libraries.length; el.savedCount.title=enabled+' enabled';
    if(!libraries.length){el.saved.innerHTML='<div class="empty-state">No libraries have been added yet.</div>';return;}
    el.saved.innerHTML=libraries.map(item=>'<div class="saved-item'+(item.enabled?'':' is-disabled')+'" data-library-id="'+escapeHTML(item.id)+'"><input type="checkbox" data-action="toggle" aria-label="Enable '+escapeHTML(item.name)+'"'+(item.enabled?' checked':'')+'><span class="saved-name">'+escapeHTML(item.name)+'</span><span class="type-tag '+item.type+'">'+item.type.toUpperCase()+'</span><button type="button" class="delete-button" data-action="delete">Delete</button></div>').join('');
  }
  async function selectPreset(index) {
    const preset=PRESETS[index]; if(!preset)return;
    if(activeRequest)activeRequest.abort();
    const controller=new AbortController(); activeRequest=controller; const id=++requestNumber;
    el.name.value=preset.name; el.type.value=preset.type; el.code.value=''; el.code.placeholder='Downloading from CDN...';
    setStatus('Loading '+preset.name+' from CDN...');
    const timeout=setTimeout(()=>controller.abort(),8000);
    try {
      const response=await fetch(preset.cdn,{signal:controller.signal}); if(!response.ok)throw new Error('HTTP '+response.status);
      const code=await response.text(); if(id!==requestNumber)return; if(!code||code.length<=10)throw new Error('Empty response');
      el.code.value=code; el.code.placeholder='Paste library code here...'; setStatus('Library code loaded. Review it and choose Add to Libraries.');
    } catch(error) {
      if(id!==requestNumber)return; el.code.placeholder='Automatic download failed. Paste the code manually.'; setStatus('CDN unavailable. Paste the library code manually.',true);
    } finally { clearTimeout(timeout); if(activeRequest===controller)activeRequest=null; }
    if(id===requestNumber)el.code.focus();
  }
  function addLibrary() {
    const name=el.name.value.trim(),code=el.code.value,type=el.type.value;
    if(!name){setStatus('Enter a library name.',true);el.name.focus();return;}
    if(!code.trim()){setStatus('Enter or load the library code.',true);el.code.focus();return;}
    libraries.unshift({id:makeId(),name:name.slice(0,100),type,code,enabled:true});
    if(!saveLibraries()){libraries.shift();return;}
    renderSaved();el.name.value='';el.code.value='';el.code.placeholder='Paste library code here...';setStatus('Library saved successfully.');
  }
  el.search.addEventListener('input',renderCatalog); el.filter.addEventListener('change',renderCatalog);
  el.grid.addEventListener('click',event=>{const button=event.target.closest('[data-preset-index]');if(button)selectPreset(Number(button.dataset.presetIndex));});
  el.add.addEventListener('click',addLibrary);
  el.name.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();el.code.focus();}});
  el.saved.addEventListener('change',event=>{
    const row=event.target.closest('[data-library-id]');if(!row||!event.target.matches('[data-action="toggle"]'))return;
    const library=libraries.find(item=>item.id===row.dataset.libraryId);if(!library)return;
    const previous=library.enabled;library.enabled=event.target.checked;if(!saveLibraries())library.enabled=previous;renderSaved();
  });
  el.saved.addEventListener('click',event=>{
    const button=event.target.closest('[data-action="delete"]');if(!button)return;
    const row=button.closest('[data-library-id]'),index=libraries.findIndex(item=>item.id===row.dataset.libraryId);if(index<0)return;
    const removed=libraries.splice(index,1)[0];if(!saveLibraries())libraries.splice(index,0,removed);renderSaved();
  });
  renderCatalog();renderSaved();
})();
