/* =====================================================
   GLOBAL: THEME TOGGLE
===================================================== */
const themeButton = document.getElementById("themeToggle");

if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light");
    });
}

/* =====================================================
   HOME PAGE → ABOUT BUTTON SCROLL
===================================================== */
const aboutLink = document.querySelector('a[href="#about"]');

if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            e.preventDefault();
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

/* =====================================================
   CHAPTER PAGE → SEARCH FILTER
===================================================== */
const searchInput = document.getElementById("searchBox");
const chapterItems = document.querySelectorAll(".chapter");

if (searchInput && chapterItems.length > 0) {
    searchInput.addEventListener("keyup", () => {
        const filter = searchInput.value.toLowerCase();

        chapterItems.forEach(ch => {
            const text = ch.innerText.toLowerCase();
            ch.style.display = text.includes(filter) ? "block" : "none";
        });
    });
}

/* =====================================================
   AUTO PAGE CHECKER (DEBUG SAFE)
===================================================== */
console.log("Script Loaded Successfully: Page Active =", window.location.pathname);
