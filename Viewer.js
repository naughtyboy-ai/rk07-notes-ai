// viewer.js - simple robust PDF viewer
const params = new URLSearchParams(location.search);
const file = params.get('file');
const title = params.get('title') || (file ? file.split('/').pop() : 'Viewer');
document.getElementById('vTitle').innerText = title;

const frame = document.getElementById('pdfFrame');
if(file){
  frame.src = file;
  document.getElementById('download').href = file;
  document.getElementById('download').setAttribute('download', file.split('/').pop());
} else {
  document.getElementById('vTitle').innerText = 'No file specified';
}

// zoom
let z = 1;
document.getElementById('zoomIn').addEventListener('click', ()=> { z = Math.min(3, z+0.15); frame.style.transform = `scale(${z})`; frame.style.transformOrigin='top left'; });
document.getElementById('zoomOut').addEventListener('click', ()=> { z = Math.max(0.6, z-0.15); frame.style.transform = `scale(${z})`; });

// fullscreen
document.getElementById('fullscreen').addEventListener('click', ()=>{
  if(!document.fullscreenElement) frame.requestFullscreen?.();
  else document.exitFullscreen?.();
});

// keyboard navigation: + / -
document.addEventListener('keydown', e=>{
  if(e.key==='+'||e.key==='='){ z = Math.min(3, z+0.15); frame.style.transform = `scale(${z})`; }
  if(e.key==='-'){ z = Math.max(0.6, z-0.15); frame.style.transform = `scale(${z})`; }
});
