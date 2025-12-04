/* PAGE NAVIGATION */
function goto(page) {
    window.location.href = page;
}

/* DARK / LIGHT MODE */
function toggleMode() {
    document.body.classList.toggle("light");
}

/* SEARCH CHAPTERS */
function searchChapter() {
    let input = document.getElementById("search").value.toLowerCase();
    let boxes = document.getElementsByClassName("box");

    for (let b of boxes) {
        let text = b.innerText.toLowerCase();
        b.style.display = text.includes(input) ? "block" : "none";
    }
}

/* STUDY TIMER */
let timer, sec = 0;

function openTimer() {
    document.getElementById("timerBox").style.display = "block";
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(()=>{
        sec++;
        document.getElementById("time").innerText = sec + " sec";
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
