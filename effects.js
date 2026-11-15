// Efectos de movimiento: intro, scroll suave, texto que sube, parallax, historias fijas, scroll horizontal y botones magnéticos.
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Intro ----------
  function intro(done){
    const el=document.getElementById('intro');
    if(!el||document.documentElement.classList.contains('no-intro')){done();return}
    document.documentElement.style.overflow='hidden';
    const lines=el.querySelector('.lines');
    for(let i=0;i<14;i++){const s=document.createElement('i');s.style.top=(20+Math.random()*60)+'%';s.style.width=(10+Math.random()*30)+'vw';s.style.animationDelay=(.2+Math.random()*1.1)+'s';lines.appendChild(s)}
    const c=el.querySelector('.count');const t0=performance.now(),D=reduce?300:2600;
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;try{sessionStorage.setItem('ps-intro','1')}catch(e){}el.classList.add('out');document.documentElement.style.overflow='';setTimeout(()=>{el.remove()},1100);done()};
    (function tick(t){const k=Math.min(1,(t-t0)/D);c.textContent=String(Math.round(k*100)).padStart(3,'0');if(k<1&&!finished)requestAnimationFrame(tick);else setTimeout(finish,350)})(t0);
    el.querySelector('.skip').addEventListener('click',finish);
  }

  // ---------- Partir texto en palabras ----------
  function splitWords(el,cls){
    const walk=n=>{[...n.childNodes].forEach(ch=>{
      if(ch.nodeType===3){const parts=ch.textContent.split(/(\s+)/);const frag=document.createDocumentFragment();
        parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}
          const o=document.createElement('span');o.className=cls;
          if(cls==='w'){const i=document.createElement('span');i.textContent=p;o.appendChild(i)}else o.textContent=p;frag.appendChild(o)});
        ch.replaceWith(frag)}
      else if(ch.nodeType===1&&ch.tagName!=='BR'&&!ch.classList.contains('tag')&&ch.tagName!=='SUP')walk(ch)})};
    walk(el);
  }

  function start(){
    const G=window.gsap,ST=window.ScrollTrigger;
    if(!G||!ST||reduce){document.querySelectorAll('.scrub-text .sw').forEach(s=>s.style.opacity=1);return}
    G.registerPlugin(ST);
    // scroll suave
    if(window.Lenis){const lenis=new Lenis({lerp:.09,smoothWheel:true});window.__lenis=lenis;lenis.on('scroll',ST.update);G.ticker.add(t=>lenis.raf(t*1000));G.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-80})}}));}
    // títulos que suben palabra por palabra
    const introOn=!!document.getElementById('intro')&&!document.documentElement.classList.contains('no-intro');
    document.querySelectorAll('h1,h2').forEach(h=>{if(h.closest('#intro'))return;h.classList.remove('rv');h.classList.add('in');splitWords(h,'w');
      const first=introOn&&h.getBoundingClientRect().top<innerHeight;
      G.from(h.querySelectorAll('.w>span'),{yPercent:115,rotate:4,duration:1.1,ease:'expo.out',stagger:.045,delay:first?2.9:0,scrollTrigger:{trigger:h,start:'top 88%'}})});
    // texto que se enciende con el scroll
    document.querySelectorAll('.scrub-text').forEach(p=>{G.to(p.querySelectorAll('.sw'),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:p,start:'top 80%',end:'bottom 45%',scrub:true}})});
    // parallax
    document.querySelectorAll('.photo img,[data-speed]').forEach(img=>{const s=parseFloat(img.dataset.speed||'1');G.fromTo(img,{yPercent:-8*s},{yPercent:8*s,ease:'none',scrollTrigger:{trigger:img.closest('.photo')||img,start:'top bottom',end:'bottom top',scrub:true}})});
    // imágenes que se abren
    document.querySelectorAll('.reveal-img').forEach(r=>G.to(r,{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:r,start:'top 85%',end:'top 15%',scrub:true}}));
    // scroll horizontal fijo
    const mm=G.matchMedia();
    mm.add('(min-width: 901px)',()=>{document.querySelectorAll('.hs').forEach(sec=>{const tr=sec.querySelector('.hs-track');const dist=()=>tr.scrollWidth-innerWidth+56;
      G.to(tr,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:sec,pin:true,scrub:1,start:'center center',end:()=>'+='+dist(),invalidateOnRefresh:true}})})});
    // velocidad de la cinta
    const mq=document.querySelector('.marquee .track');if(mq){let skew=0;ST.create({onUpdate:self=>{const v=G.utils.clamp(-12,12,self.getVelocity()/220);if(Math.abs(v)>Math.abs(skew))skew=v;}});G.ticker.add(()=>{skew*=.9;mq.parentElement.style.transform=`skewX(${-skew}deg)`})}
    // celulares que flotan distinto
    document.querySelectorAll('.phones-row .phone').forEach((p,i)=>G.fromTo(p,{y:60+i*30},{y:-40-i*20,ease:'none',scrollTrigger:{trigger:p.parentElement,start:'top bottom',end:'bottom top',scrub:true}}));
    setTimeout(()=>ST.refresh(),600);
  }

  // botones magnéticos
  function magnetic(){if(!matchMedia('(hover:hover)').matches)return;document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}

  // historias fijas (sin depender de GSAP)
  function stories(){document.querySelectorAll('.story').forEach(st=>{const imgs=st.querySelectorAll('.vis > img'),phones=st.querySelectorAll('.vis .phone'),clock=st.querySelector('.clock'),steps=st.querySelectorAll('.steps2 > div');
    const set=i=>{imgs.forEach((m,j)=>m.classList.toggle('on',j===i));phones.forEach((m,j)=>m.classList.toggle('on',j===i));steps.forEach((s,j)=>s.classList.toggle('on',j===i));if(clock)clock.textContent=steps[i].dataset.time||''};
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)set([...steps].indexOf(e.target))}),{rootMargin:'-45% 0px -45% 0px'});steps.forEach(s=>io.observe(s));set(0)})}

  // palabras para el texto que se enciende (antes de GSAP)
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.scrub-text').forEach(p=>splitWords(p,'sw'));
    stories();magnetic();
    intro(()=>{});
    // GSAP llega con defer; esperar a que cargue
    if(document.readyState==='complete')start();else addEventListener('load',start);
  });
})();
