// THEME TOGGLE
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
};

// HOME BUTTON — SECTIONS OPEN
const homeBtn = document.getElementById("homeBtn");
const sections = document.getElementById("sections");

if(homeBtn){
    homeBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        sections.classList.toggle("show");
        sections.scrollIntoView({behavior:"smooth"});
    });
}

// ABOUT SCROLL
document.querySelectorAll('a[href="#about"]').forEach(link=>{
    link.addEventListener("click",e=>{
        e.preventDefault();
        document.getElementById("about").scrollIntoView({behavior:"smooth"});
    });
});
