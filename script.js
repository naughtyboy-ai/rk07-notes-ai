/* script.js — homepage interactions: bg, menu, theme, tilt, chat, moti */

/* -------------- helpers -------------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* -------------- year -------------- */
document.getElementById('year')?.textContent = new Date().getFullYear();

/* -------------- background animated gradient (canvas) -------------- */
(function bgCanvas(){
  const canvas = document.getElementById('bgCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; });

  // moving gradient blobs (light CPU)
  const blobs = [
    {x: w*0.1, y: h*0.2, r: Math.min(w,h)*0.4, hue: 200, vx:0.02, vy:0.01},
    {x: w*0.8, y: h*0.6, r: Math.min(w,h)*0.35, hue: 260, vx:-0.015, vy:-0.01}
  ];

  function draw(){
    ctx.clearRect(0,0,w,h);
    // base dark fill
    ctx.fillStyle = '#04101a'; ctx.fillRect(0,0,w,h);

    blobs.forEach(b=>{
      // move slowly
      b.x += b.vx * (Math.cos(Date.now()/5000));
      b.y += b.vy * (Math.sin(Date.now()/4000));
      const g = ctx.createRadialGradient(b.x,b.y,b.r*0.05,b.x,b.y,b.r);
      g.addColorStop(0, `hsla(${b.hue},90%,60%,0.18)`);
      g.addColorStop(0.4, `hsla(${b.hue+20},80%,50%,0.08)`);
      g.addColorStop(1, `rgba(4,16,30,0)`);
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* -------------- SVG wave animation (gentle) -------------- */
(function wave(){
  const path = document.getElementById('wavePath');
  if(!path) return;
  function update(){
    const t = Date.now()/1500;
    const w = window.innerWidth;
    // generate simple wave with two sine components
    const amplitude = 18;
    const points = [];
    const step = Math.max(16, Math.floor(w/24));
    for(let x=0;x<=w;x+=step){
      const y = 30 + Math.sin((x/120)+t)*amplitude + Math.sin((x/60)+t*0.7)*6;
      points.push(`${x},${y}`);
    }
    // build path: move to left top, then line across wave, then down to bottom to close
    const d = `M0,120 L${points.join(' L ')} L${w},120 L0,120 Z`;
    path.setAttribute('d', d);
    requestAnimationFrame(update);
  }
  update();
})();

/* -------------- side menu open/close -------------- */
(function menu(){
  const menuBtn = document.getElementById('menuBtn');
  const side = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  if(!menuBtn || !side) return;
  menuBtn.addEventListener('click', ()=>{ side.classList.toggle('open'); overlay.style.display = side.classList.contains('open') ? 'block' : 'none'; });
  overlay.addEventListener('click', ()=>{ side.classList.remove('open'); overlay.style.display='none'; });
})();

/* -------------- theme switch (slide) -------------- */
(function theme(){
  const switchEl = document.getElementById('themeSwitch');
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') { document.documentElement.setAttribute('data-theme','dark'); switchEl.checked = true; }
  if(saved === 'light') { document.documentElement.removeAttribute('data-theme'); switchEl.checked = false; }

  switchEl.addEventListener('change', ()=>{
    const on = switchEl.checked;
    if(on){ document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); if(navigator.vibrate) navigator.vibrate(30); }
    else { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme','light'); if(navigator.vibrate) navigator.vibrate(30); }
  });
})();

/* -------------- 3D card tilt (mouse) -------------- */
(function tiltCards(){
  const cards = $$('.card3d');
  if(!cards.length) return;
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (-dy / r.height) * 8;
      const ry = (dx / r.width) * 8;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', ()=> { card.style.transform=''; });
  });
})();

/* -------------- Chat widget (simple local logic) -------------- */
(function chat(){
  const openBtn = document.getElementById('openChatBtn');
  const widget = document.getElementById('chatWidget');
  const closeBtn = document.getElementById('closeChat');
  const send = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const body = document.getElementById('chatBody');

  window.openChat = function(){
    widget.classList.add('show');
    widget.setAttribute('aria-hidden','false');
  }
  if(openBtn) openBtn.addEventListener('click', (e)=>{ e.preventDefault(); openChat(); });

  if(closeBtn) closeBtn.addEventListener('click', ()=>{ widget.classList.remove('show'); widget.setAttribute('aria-hidden','true'); });
  if(send) send.addEventListener('click', ()=> sendMsg());
  if(input) input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') sendMsg(); });

  function sendMsg(){
    const v = input.value.trim();
    if(!v) return;
    const u = document.createElement('div'); u.className='user-msg'; u.textContent = v; body.appendChild(u);
    input.value = '';
    // simple canned replies (helps user navigate)
    setTimeout(()=>{
      const bot = document.createElement('div'); bot.className='bot-msg';
      const low = v.toLowerCase();
      if(low.includes('timer')) bot.textContent = 'Open Study Timer from the tools — or click the Timer card.';
      else if(low.includes('pdf') || low.includes('notes')) bot.textContent = 'Go to Classes → select subject → open chapter notes (PDF viewer).';
      else if(low.includes('contact')) bot.textContent = 'Use the Contact & Support button in header (opens Gmail).';
      else bot.textContent = 'Check Classes or Tests. Ask "timer", "notes", or "contact".';
      body.appendChild(bot);
      body.scrollTop = body.scrollHeight;
    }, 600);
  }
})();

/* -------------- small utilities -------------- */
function goto(page){ location.href = page; }
function openChat(){ document.getElementById('chatWidget')?.classList.add('show'); }
function showMotivation(){
  alert("POWER ∝ WORK — Keep going! Small steps daily build mastery.");
}

/* -------------- keyboard shortcuts -------------- */
window.addEventListener('keydown', (e)=>{
  if(e.key === 't') goto('study-timer.html');
  if(e.key === 'c') openChat();
});
