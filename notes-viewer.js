/* notes-viewer.js
   Simple, stylish notes viewer
   - Map chapters -> pdf filenames in CHAPTERS
   - load ?file=... or use mapping when clicking sidebar
   - zoom, fullscreen, download, theme, search
*/

/* ------------- CONFIG: put your chapter->file map here ------------- */
/* Ensure the pdf files are placed in same folder or provide relative paths */
const CHAPTERS = [
  { title: "Chapter 1 — Motion", file: "pdfs/physics_motion.pdf" },
  { title: "Chapter 2 — Force", file: "pdfs/physics_force.pdf" },
  { title: "Chapter 3 — Work & Energy", file: "pdfs/physics_work.pdf" },
  { title: "Chapter 4 — Waves", file: "pdfs/physics_waves.pdf" },
  /* Add more: { title: "Chapter X", file: "path/to/file.pdf" } */
];

/* -------------------------------------------------------------------- */
const pdfEmbed = document.getElementById('pdfEmbed');
const loader = document.getElementById('loader');
const viewerWrap = document.getElementById('viewerWrap');
const chaptersList = document.getElementById('chaptersList');
const currentLabel = document.getElementById('currentChapterLabel');
const downloadBtn = document.getElementById('downloadBtn');

// Zoom state
let zoom = 1;
function applyZoom(){ pdfEmbed.style.transform = `scale(${zoom})`; }

// Build sidebar list
function buildChapters(){
  chaptersList.innerHTML = '';
  CHAPTERS.forEach((c, idx) => {
    const div = document.createElement('div');
    div.className = 'chap-item';
    div.setAttribute('data-idx', idx);
    div.innerHTML = `<div><strong>${c.title}</strong><div class="meta">${c.file}</div></div><div>▶</div>`;
    div.addEventListener('click', ()=>{
      loadPDFByIndex(idx);
      if(window.innerWidth < 900) toggleSidebar(false);
    });
    chaptersList.appendChild(div);
  });
}
buildChapters();

// Filtering chapters
document.getElementById('chapSearch').addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.chap-item').forEach(item=>{
    const txt = item.innerText.toLowerCase();
    item.style.display = txt.includes(q) ? '' : 'none';
  });
});

// Sidebar toggle (mobile)
const sidebar = document.getElementById('chaptersSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const closeSidebar = document.getElementById('closeSidebar');

function toggleSidebar(force){
  if(typeof force === 'boolean'){
    if(force) sidebar.classList.add('open'); else sidebar.classList.remove('open');
    return;
  }
  sidebar.classList.toggle('open');
}
sidebarToggle?.addEventListener('click', ()=> toggleSidebar());
closeSidebar?.addEventListener('click', ()=> toggleSidebar(false));

// Back button
document.getElementById('backBtn')?.addEventListener('click', ()=> history.back());

// Zoom controls
document.getElementById('zoomIn').addEventListener('click', ()=>{
  zoom = Math.min(2.4, +(zoom + 0.15).toFixed(2));
  applyZoom();
});
document.getElementById('zoomOut').addEventListener('click', ()=>{
  zoom = Math.max(0.6, +(zoom - 0.15).toFixed(2));
  applyZoom();
});

// Fullscreen
document.getElementById('fullscreenBtn').addEventListener('click', ()=>{
  if(!document.fullscreenElement){
    viewerWrap.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

// Download
function setDownloadHref(path){
  downloadBtn.setAttribute('href', path);
  downloadBtn.setAttribute('download', path.split('/').pop());
}

// Load PDF by index
function loadPDFByIndex(i){
  const item = CHAPTERS[i];
  if(!item) return;
  loadPDF(item.file, item.title);
}

// Core loader: accepts path and optional label
function loadPDF(path, label){
  loader.style.display = 'block';
  pdfEmbed.style.display = 'none';
  pdfEmbed.removeAttribute('src');

  // small delay to show loader (helps mobile)
  setTimeout(()=>{
    pdfEmbed.setAttribute('src', path);
    // update download href & label
    setDownloadHref(path);
    currentLabel.textContent = label || path;
    // try to wait for embed load
    pdfEmbed.onload = () => {
      loader.style.display = 'none';
      pdfEmbed.style.display = 'block';
      applyZoom();
    };
    // fallback: hide loader after 3s even if onload not fired by browser
    setTimeout(()=>{ loader.style.display = 'none'; pdfEmbed.style.display='block'; }, 3000);
  }, 220);
}

// If ?file=... provided, open that; else open first chapter
(function initLoad(){
  const params = new URLSearchParams(location.search);
  const qfile = params.get('file');
  const qidx = params.get('idx');

  if(qfile){
    loadPDF(qfile, qfile.split('/').pop());
  } else if(qidx && !isNaN(qidx) && CHAPTERS[qidx]){
    loadPDFByIndex(Number(qidx));
  } else {
    if(CHAPTERS.length) loadPDFByIndex(0);
    else {
      loader.textContent = 'No files configured — edit notes-viewer.js CHAPTERS array.';
    }
  }
})();

// keyboard shortcuts
document.addEventListener('keydown', (e)=>{
  if(e.key === '+') { zoom = Math.min(2.4, +(zoom + 0.15).toFixed(2)); applyZoom(); }
  if(e.key === '-') { zoom = Math.max(0.6, +(zoom - 0.15).toFixed(2)); applyZoom(); }
  if(e.key === 'ArrowLeft'){ // prev chapter
    const cur = CHAPTERS.findIndex(c => c.file === pdfEmbed.getAttribute('src'));
    if(cur > 0) loadPDFByIndex(cur - 1);
  }
  if(e.key === 'ArrowRight'){ // next chapter
    const cur = CHAPTERS.findIndex(c => c.file === pdfEmbed.getAttribute('src'));
    if(cur < CHAPTERS.length - 1) loadPDFByIndex(cur + 1);
  }
});

// theme toggle persisted (uses same key as other pages)
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if(saved === 'dark'){ document.body.classList.add('dark'); themeToggle.checked = true; }
if(saved === 'light'){ document.body.classList.remove('dark'); themeToggle.checked = false; }

themeToggle.addEventListener('change', ()=>{
  if(themeToggle.checked){ document.body.classList.add('dark'); localStorage.setItem('theme','dark'); }
  else { document.body.classList.remove('dark'); localStorage.setItem('theme','light'); }
});

// small: update download href when embed src changes
const observer = new MutationObserver(()=>{
  const path = pdfEmbed.getAttribute('src');
  if(path) setDownloadHref(path);
});
observer.observe(pdfEmbed, { attributes: true, attributeFilter: ['src'] });
