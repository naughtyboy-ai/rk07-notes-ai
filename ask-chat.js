// ask-chat.js — Smart tools engine (no external key required)
// Features: detect commands, open PDF/link, calendar modal, safe calculator, create/show/download notes, time/date

(() => {
  // Basic elements
  const chatWindow = document.getElementById('chatWindow');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const notesCount = document.getElementById('notesCount');

  // init
  updateNotesCount();
  addBotMsg("Hi Rohit 👋 — I'm your study assistant. Try commands like: 'open pdf ch1.pdf', 'calendar', 'calculate 23*7', 'create note: todo'.");

  // send handler
  sendBtn.addEventListener('click', onSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSend(); });

  // PUBLIC runCommand to call from Quick buttons
  window.runCommand = (text) => { input.value = text; onSend(); };

  // main send
  function onSend() {
    const raw = input.value.trim();
    if (!raw) return;
    addUserMsg(raw);
    input.value = '';
    handleCommand(raw);
  }

  // Message helpers
  function addUserMsg(text) {
    const d = document.createElement('div'); d.className = 'msg user'; d.textContent = text; chatWindow.appendChild(d); chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  function addBotMsg(text) {
    const d = document.createElement('div'); d.className = 'msg bot'; d.textContent = text; chatWindow.appendChild(d); chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // typing UI (returns element)
  function showTyping() {
    const el = document.createElement('div'); el.className = 'msg bot';
    const inner = document.createElement('div'); inner.className = 'typing'; inner.innerHTML = '<span></span><span></span><span></span>';
    el.appendChild(inner); chatWindow.appendChild(el); chatWindow.scrollTop = chatWindow.scrollHeight;
    return el;
  }

  // Basic naturalization
  function normalize(s) { return s.trim().toLowerCase(); }

  // Command dispatcher
  async function handleCommand(raw) {
    const cmd = normalize(raw);

    // Patterns
    if (cmd.startsWith('open pdf')) {
      // user can pass filename or full url
      const arg = raw.slice(8).trim();
      await doOpenPDF(arg);
      return;
    }

    if (cmd.startsWith('open link') || cmd.startsWith('open')) {
      // open link if valid url present after 'open link' or 'open'
      const url = raw.replace(/^open(link)?\s*/i, '').trim();
      if (isValidUrl(url)) {
        addBotMsg('Opening link...');
        window.open(url, '_blank');
      } else {
        addBotMsg('No valid URL found. Use: open link https://example.com');
      }
      return;
    }

    if (cmd === 'calendar' || cmd === 'show calendar') {
      showCalendarModal();
      return;
    }

    if (cmd.startsWith('calculate') || cmd.startsWith('calc') || cmd.match(/^[0-9\(\)]/)) {
      // allow variants: "calculate 2+3" or just "2+3"
      const expr = raw.replace(/^(calculate|calc)\s*/i, '');
      doCalculate(expr);
      return;
    }

    if (cmd === 'time' || cmd === 'date' || cmd==='what time' || cmd==='what is time') {
      const now = new Date();
      addBotMsg('Current date & time: ' + now.toLocaleString());
      return;
    }

    if (cmd.startsWith('create note:') || cmd.startsWith('create note')) {
      const note = raw.split(/create note:?\s*/i)[1] || '';
      if (!note) { addBotMsg('Please provide note text. Example: create note: Revise optics'); return; }
      saveNote(note);
      addBotMsg('Note saved ✔');
      return;
    }

    if (cmd === 'show notes' || cmd === 'notes' || cmd === 'view notes') {
      showNotesModal();
      return;
    }

    if (cmd === 'download notes' || cmd === 'export notes') {
      downloadNotesFile();
      return;
    }

    if (cmd.startsWith('delete note')) {
      // delete note #n or delete note: exact text
      const rest = raw.split(/delete note:?\s*/i)[1];
      if (!rest) { addBotMsg('Specify note number or exact text to delete. e.g., delete note 2'); return; }
      deleteNote(rest);
      return;
    }

    // If none of the tools matched -> fallback to conversational offline responder
    conversationalReply(raw);
  }

  // ---------------- TOOLS IMPLEMENTATION ----------------

  // 1) Open PDF handler (attempt to open local file path or remote url)
  async function doOpenPDF(arg) {
    if (!arg) { addBotMsg('Specify PDF filename or url, e.g., open pdf 12-phy-ch1.pdf or open pdf https://...'); return; }

    // if looks like url
    if (isValidUrl(arg)) {
      addBotMsg('Opening PDF link...');
      window.open(arg, '_blank');
      return;
    }
    // else assume local file in same folder
    const filename = arg;
    // If notes-viewer exists, open via notes-viewer
    addBotMsg('Opening PDF: ' + filename);
    // try notes-viewer.html?file=...
    const viewer = 'notes-viewer.html?file=' + encodeURIComponent(filename);
    // open in new tab (user can host files)
    window.open(viewer, '_blank');
  }

  // 2) Calendar modal
  function showCalendarModal() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay(); // 0..6 (Sun..Sat)
    const daysInMonth = new Date(year, month+1, 0).getDate();

    let html = `<h2>Calendar — ${today.toLocaleString(undefined, {month:'long'})} ${year}</h2>`;
    html += `<div>Today: ${today.toDateString()}</div>`;
    html += `<div class="calendar-grid" style="margin-top:10px">`;
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (let d of dayNames) html += `<div class="cal-day" style="font-weight:700">${d}</div>`;
    for (let i=0;i<startDay;i++) html += `<div class="cal-day"></div>`;
    for (let d=1; d<=daysInMonth; d++) {
      const cls = (d===today.getDate()) ? 'style="background:linear-gradient(90deg,#06b6d4,#0ee6c6);color:#021018;font-weight:700;border-radius:6px"' : '';
      html += `<div class="cal-day" ${cls}>${d}</div>`;
    }
    html += `</div>`;
    openModal(html);
  }

  // 3) Safe calculator
  function doCalculate(expr) {
    const safe = sanitizeMath(expr);
    if (!safe) { addBotMsg('Invalid expression. Only numbers and +-*/().%^ allowed. Example: calculate (12+3)*2'); return; }
    try {
      const result = evaluateSafe(safe);
      addBotMsg(`${expr} = ${result}`);
    } catch (e) {
      addBotMsg('Calculation error: ' + e.message);
    }
  }

  // safe math: only digits, operators, parentheses, decimal, spaces, ^ for power, % for mod
  function sanitizeMath(s) {
    if (!s) return null;
    // replace unicode × ÷ etc
    s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/—/g,'-').replace(/–/g,'-').replace(/×/g,'*');
    // allow only these chars
    if (/[^0-9+\-*/().%\^ \t]/.test(s)) return null;
    // prevent repeated dangerous sequences
    if (/[a-zA-Z]/.test(s)) return null;
    return s;
  }

  // evaluate math expression safely (no eval)
  function evaluateSafe(expr) {
    // implement simple parser: support + - * / % ^ and parentheses and decimals
    // convert ^ to Math.pow usage during parse by replacing a^b with pow(a,b) via algorithm
    // For simplicity, implement shunting-yard to RPN then eval
    const ops = {
      '+': {prec:1, assoc:'L'}, '-': {prec:1, assoc:'L'},
      '*': {prec:2, assoc:'L'}, '/': {prec:2, assoc:'L'}, '%': {prec:2, assoc:'L'},
      '^': {prec:3, assoc:'R'}
    };

    function toTokens(s) {
      const tokens = [];
      let num = '';
      for (let i=0;i<s.length;i++){
        const ch = s[i];
        if ((ch>='0'&&ch<='9') || ch=='.') { num += ch; continue; }
        if (ch === ' ' || ch === '\t') { if (num){ tokens.push(num); num=''; } continue; }
        if (num){ tokens.push(num); num=''; }
        if (ch in ops || ch==='(' || ch===')') tokens.push(ch);
        else throw new Error('Invalid char in expression');
      }
      if (num) tokens.push(num);
      return tokens;
    }

    function toRPN(tokens) {
      const out = [], stack = [];
      for (let t of tokens) {
        if (!isNaN(t)) out.push(t);
        else if (t in ops) {
          while (stack.length){
            const o2 = stack[stack.length-1];
            if (o2 in ops && ((ops[t].assoc==='L' && ops[t].prec <= ops[o2].prec) || (ops[t].assoc==='R' && ops[t].prec < ops[o2].prec))){
              out.push(stack.pop());
            } else break;
          }
          stack.push(t);
        } else if (t === '(') stack.push(t);
        else if (t === ')') {
          while (stack.length && stack[stack.length-1] !== '(') out.push(stack.pop());
          if (!stack.length) throw new Error('Mismatched parentheses');
          stack.pop();
        } else throw new Error('Unknown token ' + t);
      }
      while (stack.length) {
        const x = stack.pop();
        if (x==='('||x===')') throw new Error('Mismatched parentheses');
        out.push(x);
      }
      return out;
    }

    function evalRPN(rpn) {
      const st = [];
      for (let t of rpn){
        if (!isNaN(t)) st.push(parseFloat(t));
        else {
          const b = st.pop(); const a = st.pop();
          if (t === '+') st.push(a+b);
          else if (t === '-') st.push(a-b);
          else if (t === '*') st.push(a*b);
          else if (t === '/') st.push(a/b);
          else if (t === '%') st.push(a%b);
          else if (t === '^') st.push(Math.pow(a,b));
          else throw new Error('Unknown op ' + t);
        }
      }
      if (st.length !== 1) throw new Error('Invalid expression');
      return st[0];
    }

    const tokens = toTokens(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
  }

  // 4) Notes storage using localStorage
  function saveNote(text) {
    const notes = getNotes();
    notes.push({id: Date.now(), text, created: new Date().toISOString()});
    localStorage.setItem('rk_notes', JSON.stringify(notes));
    updateNotesCount();
  }

  function getNotes() {
    try { return JSON.parse(localStorage.getItem('rk_notes')||'[]'); } catch { return []; }
  }

  function updateNotesCount() {
    const n = getNotes().length;
    notesCount && (notesCount.textContent = 'Notes: ' + n);
  }

  function showNotesModal() {
    const notes = getNotes();
    let html = '<h2>Your Notes</h2>';
    if (!notes.length) html += '<div>No notes saved yet.</div>';
    else {
      html += '<ul style="margin-top:8px">';
      notes.forEach((nt, idx) => {
        html += `<li style="margin-bottom:8px"><strong>#${idx+1}</strong> ${escapeHtml(nt.text)} <div style="font-size:12px;color:#9fb7c7">saved: ${new Date(nt.created).toLocaleString()}</div></li>`;
      });
      html += '</ul>';
    }
    html += `<div style="margin-top:12px"><button onclick="closeModal();">Close</button> <button onclick="downloadNotesFile();">Download Notes</button></div>`;
    openModal(html);
  }

  function deleteNote(spec) {
    const notes = getNotes();
    // if spec is number
    if (/^\d+$/.test(spec.trim())) {
      const idx = parseInt(spec.trim(),10)-1;
      if (idx<0 || idx>=notes.length) { addBotMsg('Invalid note number'); return; }
      notes.splice(idx,1);
      localStorage.setItem('rk_notes', JSON.stringify(notes));
      updateNotesCount();
      addBotMsg('Note deleted');
      return;
    }
    // else try to delete text match
    const newNotes = notes.filter(n => n.text.toLowerCase() !== spec.toLowerCase());
    if (newNotes.length === notes.length) { addBotMsg('No matching note found'); return; }
    localStorage.setItem('rk_notes', JSON.stringify(newNotes));
    updateNotesCount();
    addBotMsg('Note deleted (matching text)');
  }

  function downloadNotesFile() {
    const notes = getNotes();
    if (!notes.length) { addBotMsg('No notes to download'); return; }
    const txt = notes.map((n,i)=>`#${i+1} [${new Date(n.created).toLocaleString()}]\n${n.text}\n\n`).join('');
    const blob = new Blob([txt], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'rohit_notes.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    addBotMsg('Notes downloaded ✔');
  }

  // 5) open modal helpers
  function openModal(innerHtml) {
    modalContent.innerHTML = innerHtml;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
  }
  window.closeModal = () => { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); modalContent.innerHTML=''; };

  // 6) URL validator
  function isValidUrl(s) {
    try { const u = new URL(s); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; }
  }

  // 7) Conversational fallback (simple offline knowledge + command hints)
  function conversationalReply(raw) {
    const typing = showTyping();
    setTimeout(()=> {
      typing.remove();
      const q = normalize(raw);
      // small rule-based conversational answers
      if (q.includes('how to open pdf') || q.includes('open pdf')) {
        addBotMsg("Use: open pdf <filename>  or open link <https://...> \nIf you uploaded PDFs to your website's folder, use the exact filename.");
        return;
      }
      if (q.includes('how to use timer') || q.includes('timer')) {
        addBotMsg("Open the Study Timer page (Top menu) or ask 'start timer 25' — feature available in Study Timer page.");
        return;
      }
      if (q.includes('contact') || q.includes('support')) {
        addBotMsg("Contact via email: masumboy141@gmail.com — the Contact button opens Gmail compose.");
        return;
      }
      // fallback small talk
      if (q.includes('hello') || q.includes('hi')) { addBotMsg('Hello! How can I help with notes, PDFs, calendar or calculations?'); return; }
      if (q.includes('thanks') || q.includes('thank')) { addBotMsg('You’re welcome!'); return; }

      // default helpful hint
      addBotMsg("I can open PDFs, show calendar, calculate expressions, save notes, and open links. Try commands: 'open pdf ch1.pdf', 'calendar', 'calculate 23*4', 'create note: Revise optics'.");
    }, 700);
  }

  // utility: escape for display
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]); }

  // sanitize user-provided math and evaluate using safe parser
  // evaluateSafe and sanitizeMath are defined above
  // To avoid duplication in this single-file engine, define them now:

  function sanitizeMath(s) {
    if (!s) return null;
    s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/—/g,'-').replace(/–/g,'-');
    if (/[^0-9+\-*/().%\^ \t]/.test(s)) return null;
    if (/[a-zA-Z]/.test(s)) return null;
    return s;
  }
  function evaluateSafe(expr) {
    // same shunting-yard implementation as used above
    const ops = {
      '+': {prec:1, assoc:'L'}, '-': {prec:1, assoc:'L'},
      '*': {prec:2, assoc:'L'}, '/': {prec:2, assoc:'L'}, '%': {prec:2, assoc:'L'},
      '^': {prec:3, assoc:'R'}
    };
    function toTokens(s) {
      const tokens = []; let num = '';
      for (let i=0;i<s.length;i++){
        const ch = s[i];
        if ((ch>='0'&&ch<='9') || ch=='.') { num += ch; continue; }
        if (ch === ' ' || ch === '\t') { if (num){ tokens.push(num); num=''; } continue; }
        if (num){ tokens.push(num); num=''; }
        if (ch in ops || ch==='(' || ch===')') tokens.push(ch);
        else throw new Error('Invalid char in expression');
      }
      if (num) tokens.push(num);
      return tokens;
    }
    function toRPN(tokens) {
      const out = [], stack = [];
      for (let t of tokens) {
        if (!isNaN(t)) out.push(t);
        else if (t in ops) {
          while (stack.length){
            const o2 = stack[stack.length-1];
            if (o2 in ops && ((ops[t].assoc==='L' && ops[t].prec <= ops[o2].prec) || (ops[t].assoc==='R' && ops[t].prec < ops[o2].prec))){
              out.push(stack.pop());
            } else break;
          }
          stack.push(t);
        } else if (t === '(') stack.push(t);
        else if (t === ')') {
          while (stack.length && stack[stack.length-1] !== '(') out.push(stack.pop());
          if (!stack.length) throw new Error('Mismatched parentheses');
          stack.pop();
        } else throw new Error('Unknown token ' + t);
      }
      while (stack.length) {
        const x = stack.pop();
        if (x==='('||x===')') throw new Error('Mismatched parentheses');
        out.push(x);
      }
      return out;
    }
    function evalRPN(rpn) {
      const st = [];
      for (let t of rpn){
        if (!isNaN(t)) st.push(parseFloat(t));
        else {
          const b = st.pop(); const a = st.pop();
          if (t === '+') st.push(a+b);
          else if (t === '-') st.push(a-b);
          else if (t === '*') st.push(a*b);
          else if (t === '/') st.push(a/b);
          else if (t === '%') st.push(a%b);
          else if (t === '^') st.push(Math.pow(a,b));
          else throw new Error('Unknown op ' + t);
        }
      }
      if (st.length !== 1) throw new Error('Invalid expression');
      return st[0];
    }
    const tokens = toTokens(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
  }

  // Ensure calculator uses these
  function doCalculate(expr) {
    const safe = sanitizeMath(expr);
    if (!safe) { addBotMsg('Invalid expression. Only numbers and +-*/().%^ allowed. Example: calculate (12+3)*2'); return; }
    try {
      const result = evaluateSafe(safe);
      addBotMsg(`${expr} = ${result}`);
    } catch (e) {
      addBotMsg('Calculation error: ' + e.message);
    }
  }

  // 8) Utility escape
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]); }

})();

// SMART OFFLINE CHATBOT JS
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");
const chatBody = document.getElementById("chatBody");

// --- Add message to chat ---
function addMessage(text, sender="bot") {
    const div = document.createElement("div");
    div.className = `msg ${sender}`;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// --- Typing animation ---
function showTyping() {
    const div = document.createElement("div");
    div.className = "typing bot";
    div.id = "typingDot";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
function removeTyping() {
    const dot = document.getElementById("typingDot");
    if (dot) dot.remove();
}

// --- Math Solver ---
function solveMath(expr) {
    try {
        expr = expr
            .replace(/sin/gi, "Math.sin")
            .replace(/cos/gi, "Math.cos")
            .replace(/tan/gi, "Math.tan")
            .replace(/log/gi, "Math.log10")
            .replace(/√/g, "Math.sqrt")
            .replace(/\^/g, "**");

        // Convert degrees to radians for trig
        expr = expr.replace(/Math\.(sin|cos|tan)\((.*?)\)/g,
            (m, fn, val) => `Math.${fn}(((${val}) * Math.PI) / 180)`
        );

        return eval(expr);
    } catch {
        return null;
    }
}

// --- Command Handler ---
function smartReply(q) {
    q = q.toLowerCase();

    // PDF open
    if (q.includes("open") && q.includes("pdf")) {
        return "Opening PDF… (Aap filename likho, main open kar dunga)";
    }

    // Page open
    if (q.includes("open") && q.includes("page")) {
        return "Page khola ja raha hai…";
    }

    // Calendar
    if (q.includes("calendar")) {
        const date = new Date();
        return `Aaj ki date: ${date.toDateString()}`;
    }

    // Math solve check
    const mathResult = solveMath(q);
    if (mathResult !== null) {
        return `Answer = ${mathResult}`;
    }

    // Default
    return "Samajh gaya! 👍 Aap aur kuch puch sakte ho.";
}

// --- Main Send Handler ---
sendBtn.onclick = () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTyping();

    setTimeout(() => {
        removeTyping();
        addMessage(smartReply(text), "bot");
    }, 600);
};
