// NAVIGATION
function goto(page){ window.location.href = page; }

// HOME BUTTON POPUP
document.getElementById("homeBtn").onclick = () => {
  document.getElementById("homeMenu").classList.toggle("show");
};

// SIDEMENU
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

document.getElementById("menuBtn").onclick = () => {
  sideMenu.classList.add("open");
  overlay.classList.add("show");
};
overlay.onclick = () => {
  sideMenu.classList.remove("open");
  overlay.classList.remove("show");
};

// THEME SWITCH
const themeSwitch = document.getElementById("themeSwitch");
if(localStorage.theme === "dark"){
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}
themeSwitch.onchange = () => {
  if(themeSwitch.checked){
    document.body.classList.add("dark");
    localStorage.theme="dark";
  } else {
    document.body.classList.remove("dark");
    localStorage.theme="light";
  }
};

// YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// MOTIVATION
const quotes = [
"Success = Consistency × Hard Work!",
"Winners are not born, they are built!",
"Focus on progress, not perfection!",
"Small steps every day = big success!",
"Discipline beats motivation every time!",
"Your only limit is your mind!",
"Don’t stop until you're proud!",
"Every expert was once a beginner!",
"The best view comes after the hardest climb!",
"Push yourself — no one else will!",
];
function showMotivation(){
  let q = quotes[Math.floor(Math.random()*quotes.length)];
  document.getElementById("motBox").textContent = q;
}

// BACKGROUND CANVAS ANIMATION
const c = document.getElementById("bgCanvas");
const ctx = c.getContext("2d");
c.width = innerWidth; c.height = innerHeight;
let dots = [];
for(let i=0;i<30;i++){
  dots.push({x:Math.random()*c.width,y:Math.random()*c.height,r:2+Math.random()*2,dx:(Math.random()-0.5)/2,dy:(Math.random()-0.5)/2});
}
function animate(){
  ctx.clearRect(0,0,c.width,c.height);
  dots.forEach(d=>{
    ctx.beginPath();
    ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,0.25)";
    ctx.fill();
    d.x+=d.dx; d.y+=d.dy;
    if(d.x<0||d.x>c.width) d.dx*=-1;
    if(d.y<0||d.y>c.height) d.dy*=-1;
  });
  requestAnimationFrame(animate);
}
animate();

// WAVE BOTTOM
const wavePathBottom = document.getElementById("waveBottomPath");
let t=0;
function animateWave(){
  t+=0.04;
  let d="M0 60 ";
  for(let x=0;x<=1440;x+=20){
    let y=60 + Math.sin(x*0.01+t)*12;
    d+=`L ${x} ${y} `;
  }
  d+="L 1440 120 L 0 120 Z";
  wavePathBottom.setAttribute("d", d);
  requestAnimationFrame(animateWave);
}
animateWave();
