// GET PDF FROM URL
const frame = document.getElementById("pdfFrame");
const loader = document.getElementById("loader");

const urlParams = new URLSearchParams(window.location.search);
const pdf = urlParams.get("file");

frame.src = pdf;

// Show loader until PDF loads
frame.onload = () => {
    loader.style.display = "none";
    frame.style.display = "block";
};

/* ==========================
   ZOOM 
==========================*/
let zoom = 1;

document.getElementById("zoomIn").onclick = () => {
    zoom += 0.1;
    frame.style.transform = `scale(${zoom})`;
    frame.style.transformOrigin = "top";
};
document.getElementById("zoomOut").onclick = () => {
    zoom = Math.max(0.6, zoom - 0.1);
    frame.style.transform = `scale(${zoom})`;
    frame.style.transformOrigin = "top";
};

/* ==========================
   FULLSCREEN
==========================*/
document.getElementById("fullscreenBtn").onclick = () => {
    if (!document.fullscreenElement) {
        frame.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

/* ==========================
   THEME
==========================*/
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeToggle.checked);
    localStorage.setItem("notesTheme", themeToggle.checked ? "dark" : "light");
});

// Load saved theme
const saved = localStorage.getItem("notesTheme");
if (saved === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
}
