// PelotonSync — interacciones comunes
(function(){
  const root=document.documentElement;
  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  const saved=store.get('ps-theme');
  if(saved) root.dataset.theme=saved;
  document.addEventListener('DOMContentLoaded',init);

  function init(){
    // theme toggle
    const tb=document.querySelector('.theme-btn');
    const sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
    const paint=()=>{if(tb){tb.innerHTML=root.dataset.theme==='light'?moon:sun;tb.setAttribute('aria-label',root.dataset.theme==='light'?'Cambiar a modo oscuro':'Cambiar a modo claro')}};
    paint();
    tb&&tb.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';store.set('ps-theme',root.dataset.theme);paint();window.dispatchEvent(new Event('themechange'))});
    // mobile menu
    const nav=document.querySelector('.nav'),mb=document.querySelector('.menu-btn');
    mb&&mb.addEventListener('click',()=>nav.classList.toggle('open'));
    // progress
    const pr=document.querySelector('.progress');
    const onScroll=()=>{const h=document.documentElement;const p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);if(pr)pr.style.width=(p*100)+'%'};
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
    // reveal
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));
    // counters
    const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,dur=1400,t0=performance.now();
      const step=t=>{const k=Math.min(1,(t-t0)/dur),v=to*(1-Math.pow(1-k,3));el.textContent=v.toLocaleString('es-CO',{minimumFractionDigits:dec,maximumFractionDigits:dec});if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.5});
    document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
    // bars
    const bo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;bo.unobserve(e.target)}}),{threshold:.3});
    document.querySelectorAll('.bar i[data-w]').forEach(el=>bo.observe(el));
    // glow follows pointer
    document.querySelectorAll('.glow').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--gx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--gy',((e.clientY-r.top)/r.height*100)+'%')}));
    // tilt
    document.querySelectorAll('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`rotateY(${x*18}deg) rotateX(${-y*14}deg) translateZ(20px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
    cursor();
  }

  // Cursor "a rueda": bola volt adelante y dos aros que la siguen con retraso, como el logo.
  function cursor(){
    if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    document.body.classList.add('has-cursor');
    const mk=c=>{const d=document.createElement('div');d.className='cur '+c;document.body.appendChild(d);return d};
    const r2=mk('ring r2'),r1=mk('ring'),b=mk('ball');
    let mx=innerWidth/2,my=innerHeight/2;const p=[{x:mx,y:my},{x:mx,y:my},{x:mx,y:my}];
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
    document.addEventListener('pointerover',e=>{document.body.classList.toggle('hovering',!!e.target.closest('a,button,.ficha,.swatch,[data-hover]'))});
    (function loop(){p[0].x=mx;p[0].y=my;p[1].x+=(p[0].x-p[1].x)*.22;p[1].y+=(p[0].y-p[1].y)*.22;p[2].x+=(p[1].x-p[2].x)*.18;p[2].y+=(p[1].y-p[2].y)*.18;
      b.style.transform=`translate(${p[0].x}px,${p[0].y}px)`;
      r1.style.transform=`translate(${p[1].x}px,${p[1].y}px)`;r2.style.transform=`translate(${p[2].x}px,${p[2].y}px)`;requestAnimationFrame(loop)})();
  }
})();
