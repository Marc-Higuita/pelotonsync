// Mapa de interacción y diagramas de flujo animados (datos del archivo de Figma, página 03 · Wireframes)
(function(){
const NS='http://www.w3.org/2000/svg';
const C={in:'#9A9C94',ru:'#3FC8E4',re:'#CCFF00',rd:'#FF6A2B',ag:'#8E6BFF',eq:'#5BD68A',me:'#F0442E'};
const W=176,H=40;
const N=[
 ['sp','01 · Splash','in',20,300],['ac','02 · Acceso','in',20,360],['rol','03 · Rol','in',20,420],
 ['con','04 · Conecta datos','in',230,300],['ini','05 · Inicio','re',230,380],['gre','14 · Grega','ag',230,460],['eme','15 · Emergencia','me',230,520],['aju','19 · Ajustes','in',230,580],
 ['r7','07 · Ruta semana','ru',460,40],['r8','08 · Ruta del día','ru',460,100],['r20','20 · Buscador','ru',460,160],
 ['ck','06 · Check-in','re',680,40],['cka','06a–c · Grega responde','re',680,100],['nu','09 · Nutrición','re',680,160],['cp','10 · Comida y peso','re',680,220],['cal','21 · Calendario comidas','re',680,280],['dia','21a · Comidas del día','re',680,340],
 ['rd','11 · Rendimiento','rd',900,40],['fo','12 · Forma','rd',900,100],['sa','34 · Salud y SpO₂','rd',900,160],['res','37 · Resultado carrera','rd',900,220],['pf','38 · Preparación física','rd',900,280],['rec','41 · Mi recuperación','rd',900,340],['des','32 · Descanso','rd',900,400],
 ['ag','13 · Agenda','ag',1120,40],['car','33 · Carreras 2027','ag',1120,100],['med','40 · Medicamentos','ag',1120,160],['his','39 · Historial médico','ag',1120,220],
 ['rolb','03b · Rol equipo','eq',20,660],['pan','16 · Panel equipo','eq',230,660],['eci','17 · Ciclista','eq',460,620],['asi','18 · Asignar','eq',460,680],['res2','23 · Resultados','eq',680,620],['nut','29 · Nutricionista','eq',680,680],['psi','30 · Psicóloga','eq',900,620],['dir','31 · Director','eq',900,680],['pdir','35 · Perfil director','eq',1120,620],['acar','36 · Asignar carrera','eq',1120,680],
 ['rolc','03c · Rol médico','me',20,800],['mdo','42 · Médico','me',230,800],['fic','22 · Ficha médica','me',460,800],['ame','43 · Asignar medicamento','me',680,800],['dol','44 · Dolor del equipo','me',900,800]];
const E=[['sp','ac'],['ac','rol'],['rol','con'],['con','ini'],['ini','gre'],['gre','eme'],['ini','aju'],['ini','r7'],['r7','r8'],['r8','r20'],['ini','ck'],['ck','cka'],['ini','nu'],['nu','cp'],['nu','cal'],['cal','dia'],['ini','rd'],['rd','fo'],['rd','sa'],['rd','res'],['rd','pf'],['pf','rec'],['rd','des'],['ini','ag'],['ag','car'],['ag','med'],['ag','his'],['car','res'],
 ['rol','rolb'],['rolb','pan'],['pan','eci'],['pan','asi'],['eci','res2'],['pan','nut'],['pan','psi'],['pan','dir'],['dir','pdir'],['pdir','acar'],['rol','rolc'],['rolc','mdo'],['mdo','fic'],['mdo','ame'],['mdo','dol'],['ame','med'],['cka','pan'],['dol','rec']];
const svg=document.getElementById('map');
if(svg){
 const pos={};N.forEach(n=>pos[n[0]]=n);
 const g1=document.createElementNS(NS,'g'),g2=document.createElementNS(NS,'g');svg.append(g1,g2);
 const edges=E.map(([a,b])=>{const A=pos[a],B=pos[b];let x1=A[3]+W,y1=A[4]+H/2,x2=B[3],y2=B[4]+H/2;
   if(Math.abs(A[3]-B[3])<5){x1=A[3]+W/2;y1=A[4]+H;x2=B[3]+W/2;y2=B[4]}
   const d=Math.abs(A[3]-B[3])<5?`M${x1} ${y1} L${x2} ${y2}`:`M${x1} ${y1} C${x1+50} ${y1},${x2-50} ${y2},${x2} ${y2}`;
   const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke',C[A[2]]);p.setAttribute('stroke-opacity','.35');p.setAttribute('stroke-width','1.6');p.dataset.a=a;p.dataset.b=b;g1.appendChild(p);
   const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;p.style.transition='stroke-dashoffset 1.4s ease, stroke-opacity .3s';return p});
 const nodes=N.map(n=>{const g=document.createElementNS(NS,'g');g.style.cursor='pointer';g.dataset.id=n[0];g.style.transition='opacity .3s';
   g.innerHTML=`<rect x="${n[3]}" y="${n[4]}" width="${W}" height="${H}" rx="12" fill="var(--bg)" stroke="${C[n[2]]}" stroke-opacity=".7"/><circle cx="${n[3]+16}" cy="${n[4]+H/2}" r="4" fill="${C[n[2]]}"/><text x="${n[3]+28}" y="${n[4]+25}" style="fill:var(--text);font-family:Geist,sans-serif;font-size:12.5px">${n[1]}</text>`;g2.appendChild(g);return g});
 const lab=(x,y,t)=>{const e=document.createElementNS(NS,'text');e.setAttribute('x',x);e.setAttribute('y',y);e.setAttribute('style','fill:var(--subtle);font-family:Geist Mono,monospace;font-size:11px;letter-spacing:.1em');e.textContent=t;g2.appendChild(e)};
 lab(460,28,'RUTA');lab(680,28,'REGISTRO Y NUTRICIÓN');lab(900,28,'RENDIMIENTO');lab(1120,28,'AGENDA');lab(20,288,'ENTRADA');lab(20,648,'EQUIPO TÉCNICO');lab(20,788,'MÉDICO');
 const hi=id=>{const rel=new Set([id]);edges.forEach(p=>{if(p.dataset.a===id||p.dataset.b===id){rel.add(p.dataset.a);rel.add(p.dataset.b)}});
   nodes.forEach(g=>g.style.opacity=id&&!rel.has(g.dataset.id)?.18:1);edges.forEach(p=>p.setAttribute('stroke-opacity',id?(p.dataset.a===id||p.dataset.b===id?1:.05):.35))};
 nodes.forEach(g=>{g.addEventListener('mouseenter',()=>hi(g.dataset.id));g.addEventListener('mouseleave',()=>hi(null));g.addEventListener('click',()=>hi(g.dataset.id))});
 new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){edges.forEach((p,i)=>setTimeout(()=>p.style.strokeDashoffset=0,i*40));o.disconnect()}}),{threshold:.2}).observe(svg);
}

// Diagramas de flujo animados
const F=[
 {steps:[['Grega avisa','7:30 · "¿Cómo amaneces?"','ag'],['Inicio','Tarjeta check-in','re'],['Elige ánimo','Desliza tarjetas','re'],['Escala Hooper','Sueño, estrés, fatiga y dolor 1–7','re'],['Zonas de dolor','Toca el cuerpo','re'],['Grega responde','Resumen + recomendaciones','re'],['Equipo recibe','Alerta solo a quien corresponde','eq']],
  text:['A primera hora Grega recuerda el check-in. No hay que buscarlo.','Desde Inicio, la tarjeta del check-in está arriba y se abre con un toque.','El ánimo se elige deslizando tarjetas con las caras de Grega, sin escribir.','Cuatro preguntas de la escala de Hooper (1–7), una por pantalla. Toma unos 30 segundos.','Si algo duele, se toca la zona del cuerpo y su intensidad.','Grega devuelve un resumen y sugerencias para la noche (descanso, música, series).','El preparador ve la alerta de rodilla; la psicóloga solo ve el ánimo. Nadie tuvo que mandar capturas.']},
 {steps:[['Preparador','Asigna ruta y zonas','eq'],['Agenda','Aparece el bloque','ag'],['Ruta del día','Mapa y perfil','ru'],['Capas','Temperatura, lluvia, polen','ru'],['Alerta','Polen alto en el km 40','ru'],['Ciclista decide','Ajusta o avisa','re']],
  text:['El preparador deja la ruta con su zona de intensidad desde el panel del equipo.','La ruta aparece en la agenda del día como bloque de entreno.','El ciclista abre la ruta del día: mapa, distancia, desnivel y tiempo.','Activa capas de clima por tramo, calidad del aire y polen.','Si es alérgico, la capa de polen marca el tramo de riesgo.','Con la información en la mano, ajusta la salida o avisa al preparador por Grega.']},
 {steps:[['Médico','Asigna medicamento','me'],['Ciclista','Recibe con dosis y horario','ag'],['Grega','Recuerda la toma','ag'],['Registro','Marca "tomado"','re'],['Declaración','Últimos 7 días listos','me'],['Control','Declara sin memoria','me']],
  text:['El médico asigna el medicamento con dosis, horario y si requiere AUT.','El ciclista lo ve en Agenda › Medicamentos, con la ilustración del envase.','Grega aparece en modo gregario (con bidón) a la hora de la toma.','Un toque marca la toma; queda con fecha y hora.','La app arma la lista de lo tomado en los últimos 7 días.','En un control antidopaje, el ciclista declara desde la lista y no de memoria.']}];
const us=document.getElementById('uflow'),ol=document.getElementById('flowSteps');
if(us){
 let timer;
 function draw(k){clearTimeout(timer);const f=F[k],n=f.steps.length,gap=1160/n,y=190;us.innerHTML='';
  const line=document.createElementNS(NS,'path');const x0=20+gap/2-70,x1=20+gap*(n-1)+gap/2;line.setAttribute('d',`M${20+gap/2} ${y} L${x1} ${y}`);line.setAttribute('stroke','var(--line)');line.setAttribute('stroke-width','3');us.appendChild(line);
  const prog=document.createElementNS(NS,'path');prog.setAttribute('d',`M${20+gap/2} ${y} L${x1} ${y}`);prog.setAttribute('stroke','#CCFF00');prog.setAttribute('stroke-width','3');const L=x1-(20+gap/2);prog.style.strokeDasharray=L;prog.style.strokeDashoffset=L;prog.style.transition=`stroke-dashoffset ${n*.7}s linear`;us.appendChild(prog);
  const groups=f.steps.map((s,i)=>{const cx=20+gap*i+gap/2,g=document.createElementNS(NS,'g');g.style.opacity=.25;g.style.transition='opacity .4s, transform .4s';
   g.innerHTML=`<circle cx="${cx}" cy="${y}" r="26" fill="var(--bg)" stroke="${C[s[2]]}" stroke-width="3"/><text x="${cx}" y="${y+6}" text-anchor="middle" style="fill:${C[s[2]]};font-family:Doto,monospace;font-weight:800;font-size:18px">${i+1}</text>
   <text x="${cx}" y="${y-56}" text-anchor="middle" style="fill:var(--text);font-family:Unbounded,sans-serif;font-weight:700;font-size:14px">${s[0]}</text>
   <foreignObject x="${cx-gap/2+6}" y="${y+40}" width="${gap-12}" height="80"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;font:13px Geist,sans-serif;color:var(--muted)">${s[1]}</div></foreignObject>`;us.appendChild(g);return g});
  const ball=document.createElementNS(NS,'circle');ball.setAttribute('r','10');ball.setAttribute('cx',20+gap/2);ball.setAttribute('cy',y);ball.setAttribute('fill','#CCFF00');ball.style.filter='drop-shadow(0 0 8px #CCFF00)';ball.style.transition=`cx .7s cubic-bezier(.3,.8,.3,1)`;us.appendChild(ball);
  ol.innerHTML=f.text.map((t,i)=>`<li style="opacity:.35;transition:opacity .4s"><div><b>${f.steps[i][0]}</b><p>${t}</p></div></li>`).join('');
  let i=0;const step=()=>{groups[i].style.opacity=1;ol.children[i].style.opacity=1;ball.style.cx=(20+gap*i+gap/2)+'px';i++;if(i<n)timer=setTimeout(step,700)};
  requestAnimationFrame(()=>{prog.style.strokeDashoffset=0;step()});
 }
 const tabs=document.querySelectorAll('#flowTabs button');tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.toggle('on',x===b));draw(+b.dataset.f)});
 new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){draw(0);o.disconnect()}}),{threshold:.4}).observe(us);
}
})();

// Visor del wireframe: 53 pantallas en grises, se pasan con flechas, teclado o deslizando.
(function(){
  const S=window.WF_SCREENS;if(!S)return;
  const img=document.getElementById('wfvImg'),title=document.getElementById('wfvTitle'),count=document.getElementById('wfvCount'),group=document.getElementById('wfvGroup'),th=document.getElementById('wfvThumbs');
  const grp=n=>{const k=parseInt(n,10);if(k<=4)return'Entrada: splash, acceso, rol y conexión de datos';if([16,17,18,23,24,25,26,27,28,29,30,31,35,36].includes(k))return'Equipo técnico';if(k>=42)return'Médico del equipo';return'Ciclista'};
  th.innerHTML=S.map((s,i)=>`<button type="button" aria-label="${s[1]}"><img loading="lazy" src="assets/wfs/${s[0]}" alt=""><span>${s[1].split(' · ')[0]}</span></button>`).join('');
  let i=0;
  const show=(n,dir)=>{i=(n+S.length)%S.length;const s=S[i];img.classList.remove('in-l','in-r');void img.offsetWidth;img.src='assets/wfs/'+s[0];img.alt='Wireframe '+s[1];img.classList.add(dir<0?'in-l':'in-r');
    const parts=s[1].split(' · ');title.textContent=parts.slice(1).join(' · ')||s[1];group.textContent=parts[0]+' · '+grp(parts[0]);count.textContent=String(i+1).padStart(2,'0')+' / '+S.length;
    [...th.children].forEach((b,j)=>b.classList.toggle('on',j===i));const b=th.children[i];th.scrollTo({left:b.offsetLeft-th.clientWidth/2+b.clientWidth/2,behavior:'smooth'});
    const nx=new Image();nx.src='assets/wfs/'+S[(i+1)%S.length][0]};
  document.querySelector('.wfv-arrow.prev').onclick=()=>show(i-1,-1);document.querySelector('.wfv-arrow.next').onclick=()=>show(i+1,1);
  [...th.children].forEach((b,j)=>b.onclick=()=>show(j,j<i?-1:1));
  const vis=document.getElementById('visor');let inView=false;new IntersectionObserver(es=>inView=es[0].isIntersecting,{threshold:.3}).observe(vis);
  addEventListener('keydown',e=>{if(!inView)return;if(e.key==='ArrowRight'){show(i+1,1);e.preventDefault()}if(e.key==='ArrowLeft'){show(i-1,-1);e.preventDefault()}});
  let x0=null;const st=document.querySelector('.wfv-stage');st.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});st.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(i+(dx<0?1:-1),dx<0?1:-1);x0=null});
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){vis.querySelector('.wfv').classList.add('go');io.disconnect()}},{threshold:.3});io.observe(vis);
  show(0,1);
})();
