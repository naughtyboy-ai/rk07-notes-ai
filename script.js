/* =========================================================
   script.js — Full Replace (background, menu, theme, timer, search, notifications)
   ========================================================= */

/* --------- Helper Utilities --------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function $(id){ return document.getElementById(id); }

/* --------- Loader (auto hide after DOM ready) --------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if(loader){
    setTimeout(()=> loader.style.opacity = '0', 300);
    setTimeout(()=> loader.remove(), 700);
  }
});

/* --------- Canvas Background (particles + subtle grid) --------- */
(function canvasBG(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const P = 60; // number particles

  function rand(min,max){ return Math.random()*(max-min)+min; }

  for(let i=0;i<P;i++){
    particles.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(0.8,2.6),
      vx: rand(-0.3,0.3),
      vy: rand(-0.2,0.2),
      hue: rand(180,210)
    });
  }

  function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle background glow
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, 'rgba(0,10,20,0.5)');
    g.addColorStop(1, 'rgba(6,12,18,0.6)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // draw particles
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;

      ctx.beginPath();
      const rad = p.r;
      const hue = Math.floor(p.hue);
      ctx.fillStyle = 'rgba(0,230,255,0.08)';
      ctx.arc(p.x, p.y, rad, 0, Math.PI*2);
      ctx.fill();
    });

    // draw soft grid lines (very subtle)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,230,255,0.02)';
    const step = Math.max(100, Math.floor(w/12));
    for(let x = 0; x < w; x += step){
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
    }
    for(let y = 0; y < h; y += step){
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
    }

    // connect close particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y; const d = Math.hypot(dx,dy);
        if(d < 160){
          ctx.strokeStyle = `rgba(0,230,255,${0.02*(1 - d/160)})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* --------- Side menu toggle --------- */
(function sideMenu(){
  const menuBtn = document.getElementById('menuBtn');
  const side = document.getElementById('sideMenu');
  if(!menuBtn || !side) return;
  menuBtn.addEventListener('click', () => {
    side.classList.toggle('open');
  });
  // close on outside click
  window.addEventListener('click', (e) => {
    if(!side.contains(e.target) && !menuBtn.contains(e.target)){
      side.classList.remove('open');
    }
  });
})();

/* --------- Theme toggle (auto detect + save) --------- */
(function theme(){
  const btns = document.querySelectorAll('#themeToggle, .theme-btn');
  const saved = localStorage.getItem('rk_theme');
  const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if(saved === 'light' || (!saved && prefers)) document.body.classList.add('light');

  btns.forEach(b=> b && b.addEventListener('click', ()=>{
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('rk_theme', isLight ? 'light' : 'dark');
  }));
})();

/* --------- Motivation popup (random quotes) --------- */
(function motivation(){
  const btn = document.getElementById('motivateBtn');
  const popup = document.getElementById('motivationPopup');
  const textEl = document.getElementById('motivationText');
  if(!btn || !popup || !textEl) return;

  const quotes = [
    "Power ∝ Work — jitna work karenge utna power milegi.",
    "We are the hardest worker in the room.",
    "Small steps every day build huge results.",
    "Practice until your signature becomes skill.",
    "Struggle is the language of growth."
  ];

  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    textEl.textContent = q;
    popup.classList.add('show');
  });
  window.closePopup = () => popup.classList.remove('show');
})();

/* --------- Notifications (simple toast) --------- */
(function notify(){
  function showToast(msg, timeout=3000){
    let box = document.querySelector('.toast');
    if(!box){
      box = document.createElement('div'); box.className = 'toast';
      document.body.appendChild(box);
    }
    box.textContent = msg; box.classList.add('show');
    setTimeout(()=> box.classList.remove('show'), timeout);
  }
  // expose
  window.showToast = showToast;
  // sample: if notifyBtn exists, show sample
  const nb = document.getElementById('notifyBtn');
  if(nb) nb.addEventListener('click', ()=> showToast('No new notifications — all clear!'));
})();

/* --------- Study Timer --------- */
(function timer(){
  const openTimer = document.getElementById('openTimer');
  const box = document.getElementById('timerBox');
  const timeEl = box && box.querySelector('#time');
  let timerId = null, seconds = 0;

  function format(s){
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function update(){
    if(timeEl) timeEl.textContent = format(seconds);
  }
  window.startTimer = function(){
    if(timerId) return;
    timerId = setInterval(()=>{ seconds++; update(); }, 1000);
    if(box) box.classList.add('show');
  };
  window.stopTimer = function(reset=false){
    if(timerId) clearInterval(timerId);
    timerId = null;
    if(reset){ seconds = 0; update(); }
  };

  if(openTimer && box){
    openTimer.addEventListener('click', (e)=>{
      e.preventDefault();
      box.classList.toggle('show');
      if(!box.classList.contains('show')) stopTimer();
    });
  }
})();

/* --------- Chapter search filter (works on chapter.html) --------- */
(function chapterSearch(){
  const search = document.getElementById('searchBox');
  const list = document.getElementById('chapterList');
  if(!search || !list) return;
  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    const items = list.querySelectorAll('li');
    items.forEach(li=>{
      const txt = li.innerText.toLowerCase();
      li.style.display = txt.includes(q) ? '' : 'none';
    });
  });
})();

/* --------- 3D card subtle mouse-tilt (for .card3d) --------- */
(function cardTilt(){
  const cards = document.querySelectorAll('.card3d');
  if(!cards.length) return;
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (-dy / r.height) * 10;
      const ry = (dx / r.width) * 10;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
})();

/* --------- Accessibility: Escape to close popups & menu --------- */
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    document.getElementById('sideMenu')?.classList.remove('open');
    document.getElementById('motivationPopup')?.classList.remove('show');
    document.getElementById('timerBox')?.classList.remove('show');
  }
});
