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
    const apply=()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';store.set('ps-theme',root.dataset.theme);paint();window.dispatchEvent(new Event('themechange'))};
    // cambio de tema suave: un círculo que se abre desde el botón (o fundido si el navegador no lo soporta)
    tb&&tb.addEventListener('click',e=>{
      const r=tb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        const vt=document.startViewTransition(apply);
        vt.ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${R}px at ${x}px ${y}px)`]},{duration:1100,easing:'cubic-bezier(.65,0,.25,1)',pseudoElement:'::view-transition-new(root)'}));
      }else{root.classList.add('theme-anim');apply();setTimeout(()=>root.classList.remove('theme-anim'),1000)}
    });
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
    riders();
  }

  // ---------- Grega en bici (SVG), con el uniforme PelotonSync ----------
  const KITS={team:['#0E100E','#CCFF00','#CCFF00','#F3F1EA'],ruta:['#3FC8E4','#0E100E','#3FC8E4','#3FC8E4'],rend:['#FF6A2B','#0E100E','#FF6A2B','#FF6A2B'],agenda:['#8E6BFF','#CCFF00','#8E6BFF','#8E6BFF'],equipo:['#5BD68A','#0E100E','#5BD68A','#5BD68A']};
  let uid=0;
  function gregaSVG(kit){const [j,s,f,hc]=KITS[kit]||KITS.team;const id='g'+(uid++);
    return `<svg viewBox="0 0 220 160" aria-hidden="true"><defs><radialGradient id="${id}b" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#F4FFB0"/><stop offset=".5" stop-color="#CCFF00"/><stop offset="1" stop-color="#7FA300"/></radialGradient><clipPath id="${id}c"><circle cx="112" cy="50" r="30"/></clipPath></defs>
    <ellipse cx="110" cy="152" rx="90" ry="5" fill="rgba(0,0,0,.18)"/>
    <g class="w" data-cx="48" data-cy="118"><circle cx="48" cy="118" r="30" fill="none" stroke="#4F534E" stroke-width="7"/><path class="sp" d="M48 92V144M22 118H74M30 100L66 136M66 100L30 136" stroke="#4F534E" stroke-width="1.4"/></g>
    <g class="w" data-cx="170" data-cy="118"><circle cx="170" cy="118" r="30" fill="none" stroke="#A9ADA6" stroke-width="7"/><path class="sp" d="M170 92V144M144 118H196M152 100L188 136M188 100L152 136" stroke="#A9ADA6" stroke-width="1.4"/></g>
    <g fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M48 118L104 114L86 74L150 72L104 114M48 118L86 74M150 72L170 118M150 72L158 58"/></g>
    <path d="M150 60H166" stroke="#0E100E" stroke-width="5" stroke-linecap="round"/><path d="M76 72H96" stroke="#0E100E" stroke-width="6" stroke-linecap="round"/>
    <polyline class="leg1" fill="none" stroke="#A9ADA6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline class="leg2" fill="none" stroke="#6b7066" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <line class="arm" x1="128" y1="62" x2="160" y2="60" stroke="#0E100E" stroke-width="5" stroke-linecap="round"/>
    <g class="bd"><circle cx="112" cy="50" r="31.5" fill="none" stroke="rgba(243,241,234,.35)" stroke-width="1.5"/><circle cx="112" cy="50" r="30" fill="url(#${id}b)"/>
    <g clip-path="url(#${id}c)"><rect x="70" y="63" width="90" height="40" fill="${j}"/><rect x="70" y="64" width="90" height="4" fill="${s}"/>
    <g transform="translate(101 70.5) scale(.15)"><circle cx="36" cy="36" r="26" fill="none" stroke="${s}" stroke-width="9"/><circle cx="68" cy="36" r="26" fill="none" stroke="${s}" stroke-width="9"/><circle cx="100" cy="36" r="28" fill="${s}"/></g></g>
    <path d="M88 31Q98 15 120 17Q138 20 140 31Z" fill="${hc}"/><path d="M102 21L106 28M114 18L116 27M127 19L127 27" stroke="rgba(0,0,0,.3)" stroke-width="2"/>
    <rect class="eye" x="121" y="38" width="5" height="12" rx="2.5" fill="#0E100E"/><rect class="eye" x="131" y="38" width="5" height="12" rx="2.5" fill="#0E100E"/>
    <circle cx="101" cy="42" r="4" fill="#fff" opacity=".7"/></g></svg>`}
  const live=[];
  function riders(){document.querySelectorAll('.gr').forEach(el=>{el.innerHTML=gregaSVG(el.dataset.kit);live.push({el,a:Math.random()*6,sp:parseFloat(el.dataset.speed||'1'),l1:el.querySelector('.leg1'),l2:el.querySelector('.leg2'),ws:el.querySelectorAll('.w'),bd:el.querySelector('.bd'),eyes:el.querySelectorAll('.eye')})});
    if(!live.length)return;const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const legPts=(a)=>{const px=104+Math.cos(a)*13,py=114+Math.sin(a)*13,hx=100,hy=74,kx=(hx+px)/2+12,ky=(hy+py)/2-4;return `${hx},${hy} ${kx},${ky} ${px},${py}`};
    (function loop(t){live.forEach(r=>{if(!still)r.a+=.09*r.sp;const b=Math.abs(Math.sin(r.a))*2;
      r.l1.setAttribute('points',legPts(r.a));r.l2.setAttribute('points',legPts(r.a+Math.PI));
      r.ws.forEach(w=>w.querySelector('.sp').setAttribute('transform',`rotate(${r.a*60} ${w.dataset.cx} ${w.dataset.cy})`));
      r.bd.setAttribute('transform',`translate(0 ${b})`);const bl=((t/1000+r.a*.1)%4)<.12;r.eyes.forEach(e=>e.setAttribute('transform',bl?'translate(0 5) scale(1 .2)':''))});requestAnimationFrame(loop)})(0);
    // carril al final de cada página: Grega cruza la pantalla según el scroll
    const lane=document.querySelector('.ride-lane');if(lane){const gs=lane.querySelectorAll('.gr');const mv=()=>{const h=document.documentElement,p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);gs.forEach((g,i)=>g.style.transform=`translateX(${(p*(lane.clientWidth+260))-260-i*150}px)`)};addEventListener('scroll',mv,{passive:true});mv()}
    // acceso: Grega llega rodando
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('go');io.unobserve(e.target)}}),{threshold:.35});document.querySelectorAll('.access').forEach(a=>io.observe(a));
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
