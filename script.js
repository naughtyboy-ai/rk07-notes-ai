/* ==========================================================
   DARK MODE TOGGLE (Auto Save)
===========================================================*/
const modeToggle = document.getElementById("modeToggle");

// Load previous theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    if (modeToggle) modeToggle.checked = true;
}

modeToggle?.addEventListener("change", () => {
    const isDark = modeToggle.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ==========================================================
   SIDE MENU
===========================================================*/
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const menuBtn2 = document.getElementById("menuBtn");

function openMenu() {
    sideMenu?.classList.add("open");
    overlay?.classList.add("show");
}
function closeMenu() {
    sideMenu?.classList.remove("open");
    overlay?.classList.remove("show");
}

menuBtn2?.addEventListener("click", openMenu);
overlay?.addEventListener("click", closeMenu);

/* ==========================================================
   PAGE NAVIGATION
===========================================================*/
function goto(page) {
    window.location.href = page;
}

/* ==========================================================
   3D CARD EFFECT
===========================================================*/
document.querySelectorAll(".card3d").forEach(card => {

    let rect = null;
    card.addEventListener("mouseenter", () => {
        rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", e => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 20;
        const rotateX = ((y / rect.height) - 0.5) * -20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
});

/* ==========================================================
   NEW BADGE PULSE (Efficient)
===========================================================*/
document.querySelectorAll(".badge.new").forEach(b => {
    b.style.animation = "pulseEffect 1.2s infinite";
});

/* ==========================================================
   CANVAS BACKGROUND ANIMATION (Optimized)
===========================================================*/
const canvas = document.getElementById("bgCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const dots = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
    }));

    function animateDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.fill();

            dot.x += dot.dx;
            dot.y += dot.dy;

            if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
            if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;
        });

        requestAnimationFrame(animateDots);
    }
    animateDots();
}

/* ==========================================================
   TOP WAVE ANIMATION
===========================================================*/
const wavePath = document.getElementById("wavePath");
let waveT = 0;

function animateWave() {
    if (!wavePath) return;

    waveT += 0.03;
    let d = "M0 60 ";

    for (let i = 0; i <= innerWidth; i += 40) {
        d += `Q ${i + 20} ${60 + Math.sin((i / 100) + waveT) * 20} ${i + 40} 60 `;
    }

    wavePath.setAttribute("d", d + `V120 H0 Z`);
    requestAnimationFrame(animateWave);
}
animateWave();

/* ==========================================================
   BOTTOM WAVE ANIMATION
===========================================================*/
const bottomWavePath = document.getElementById("bottomWavePath");
let waveB = 0;

function animateBottomWave() {
    if (!bottomWavePath) return;

    waveB += 0.03;
    let path = "M0 0 ";

    for (let x = 0; x <= innerWidth; x += 20) {
        let y = 20 + Math.sin(x * 0.01 + waveB) * 10;
        path += `L ${x} ${y} `;
    }

    bottomWavePath.setAttribute("d", path + `L ${innerWidth} 120 L 0 120 Z`);
    requestAnimationFrame(animateBottomWave);
}
animateBottomWave();

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
    chatWidget?.classList.add("open");
}
function closeChat() {
    chatWidget?.classList.remove("open");
}

openChatBtn?.addEventListener("click", openChat);
closeChatBtn?.addEventListener("click", closeChat);

/* ---- Load local FAQ ---- */
let FAQ = [];
try {
    FAQ = JSON.parse(document.getElementById("faqData")?.textContent || "[]");
} catch {
    FAQ = [];
}

function addChatMsg(text, sender) {
    if (!chatBody) return;
    const div = document.createElement("div");
    div.className = sender === "bot" ? "bot-msg" : "user-msg";
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getAnswer(q) {
    q = q.toLowerCase();

    for (let item of FAQ) {
        if (q.includes(item.q.toLowerCase())) return item.a;
    }
    return "Sorry, I didn’t understand that. Try: pdf, timer, subjects, tests, support.";
}

chatSendBtn?.addEventListener("click", () => {
    const msg = chatInput2.value.trim();
    if (!msg) return;

    addChatMsg(msg, "user");
    setTimeout(() => addChatMsg(getAnswer(msg), "bot"), 300);

    chatInput2.value = "";
});

chatInput2?.addEventListener("keypress", e => {
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
   AUTO YEAR
===========================================================*/
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
