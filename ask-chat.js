// ---- Local FAQ (AI जैसा reply) ----
const FAQ = [
    { q: "open pdf", a: "Go to Classes → Select Subject → Click any chapter to open its PDF." },
    { q: "timer", a: "Study Timer आपको Pomodoro, Stopwatch और Custom Timer देता है।" },
    { q: "contact", a: "Support के लिए email करें: masumboy141@gmail.com" },
    { q: "tests", a: "Tests page में chapter-wise और full-syllabus MCQs available हैं।" },
    { q: "notes", a: "All notes are organized class-wise and subject-wise in the Classes section." }
];

const chatBody = document.getElementById("chatBody");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");

function addMessage(text, type) {
    let div = document.createElement("div");
    div.className = "msg " + type;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addTyping() {
    let wrap = document.createElement("div");
    wrap.className = "typing bot";
    wrap.id = "typing";
    wrap.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
    let t = document.getElementById("typing");
    if (t) t.remove();
}

function botReply(msg) {
    msg = msg.toLowerCase().trim();

    for (let f of FAQ) {
        if (msg.includes(f.q)) return f.a;
    }
    return "Sorry, I didn’t understand 🙃 Try: open pdf, timer, tests, contact.";
}

sendBtn.onclick = () => {
    let text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    addTyping();

    setTimeout(() => {
        removeTyping();
        addMessage(botReply(text), "bot");
    }, 1000);
};
