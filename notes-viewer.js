/* notes-viewer.js
   Robust, replace-ready notes viewer (no external libs)
   - Tries to fetch data/<class>-<subject>.json (based on URL params)
   - Fallback: data/notes.json OR CHAPTERS (embedded)
   - Features: sidebar, search, zoom, fullscreen, download, keyboard nav, theme persistence
*/

/* ---------------- CONFIG (optional fallback chapters) -------------- */
/* Only used if no data JSON found. Edit filenames/paths as needed. */
const FALLBACK_CHAPTERS = [
  { title: "Sample Chapter 1", file: "pdfs/sample1.pdf" },
  { title: "Sample Chapter 2", file: "pdfs/sample2.pdf" }
];
/* ------------------------------------------------------------------ */

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function param(name){
  return new URLSearchParams(location.search).get(name);
}

/* ---------- elements ---------- */
const pdfEmbed = $('#pdfEmbed');
const loader = $('#loader');
const viewerWrap = $('#viewerWrap');
const chaptersList = $('#chaptersList');
const currentLabel = $('#currentChapterLabel');
const downloadBtn = $('#downloadBtn');
const searchCh = $('#searchCh');
const chapSearch = $('#chapSearch');
const sidebar = $('#chaptersSidebar');
const sidebarToggle = $('#sidebarToggle');
const closeSidebar = $('#closeSidebar');
const backBtn = $('#backBtn');
const zoomIn = $('#zoomIn');
const zoomOut = $('#zoomOut');
const fullscreenBtn = $('#fullscreenBtn');
const themeToggle = $('#themeToggle');

let CHAPTERS = []; // will be filled from fetched JSON or fallback
let zoom = 1;

/* ---------- load data JSON (class+subject) ---------- */
async function loadChaptersFromData(){
  // Priority:
  // 1) If URL has file param -> open that file directly
  // 2) If URL has idx param -> open by index (after chapters loaded)
  // 3) If URL has class+subject -> try fetch data/<class>-<subject>.json OR data/<class>_<subject>.json
  // 4) Try fetch data/notes.json
  // 5) fallback to FALLBACK_CHAPTERS

  // direct file param
  const fileParam = param('file');
  const idxParam = param('idx');

  const cls = param('class');      // e.g. class-11
  const subj = param('subject');   // e.g. physics

  // helper to try fetch a path and parse JSON
  async function tryFetchJson(path){
    try{
      const res = await fetch(path);
      if(!res.ok) throw new Error('not ok');
      const data = await res.json();
      if(Array.isArray(data)) return data;
      // if object with chapters field
      if(data.chapters && Array.isArray(data.chapters)) return data.chapters;
      return null;
    }catch(e){
      return null;
    }
  }

  // 1) If file param provided - open directly (no chapter list needed)
  if(fileParam){
    CHAPTERS = [{ title: fileParam.split('/').pop(), file: fileParam }];
    buildChapters();
    loadPDF(fileParam, CHAPTERS[0].title);
    return;
  }

  // 2) If class+subject provided -> try candidate json filenames
  if(cls && subj){
    const candidates = [
      `data/${cls}-${subj}.json`,
      `data/${cls}_${subj}.json`,
      `data/${cls}/${subj}.json`,
      `data/${cls}/${subj}.json`
    ];
    for(const c of candidates){
      const res = await tryFetchJson(c);
      if(res){
        CHAPTERS = res;
        buildChapters();
        // open by idx if provided
        if(idxParam && !isNaN(idxParam) && CHAPTERS[idxParam]) loadPDF(CHAPTERS[idxParam].file, CHAPTERS[idxParam].title);
        else if(CHAPTERS.length) loadPDF(CHAPTERS[0].file, CHAPTERS[0].title);
        return;
      }
    }
  }

  // 3) try generic data/notes.json
  const generic = await tryFetchJson('data/notes.json');
  if(generic){
    CHAPTERS = generic;
    buildChapters();
    if(idxParam && !isNaN(idxParam) && CHAPTERS[idxParam]) loadPDF(CHAPTERS[idxParam].file, CHAPTERS[idxParam].title);
    else if(CHAPTERS.length) loadPDF(CHAPTERS[0].file, CHAPTERS[0].title);
    return;
  }

  // 4) fallback to embedded fallback chapters
  CHAPTERS = FALLBACK_CHAPTERS.slice();
  buildChapters();
  if(CHAPTERS.length) loadPDF(CHAPTERS[0].file, CHAPTERS[0].title);
  else loader.textContent = 'No chapters configured. Place JSON in data/ or edit notes-viewer.js';
}

/* ---------- build sidebar ---------- */
function buildChapters(){
  chaptersList.innerHTML = '';
  CHAPTERS.forEach((c, idx) => {
    const div = document.createElement('div');
    div.className = 'chap-item';
    div.setAttribute('data-idx', idx);
    div.setAttribute('role','listitem');
    div.innerHTML = `<div><strong>${escapeHtml(c.title)}</strong><div class="meta">${escapeHtml(c.file || '')}</div></div><div>▶</div>`;
    div.addEventListener('click', ()=>{
      loadPDFByIndex(idx);
      if(window.innerWidth < 900) toggleSidebar(false);
    });
    chaptersList.appendChild(div);
  });
}

/* ---------- utility: escapeHtml ---------- */
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

/* ---------- search filtering ---------- */
searchCh?.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  $$('.chap-item').forEach(item=>{
    item.style.display = item.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
});
chapSearch?.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  $$('.chap-item').forEach(item=>{
    item.style.display = item.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
});

/* ---------- sidebar controls ---------- */
function toggleSidebar(force){
  if(typeof force === 'boolean'){ 
    if(force) sidebar.classList.add('open'); else sidebar.classList.remove('open');
    return;
  }
  sidebar.classList.toggle('open');
}
sidebarToggle?.addEventListener('click', ()=> toggleSidebar());
closeSidebar?.addEventListener('click', ()=> toggleSidebar(false));

/* ---------- back button ---------- */
backBtn?.addEventListener('click', ()=> history.back());

/* ---------- zoom ---------- */
function applyZoom(){ pdfEmbed.style.transform = `scale(${zoom})`; }
zoomIn?.addEventListener('click', ()=>{ zoom = Math.min(2.8, +(zoom + 0.15).toFixed(2)); applyZoom(); });
zoomOut?.addEventListener('click', ()=>{ zoom = Math.max(0.5, +(zoom - 0.15).toFixed(2)); applyZoom(); });

/* ---------- fullscreen ---------- */
fullscreenBtn?.addEventListener('click', ()=>{
  if(!document.fullscreenElement) viewerWrap.requestFullscreen?.();
  else document.exitFullscreen?.();
});

/* ---------- download ---------- */
function setDownloadHref(path){
  if(!downloadBtn) return;
  downloadBtn.setAttribute('href', path);
  downloadBtn.setAttribute('download', path.split('/').pop());
}

/* ---------- load by index ---------- */
function loadPDFByIndex(i){
  const item = CHAPTERS[i];
  if(!item) return;
  loadPDF(item.file, item.title);
  highlightActive(i);
}

/* ---------- highlight active in sidebar ---------- */
function highlightActive(idx){
  $$('.chap-item').forEach(el => el.classList.toggle('active', Number(el.getAttribute('data-idx')) === idx));
}

/* ---------- core loader ---------- */
function loadPDF(path, label){
  if(!path) return;
  loader.style.display = 'block';
  pdfEmbed.style.display = 'none';
  // small delay for smooth UX
  setTimeout(()=>{
    // set embed src
    pdfEmbed.setAttribute('src', path);
    setDownloadHref(path);
    currentLabel.textContent = label || path.split('/').pop();
    // attach onload (some browsers may not fire embed.onload)
    pdfEmbed.onload = () => {
      loader.style.display = 'none';
      pdfEmbed.style.display = 'block';
      applyZoom();
    };
    // fallback to hide loader after 2.5s
    setTimeout(()=>{ loader.style.display = 'none'; pdfEmbed.style.display = 'block'; applyZoom(); }, 2500);
  }, 160);
}

/* ---------- keyboard shortcuts ---------- */
document.addEventListener('keydown', (e)=>{
  if(e.key === '+' || e.key === '='){ zoom = Math.min(2.8, +(zoom + 0.15).toFixed(2)); applyZoom(); }
  if(e.key === '-') { zoom = Math.max(0.5, +(zoom - 0.15).toFixed(2)); applyZoom(); }
  if(e.key === 'ArrowLeft'){
    const cur = CHAPTERS.findIndex(c => c.file === pdfEmbed.getAttribute('src'));
    if(cur > 0) loadPDFByIndex(cur - 1);
  }
  if(e.key === 'ArrowRight'){
    const cur = CHAPTERS.findIndex(c => c.file === pdfEmbed.getAttribute('src'));
    if(cur < CHAPTERS.length - 1) loadPDFByIndex(cur + 1);
  }
  if(e.key === 'Escape' && sidebar.classList.contains('open')) toggleSidebar(false);
});

/* ---------- theme persist ---------- */
(function themeInit(){
  const saved = localStorage.getItem('theme');
  if(saved === 'dark'){ document.body.classList.remove('light'); document.body.classList.add('dark'); themeToggle.checked = true; }
  else if(saved === 'light'){ document.body.classList.remove('dark'); document.body.classList.add('light'); themeToggle.checked = false; }
  else { /* respect system preference optionally */ }

  themeToggle?.addEventListener('change', ()=>{
    if(themeToggle.checked){ document.body.classList.remove('light'); document.body.classList.add('dark'); localStorage.setItem('theme','dark'); }
    else { document.body.classList.remove('dark'); document.body.classList.add('light'); localStorage.setItem('theme','light'); }
  });
})();

/* ---------- observe embed src change to update download link ---------- */
const observer = new MutationObserver(()=> setDownloadHref(pdfEmbed.getAttribute('src') || ''));
observer.observe(pdfEmbed, { attributes: true, attributeFilter: ['src'] });

/* ---------- escape & init ---------- */
loadChaptersFromData().catch(err=>{
  console.error('Failed loading chapters', err);
  loader.textContent = 'Error loading chapter list. Check console.';
});
