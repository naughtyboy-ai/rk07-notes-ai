// Small helpers: fill year and add simple motion for profile on hover
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  ['year','year2','year3','year4'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.textContent = y;
  });

  // subtle profile hover par glow
  const profile = document.querySelector('.profile');
  if(profile){
    profile.addEventListener('mouseenter', ()=> profile.style.transform = 'scale(1.06) rotate(-3deg)');
    profile.addEventListener('mouseleave', ()=> profile.style.transform = 'scale(1) rotate(0deg)');
    profile.style.transition = 'transform 240ms cubic-bezier(.2,.9,.3,1)';
  }

  // accessibility: reduce motion respect
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    document.querySelectorAll('*').forEach(el => el.style.animation = 'none');
  }
});
