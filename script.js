/* ==========================================================
   THEME SWITCH
===========================================================*/
const themeSwitch = document.getElementById("themeSwitch");
if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeSwitch.checked);
    localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
  });

  // load theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
  }
}

/* ==========================================================
   SIDE MENU
===========================================================*/
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const menuBtn2 = document.getElementById("menuBtn");

function openMenu() {
  sideMenu.classList.add("open");
  overlay.classList.add("show");
}
function closeMenu() {
  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
}

menuBtn2?.addEventListener("click", openMenu);
overlay?.addEventListener("click", closeMenu);

/* ==========================================================
   GLOBAL NAVIGATION
===========================================================*/
function goto(page) {
  window.location.href = page;
}

/* ==========================================================
   3D CARD HOVER EFFECT
===========================================================*/
document.querySelectorAll(".card3d").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
  });
});

/* ==========================================================
   "NEW" BADGE PULSE
===========================================================*/
document.querySelectorAll(".badge.new").forEach(b => {
  setInterval(() => b.classList.toggle("pulse"), 1000);
});

/* ==========================================================
   BACKGROUND CANVAS ANIMATION
===========================================================*/
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

let dots = [];
for (let i = 0; i < 35; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6
  });
}

function animateDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fill();

    d.x += d.dx;
    d.y += d.dy;

    if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.dy *= -1;
  });

  requestAnimationFrame(animateDots);
}
animateDots();

/* ==========================================================
   WAVE ANIMATION
===========================================================*/
const wavePath = document.getElementById("wavePath");
let w = 0;

function animateWave() {
  w += 0.03;

  let d = "M0 60 ";
  for (let i = 0; i <= 1440; i += 40) {
    d += `Q ${i + 20} ${60 + Math.sin((i / 100) + w) * 20} ${i + 40} 60 `;
  }
  d += "V 120 H 0 Z";

  wavePath.setAttribute("d", d);

  requestAnimationFrame(animateWave);
}
animateWave();
<script>
// -------------------------------
//  Bottom Wave Animation
// -------------------------------
const bottomWavePath = document.getElementById("bottomWavePath");
let t2 = 0;

function animateBottomWave() {
  t2 += 0.03;
  let path = "M0 0 ";

  for (let x = 0; x <= 1440; x += 20) {
    let y = 20 + Math.sin(x * 0.01 + t2) * 10;
    path += `L ${x} ${y} `;
  }

  path += "L 1440 120 L 0 120 Z";
  bottomWavePath.setAttribute("d", path);

  requestAnimationFrame(animateBottomWave);
}
animateBottomWave();
</script>
/* ==========================================================
   CHAT WIDGET
===========================================================*/
const chatWidget = document.getElementById("chatWidget");
const openChatBtn = document.getElementById("openChatBtn");
const closeChatBtn = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const chatInput2 = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSend");

function openChat() {
  chatWidget.setAttribute("aria-hidden", "false");
}
function closeChat() {
  chatWidget.setAttribute("aria-hidden", "true");
}

openChatBtn?.addEventListener("click", openChat);
closeChatBtn?.addEventListener("click", closeChat);

/* -------- Load local FAQ JSON -------- */
let FAQ = [];
try {
  FAQ = JSON.parse(document.getElementById("faqData").textContent);
} catch {
  FAQ = [];
}

function addChatMsg(text, sender) {
  const div = document.createElement("div");
  div.className = sender === "bot" ? "bot-msg" : "user-msg";
  div.innerText = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getAnswer(q) {
  q = q.toLowerCase();

  for (let item of FAQ) {
    if (q.includes(item.q)) return item.a;
  }
  return "Sorry, I didn’t understand that. Try: pdf, timer, subjects, tests, support.";
}

chatSendBtn.addEventListener("click", () => {
  const msg = chatInput2.value.trim();
  if (!msg) return;

  addChatMsg(msg, "user");
  addChatMsg(getAnswer(msg), "bot");
  chatInput2.value = "";
});

chatInput2.addEventListener("keypress", e => {
  if (e.key === "Enter") chatSendBtn.click();
});

/* ==========================================================
   MOTIVATION POPUP
===========================================================*/
function showMotivation() {
  alert([
    "🔥 Hard work beats talent!",
    "📚 Study now, shine later!",
    "🏆 Success = Consistency!",
    "💪 Small steps → Big results!"
  ][Math.floor(Math.random() * 4)]);
}

/* ==========================================================
   SET YEAR (FOOTER)
===========================================================*/
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
