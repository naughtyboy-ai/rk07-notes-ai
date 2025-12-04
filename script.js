// Full replacement script.js
document.addEventListener('DOMContentLoaded', ()=>{

  // fill years
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = new Date().getFullYear();
  });

  // THEME toggle (persist)
  function applyTheme(light){
    if(light) document.body.classList.add('light');
    else document.body.classList.remove('light');
    document.querySelectorAll('#themeToggle').forEach(b=> b.textContent = light ? '🌞' : '🌙');
    localStorage.setItem('rk_theme_light', light ? '1' : '0');
  }
  const saved = localStorage.getItem('rk_theme_light');
  applyTheme(saved === '1');

  document.querySelectorAll('#themeToggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const isLight = document.body.classList.toggle('light');
      applyTheme(isLight);
    });
  });

  // smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // CHAPTER PAGE: populate based on ?sub= parameter
  const params = new URLSearchParams(window.location.search);
  const sub = params.get('sub'); // e.g., 'physics' or 'sanskrit'
  const chaptersList = document.getElementById('chaptersList');
  const chapterHeading = document.getElementById('chapterHeading');

  if(chaptersList){
    // helper to create item
    const addItem = (icon, title, small, file) => {
      const a = document.createElement('a');
      a.className = 'icon-item';
      a.href = file ? `notes.html?file=${encodeURIComponent(file)}` : '#';
      a.innerHTML = `<div class="icon">${icon}</div>
                     <div class="icon-text"><strong>${title}</strong><div class="muted">${small}</div></div>`;
      chaptersList.appendChild(a);
    };

    // default sample (if no sub) - exclude Sanskrit here
    if(!sub){
      chapterHeading.textContent = 'Chapters — All Subjects (sample)';
      addItem('⚙️','Physics — Chapter 1: Motion','Short notes & formulas','sample_physics.pdf');
      addItem('🧲','Physics — Chapter 2: Force and Laws','Newton\'s laws','sample_physics.pdf');
      addItem('⚡','Physics — Chapter 3: Work & Energy','Work, power, energy','sample_physics.pdf');
      addItem('📈','Economics — Chapter 1: Basic Concepts','Demand & supply','economics_ch1.pdf');
      addItem('📜','History — Chapter 1: Ancient India','Key events','history_ch1.pdf');
      // no Sanskrit here (user requested Sanskrit only on subject page)
    } else {
      // specific subject pages
      const s = sub.toLowerCase();
      if(s === 'physics'){
        chapterHeading.textContent = 'Physics — Chapters';
        addItem('⚙️','Chapter 1: Motion','Short notes & formulas','sample_physics.pdf');
        addItem('🧲','Chapter 2: Force and Laws','Newton\'s laws','sample_physics.pdf');
        addItem('⚡','Chapter 3: Work & Energy','Work, power, energy','sample_physics.pdf');
      } else if(s === 'chemistry'){
        chapterHeading.textContent = 'Chemistry — Chapters';
        addItem('🧪','Chapter 1: Matter','States & properties','chemistry_ch1.pdf');
        addItem('⚗️','Chapter 2: Reactions','Types & examples','chemistry_ch2.pdf');
      } else if(s === 'maths'){
        chapterHeading.textContent = 'Maths — Chapters';
        addItem('➗','Chapter 1: Number Systems','Basics & practice','maths_ch1.pdf');
        addItem('📐','Chapter 2: Geometry','Shapes & theorems','maths_ch2.pdf');
      } else if(s === 'biology'){
        chapterHeading.textContent = 'Biology — Chapters';
        addItem('🧬','Chapter 1: Cell','Structure & function','biology_ch1.pdf');
        addItem('🌱','Chapter 2: Plant Kingdom','Basics','biology_ch2.pdf');
      } else if(s === 'sanskrit'){
        // ONLY populate Sanskrit when ?sub=sanskrit
        chapterHeading.textContent = 'Sanskrit — Chapters';
        addItem('📘','Chapter 1 — परिचय','Sanskrit basics','sanskrit_ch1.pdf');
        addItem('🔤','Chapter 2 — संस्कृत वर्णमाला','Alphabet & pronunciation','sanskrit_ch2.pdf');
        addItem('✍️','Chapter 3 — शब्दरूप','Word forms','sanskrit_ch3.pdf');
        addItem('📚','Chapter 4 — धातुरूप','Verb roots','sanskrit_ch4.pdf');
        addItem('🔗','Chapter 5 — सन्धि','Sandhi rules','sanskrit_ch5.pdf');
      } else if(s === 'history'){
        chapterHeading.textContent = 'History — Chapters';
        addItem('📜','Chapter 1: Ancient India','Key events & timelines','history_ch1.pdf');
        addItem('🏺','Chapter 2: Medieval India','Important dynasties','history_ch2.pdf');
      } else if(s === 'geography'){
        chapterHeading.textContent = 'Geography — Chapters';
        addItem('🌍','Chapter 1: Earth & Maps','Basics','geography_ch1.pdf');
        addItem('🌦️','Chapter 2: Weather & Climate','Concepts','geography_ch2.pdf');
      } else if(s === 'civics'){
        chapterHeading.textContent = 'Civics — Chapters';
        addItem('🏛️','Chapter 1: Local Government','Structure & roles','civics_ch1.pdf');
      } else if(s === 'economics'){
        chapterHeading.textContent = 'Economics — Chapters';
        addItem('📈','Chapter 1: Basic Concepts','Demand, supply','economics_ch1.pdf');
      } else if(s === 'english'){
        chapterHeading.textContent = 'English — Chapters';
        addItem('📖','Chapter 1: Prose','Comprehension & notes','english_ch1.pdf');
      } else {
        chapterHeading.textContent = 'Chapters';
        addItem('ℹ️','No specific subject found','Please go back to Subjects','');
      }
    }

    // After populating, attach item filter for search (works live)
    const searchInput = document.getElementById('chapterSearch');
    if(searchInput){
      searchInput.addEventListener('input', ()=> {
        const q = searchInput.value.trim().toLowerCase();
        chaptersList.querySelectorAll('.icon-item').forEach(item=>{
          const text = (item.innerText || '').toLowerCase();
          item.style.display = text.indexOf(q) !== -1 ? '' : 'none';
        });
      });
    }
  } // end chaptersList population

  // PDF viewer logic (notes page)
  const pdfInput = document.getElementById('pdfInput');
  const pdfViewer = document.getElementById('pdfViewer');
  const pdfPlaceholder = document.getElementById('pdfPlaceholder');

  if(pdfInput && pdfViewer){
    pdfInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      pdfViewer.src = url;
      if(pdfPlaceholder) pdfPlaceholder.style.display = 'none';
    });
  }

  document.querySelectorAll('.tiny-btn[data-file]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const file = btn.getAttribute('data-file');
      if(file && pdfViewer) {
        pdfViewer.src = file;
        if(pdfPlaceholder) pdfPlaceholder.style.display = 'none';
      }
    });
  });

  // If page opened with ?file=... in url, open it (notes viewer)
  const fileParam = params.get('file');
  if(fileParam){
    const viewer = document.getElementById('pdfViewer');
    if(viewer){
      viewer.src = fileParam;
      const ph = document.getElementById('pdfPlaceholder');
      if(ph) ph.style.display = 'none';
    } else {
      if(!location.pathname.endsWith('notes.html')){
        location.href = 'notes.html?file=' + encodeURIComponent(fileParam);
      }
    }
  }

  // respect prefers-reduced-motion
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  }

  // Accessibility: class-scroll-large keyboard
  const classScrollLarge = document.querySelector('.class-scroll-large');
  if(classScrollLarge){
    classScrollLarge.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowDown') classScrollLarge.scrollBy({ top: 80, behavior: 'smooth' });
      if(e.key === 'ArrowUp') classScrollLarge.scrollBy({ top: -80, behavior: 'smooth' });
    });
  }

});
