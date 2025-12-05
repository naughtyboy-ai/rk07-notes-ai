// ------------------------------------
// DARK MODE SLIDER
// ------------------------------------
const modeToggle = document.getElementById("modeToggle");
modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", modeToggle.checked);
});

// ------------------------------------
// MOBILE MENU TOGGLE
// ------------------------------------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

// ------------------------------------
// PAGE NAVIGATION
// ------------------------------------
function goToClasses() {
    window.location.href = "classes.html";
}

function goToTimer() {
    window.location.href = "timer.html";
}

function openGmail() {
    window.location.href = "mailto:masumboy141@gmail.com";
}

// ------------------------------------
// 3D CARD HOVER
// ------------------------------------
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 20;
        const rotateX = ((y / rect.height) - 0.5) * -20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
});

// ------------------------------------
// "NEW" BADGE ANIMATION
// ------------------------------------
document.querySelectorAll(".badge-new").forEach(b => {
    setInterval(() => {
        b.classList.toggle("pulse");
    }, 900);
});

// ------------------------------------
// INTELLIGENT LOCAL FAQ CHATBOT
// ------------------------------------
const faq = {
    "notes": "You can find notes inside each Subject → Chapter section.",
    "class": "All classes are available on the Classes page.",
    "timer": "The study timer helps you track Hours, Minutes, Seconds & Milliseconds.",
    "dark mode": "Use the slider button at the top to switch between dark/light modes.",
    "contact": "You can contact the admin via direct Gmail button on Home."
};

const chatBox = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = sender;
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function reply(query) {
    query = query.toLowerCase();
    for (let key in faq) {
        if (query.includes(key)) return faq[key];
    }
    return "Sorry, I didn’t understand. Try words like: notes, class, timer, contact, dark mode.";
}

sendBtn.addEventListener("click", () => {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    addMessage(userMsg, "user");
    const botRes = reply(userMsg);
    addMessage(botRes, "bot");

    chatInput.value = "";
});

chatInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendBtn.click();
});

// ------------------------------------
// SMOOTH SCROLL
// ------------------------------------
document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-scroll");
        document.getElementById(id).scrollIntoView({
            behavior: "smooth"
        });
    });
});
