function goto(pg) {
    window.location.href = pg;
}

function toggleMode() {
    document.body.classList.toggle("light");
}

let sec = 0, timer;

function openTimer() {
    document.getElementById("timerBox").style.display = "block";
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(()=>{
        sec++;
        document.getElementById("time").innerText = sec+" sec";
    },1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    sec = 0;
    document.getElementById("time").innerText = "0 sec";
    clearInterval(timer);
}
const themeSwitch = document.getElementById("themeSwitch");

themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    themeSwitch.checked = true;
    document.documentElement.setAttribute("data-theme", "dark");
}
