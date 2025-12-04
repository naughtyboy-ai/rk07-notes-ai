// THEME TOGGLE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// ABOUT SCROLL BY NAVBAR LINK
document.querySelectorAll('a[href="#about"]').forEach(link => {
  link.onclick = (e) => {
    e.preventDefault();
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  };
});
