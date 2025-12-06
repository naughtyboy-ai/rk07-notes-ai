// ---------------------------
//   FREE PUBLIC AI (NO KEY)
// ---------------------------
const API_URL = "https://api.deepseek.com/v1/chat/completions";

// Chat elements
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("chatSend");

function addMessage(text, sender) {
    let div = document.createElement("div");
    div.className = "msg " + sender;
    div.innerHTML = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Typing animation
function showTyping() {
    let div = document.createElement("div");
    div.className = "typing bot";
    div.id = "typing";
    div.innerHTML = `<span></span><span></span><span></span>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTyping() {
    let t = document.getElementById("typing");
    if (t) t.remove();
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

async function sendMessage() {
    let text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTyping();

    try {
        let res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: text }]
            })
        });

        let data = await res.json();
        hideTyping();

        let reply = data.choices?.[0]?.message?.content || "⚠ Error in reply";
        addMessage(reply, "bot");

    } catch (err) {
        hideTyping();
        addMessage("❌ Network Error: " + err.message, "bot");
    }
}
