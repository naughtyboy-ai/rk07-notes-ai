// script.js — theme toggle, years, pdf loader, small motion
document.addEventListener('DOMContentLoaded', ()=>{

  // fill years
  const years = ['year','year2','year3','year4','year5'];
  const y = new Date().getFullYear();
  years.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = y;
  });

  // theme toggle (dark/light) — persists in localStorage
  const themeToggleButtons = document.querySelectorAll('#themeToggle');
  function setTheme(isLight){
    if(isLight) document.body.classList.add('light');
    else document.body.classList.remove('light');
    themeToggleButtons.forEach(btn=> btn.textContent = isLight ? '🌞' : '🌙');
    localStorage.setItem('rk_theme_light', isLight ? '1' : '0');
  }
  const saved = localStorage.getItem('rk_theme_light');
  setTheme(saved === '1');

  themeToggleButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const isLight = document.body.classList.toggle('light');
      setTheme(isLight);
    });
  });

  // profile subtle hover transform
  const profile = document.querySelector('.profile-logo');
  if(profile){
    profile.style.transition = 'transform 240ms cubic-bezier(.2,.9,.3,1)';
    profile.addEventListener('mouseenter', ()=> profile.style.transform = 'scale(1.06) rotate(-6deg)');
    profile.addEventListener('mouseleave', ()=> profile.style.transform = 'scale(1) rotate(0deg)');
  }

  // smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // PDF viewer: load local PDF
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

  // quick sample links
  document.querySelectorAll('.tiny-btn[data-file]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const file = btn.getAttribute('data-file');
      if(file && pdfViewer) {
        // try open local file path; if not found user will see browser fallback
        pdfViewer.src = file;
        if(pdfPlaceholder) pdfPlaceholder.style.display = 'none';
      }
    });
  });

  // if page opened with ?file=... in url, try to open it in viewer
  const params = new URLSearchParams(window.location.search);
  const fileParam = params.get('file');
  if(fileParam){
    const viewer = document.getElementById('pdfViewer');
    if(viewer) {
      viewer.src = fileParam;
      const ph = document.getElementById('pdfPlaceholder');
      if(ph) ph.style.display = 'none';
    } else {
      // if not on notes page, navigate to notes.html with file param
      if(!location.pathname.endsWith('notes.html')) {
        location.href = 'notes.html?file=' + encodeURIComponent(fileParam);
      }
    }
  }

  // respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  }
});
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior:"smooth"
    });
  });
});
