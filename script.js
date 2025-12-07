const homeBtn = document.getElementById("homeBtn");
const homeSheet = document.getElementById("homeSheet");

homeBtn.addEventListener("click", () => {
  homeSheet.style.bottom = "0px";
});

document.addEventListener("click", (e) => {
  if (!homeSheet.contains(e.target) && !homeBtn.contains(e.target)) {
    homeSheet.style.bottom = "-300px";
  }
});
/* Main site script - theme, menu, waves, timetable, notes, formulas, streak, recent, uploads */

// === utilities ===
function el(id){return document.getElementById(id)}
function goto(p){ if(p.startsWith('#')) location.hash = p; else location.href = p }

// === THEME TOGGLE ===
// THEME SLIDER
const sw = document.getElementById("themeSwitch");

sw.addEventListener("change", () => {
  document.body.classList.toggle("dark", sw.checked);
  localStorage.setItem("theme", sw.checked ? "dark" : "light");
});

// load saved state
if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark");
  sw.checked = true;
}
// === MENU ===
const side = document.getElementById('sideMenu'), overlay = document.getElementById('overlay'), menuBtn = document.getElementById('menuBtn')
menuBtn.addEventListener('click', ()=>{ side.classList.toggle('open'); overlay.classList.toggle('show'); })
overlay.addEventListener('click', ()=>{ side.classList.remove('open'); overlay.classList.remove('show'); })

// === CONTACT BUTTON ===
el('contactBtn').addEventListener('click', ()=> window.location.href = 'mailto:masumboy141@gmail.com')

// === PROFILE GLOW TOUCH ===
function enableGlowOnTouch(selector){
  const elSel = document.querySelector(selector)
  if(!elSel) return
  elSel.addEventListener('touchstart', ()=>{ elSel.classList.add('glowing'); setTimeout(()=>elSel.classList.remove('glowing'),350) })
  elSel.addEventListener('click', ()=>{ elSel.classList.add('glowing'); setTimeout(()=>elSel.classList.remove('glowing'),350) })
}
enableGlowOnTouch('#notesTitle'); enableGlowOnTouch('#profileImg')

// === BACKGROUND PARTICLES (light) ===
const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
canvas.id = 'bgCanvas'; document.body.prepend(canvas)
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight }
window.addEventListener('resize', resizeCanvas); resizeCanvas()
let particles = Array.from({length:40}).map(()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+0.6,dx:(Math.random()-0.5)*0.3,dy:(Math.random()-0.5)*0.3}))
function animateBg(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  particles.forEach(p=>{
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.03)'; ctx.fill()
    p.x+=p.dx; p.y+=p.dy
    if(p.x<0||p.x>canvas.width) p.dx*=-1
    if(p.y<0||p.y>canvas.height) p.dy*=-1
  })
  requestAnimationFrame(animateBg)
}
animateBg()

// === TOP WAVE animation (optional) ===
// Bottom wave animate
const bottomWavePath = el('bottomWavePath'); let t2 = 0
function animateBottomWave(){
  t2 += 0.025
  let path = 'M0 0 '
  for(let x=0;x<=1440;x+=20){
    let y = 20 + Math.sin(x*0.01 + t2)*10
    path += `L ${x} ${y} `
  }
  path += 'L 1440 120 L 0 120 Z'
  if(bottomWavePath) bottomWavePath.setAttribute('d', path)
  requestAnimationFrame(animateBottomWave)
}
animateBottomWave()

// === CARD CLICK NAV ===
document.querySelectorAll('.card').forEach(c=>{
  c.addEventListener('click', ()=>{ const link = c.dataset.link; if(link && link.startsWith('#')) goto(link); else if(link) goto(link) })
})

// === YEAR ===
el('year').textContent = new Date().getFullYear()

/* =========================
   NOTES SYSTEM (localStorage)
   Commands: create note NAME: CONTENT
             show notes
             delete note NAME
===========================*/
const NOTES_KEY = 'rohit_notes_v2'
let notes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
function saveNotesStore(){ localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) }
function addNote(name,content){
  notes[name] = content; saveNotesStore(); updateNotesCount(); return true
}
function deleteNote(name){ if(notes[name]){ delete notes[name]; saveNotesStore(); return true } return false }
function getNotes(){ return notes }

function updateNotesCount(){ el('notesCount').textContent = 'Notes: ' + Object.keys(notes).length }

// UI: save note button
el('saveNoteBtn').addEventListener('click', ()=>{
  const name = el('noteName').value.trim()
  const content = el('noteContent').value.trim()
  if(!name||!content){ alert('Provide name and content') ; return }
  addNote(name, content)
  el('noteName').value=''; el('noteContent').value=''
  alert('Note saved ✔')
})

// show notes
el('showNotesBtn').addEventListener('click', ()=>{
  const container = el('notesList'); container.innerHTML=''
  const all = getNotes(); if(Object.keys(all).length===0){ container.textContent='No notes saved' ; return }
  Object.keys(all).forEach((k,i)=>{
    const div = document.createElement('div'); div.className='note-item'
    div.innerHTML = `<b>${k}</b> — ${all[k]} <button data-name="${k}" class="delNote">Delete</button>`
    container.appendChild(div)
  })
  container.querySelectorAll('.delNote').forEach(b=>{
    b.addEventListener('click',(ev)=>{ const n=ev.target.dataset.name; if(confirm('Delete '+n+'?')){ deleteNote(n); b.parentElement.remove(); updateNotesCount() } })
  })
})
updateNotesCount()

/* =========================
   FILE UPLOAD (notes upload)
   saves file as dataURL in localStorage (small PDFs/Images)
===========================*/
el('openUpload').addEventListener('click', ()=> el('noteFile').click())
el('openUploadBtn') && el('openUploadBtn').addEventListener('click', ()=> el('noteFile').click())
el('noteFile').addEventListener('change', (e)=>{
  const f = e.target.files[0]; if(!f) return
  const reader = new FileReader()
  reader.onload = function(ev){
    const data = ev.target.result
    const files = JSON.parse(localStorage.getItem('savedFiles')||'[]')
    files.unshift({name:f.name,data,when:new Date().toISOString()})
    localStorage.setItem('savedFiles', JSON.stringify(files))
    alert('File saved locally ✔')
    addRecent(f.name)
  }
  reader.readAsDataURL(f)
})

/* =========================
   RECENT + STREAK
===========================*/
function addRecent(name){
  let arr = JSON.parse(localStorage.getItem('recentNotes')||'[]')
  arr.unshift(name); arr = [...new Set(arr)].slice(0,10); localStorage.setItem('recentNotes', JSON.stringify(arr)); loadRecent()
}
function loadRecent(){
  const box = el('recentBox'); const arr = JSON.parse(localStorage.getItem('recentNotes')||'[]')
  box.innerHTML = '<b>Recent:</b><br>' + (arr.length? arr.map(x=>`<div>${x}</div>`).join('') : 'No recent items')
}
loadRecent()

function updateStreak(){
  const today = new Date().toDateString(); const last = localStorage.getItem('lastStudyDate'); let streak = Number(localStorage.getItem('studyStreak')||0)
  if(last===today){ el('streakCount').textContent = streak; return streak }
  if(last){
    const diff = (new Date(today) - new Date(last))/(1000*3600*24)
    if(diff===1) streak++; else streak=1
  } else streak=1
  localStorage.setItem('lastStudyDate', today); localStorage.setItem('studyStreak', streak); el('streakCount').textContent = streak; return streak
}
updateStreak()

/* =========================
   FORMULA BOOK
===========================*/
const formulas = {
  math: ["sin^2θ + cos^2θ = 1","(a+b)^2 = a^2 + 2ab + b^2","d/dx (x^n) = n x^(n-1)"],
  physics: ["v = u + at","F = ma","E = mc^2"],
  chemistry: ["PV = nRT","Molarity = moles / liters","Mass % = mass solute / mass solution *100"]
}
function loadFormulas(type){
  const box = el('formulaList'); box.innerHTML=''
  (formulas[type]||[]).forEach(f=>{ const d=document.createElement('div'); d.className='formula'; d.textContent = f; box.appendChild(d) })
  el('formulaBox').scrollIntoView({behavior:'smooth'})
}
function showFormulas(){ el('formulaBox').scrollIntoView({behavior:'smooth'}) }

/* =========================
   TIMETABLE (smart + editable + save + download)
===========================*/
const subjectsMap = {
  "12 science":["Physics","Chemistry","Maths","English","Computer"],
  "12 commerce":["Accounts","Business","Economics","Maths"],
  "12 arts":["History","Geography","Pol.Science","English"],
  "11 science":["Physics","Chemistry","Maths","English"],
  "11 commerce":["Accounts","Business","Economics"],
  "11 arts":["History","Geography","Civics","English"]
}

function showTimetableUI(){ document.getElementById('timetable').style.display='block'; document.getElementById('timetable').scrollIntoView({behavior:'smooth'}) }
el('genBtn').addEventListener('click', generateTimetable)
el('saveTimetableBtn').addEventListener('click', ()=>{
  localStorage.setItem('savedTimetable', el('result').innerHTML)
  alert('Timetable saved locally ✔')
})
el('downloadBtn').addEventListener('click', downloadPDF)

function generateTimetable(){
  const cls = el('classSelect').value; if(!cls){ alert('Select class'); return }
  const subjects = subjectsMap[cls] || ['Study']
  const week = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  const slots = ["Morning (8–10)","Noon (1–3)","Evening (7–9)"]
  const colorClass = cls.includes('science') ? 'science' : (cls.includes('commerce') ? 'commerce' : 'arts')
  let idx = 0
  let html = `<h3>${cls.toUpperCase()} — Weekly Timetable</h3><table class="timetable-table ${colorClass}"><tr><th>Day</th><th>${slots[0]}</th><th>${slots[1]}</th><th>${slots[2]}</th></tr>`
  week.forEach(day=>{
    html += `<tr><td><b>${day}</b></td>`
    slots.forEach(()=>{ html += `<td contenteditable="true">${subjects[idx % subjects.length]}</td>`; idx++ })
    html += '</tr>'
  })
  html += '</table><div style="margin-top:10px"><button class="genBtn" onclick="saveEditableTimetable()">Save Edits</button></div>'
  el('result').innerHTML = html
  addRecent(`${cls} timetable`)
}

function saveEditableTimetable(){
  localStorage.setItem('savedTimetable', el('result').innerHTML)
  alert('Saved edits ✔')
}

function downloadPDF(){
  const elToPrint = el('result')
  if(!elToPrint.innerHTML){ alert('No timetable to print'); return }
  const win = window.open('','_blank','width=900,height=700')
  win.document.write('<html><head><title>Timetable</title><style>body{font-family:Arial;padding:20px;color:#000}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:center}</style></head><body>')
  win.document.write(elToPrint.innerHTML)
  win.document.write('</body></html>')
  win.document.close(); win.print()
}

/* =========================
   MOTIVATION QUOTES
===========================*/
const quotes = [
"Success = Consistency × Hard Work!",
"Winners are not born, they are built!",
"Focus on progress, not perfection!",
"Work in silence, let success make the noise!",
"Every expert was once a beginner!",
"Small steps every day lead to big results!",
"Stop doubting yourself, work hard and make it happen!",
"Discipline beats motivation every time!",
"Your only limit is your mind!",
"If it was easy, everyone would do it!",
"Dream big. Start small. Act now!",
"Don't stop until you're proud!",
"You don't need to be perfect — just be consistent!",
"The best view comes after the hardest climb!",
"It's never too late to start again!",
"Your future is created by what you do today!",
"Push yourself. Because no one else is going to do it for you!",
"Stay focused. Stay determined. Stay hungry!",
"A little progress each day adds up to big results!",
"Believe in yourself, even when no one else does!"
]
function showMotivation(){
  const q = quotes[Math.floor(Math.random()*quotes.length)]
  el('quoteBox').textContent = q
}
showMotivation()

/* =========================
   SAFE MATH (optional for ask chat)
   simple shunting-yard eval (no eval)
===========================*/
function sanitizeMath(s){
  if(!s) return null
  s = s.replace(/×/g,'*').replace(/÷/g,'/')
  if(/[^0-9+\-*/().%\^ \t]/.test(s)) return null
  return s
}
// shunting-yard implementation (left as helper - not wired to UI here)
function evaluateSafe(expr){
  const ops={'+':{p:1},'-':{p:1},'*':{p:2},'/':{p:2},'%':{p:2},'^':{p:3}}
  function toTokens(s){ const t=[]; let n=''; for(let ch of s){ if((ch>='0'&&ch<='9')||ch=='.'){ n+=ch; continue } if(ch===' '||ch=='\t'){ if(n){t.push(n);n=''}; continue } if(n){t.push(n);n=''} if(ch in ops||ch==='('||ch===')') t.push(ch); else throw 'invalid' } if(n) t.push(n); return t }
  function toRPN(tokens){ const out=[], stack=[]; for(let tk of tokens){ if(!isNaN(tk)) out.push(tk); else if(tk in ops){ while(stack.length){ const o2=stack[stack.length-1]; if(o2 in ops && ((ops[tk].p<=ops[o2].p))) out.push(stack.pop()); else break } stack.push(tk) } else if(tk==='(') stack.push(tk); else if(tk===')'){ while(stack.length && stack[stack.length-1]!=='(') out.push(stack.pop()); stack.pop() } } while(stack.length){ out.push(stack.pop()) } return out }
  function evalRPN(rpn){ const st=[]; for(let t of rpn){ if(!isNaN(t)) st.push(parseFloat(t)); else{ const b=st.pop(), a=st.pop(); if(t=='+') st.push(a+b); else if(t=='-') st.push(a-b); else if(t=='*') st.push(a*b); else if(t=='/') st.push(a/b); else if(t=='%') st.push(a%b); else if(t=='^') st.push(Math.pow(a,b)) } } return st[0] }
  const tokens = toTokens(expr), rpn = toRPN(tokens); return evalRPN(rpn)
}

/* =========================
   Load saved timetable on load
===========================*/
window.addEventListener('load', ()=>{
  const saved = localStorage.getItem('savedTimetable')
  if(saved) el('result').innerHTML = saved
  loadRecent()
  updateNotesCount()
})

/* =========================
   PWA Helper (already registered)
===========================*/
