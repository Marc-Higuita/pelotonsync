// Contenido dinámico de la página de investigación. Etiquetas: F científica, P prensa, E estimación, H hipótesis, B brief.
(function(){
const T=(k,l)=>`<span class="tag ${k.toLowerCase()}">${l||k}</span>`;
const $=id=>document.getElementById(id);

// Staff
const staff=[['entrenador','Entrenador','Planes, monitoreo y recuperación.','Archivos de potencia, TSS/CTL, tests'],['nutricionista','Nutricionista','Plan de comidas por gramos y suplementos.','Gasto energético, menús, peso, lotes'],['medico','Médico','Salud, análisis, AUT y control antidopaje.','Historia clínica, recetas, controles'],['psicologa','Psicóloga','Bienestar mental.','Escalas de ánimo, sesiones'],['director','Director deportivo','Táctica, nóminas y radio en carrera.','Calendario, ruta, clima']];
$('staffGrid').innerHTML=staff.map((s,i)=>`<div class="glow staff-card rv d${i%4}" style="--aura:rgba(204,255,0,.2)"><img src="assets/illus/${s[0]}.webp" alt="Ilustración: ${s[1]}" loading="lazy"><h4>${s[1]}</h4><p>${s[2]}</p><p class="mono" style="color:rgba(243,241,234,.5);font-size:10.5px">${s[3]}</p></div>`).join('');
const uae=[['Masajistas',16],['Mecánicos',9],['Médicos y personal médico',7],['Oficina',5],['Rendimiento',4],['Cocina y nutrición',3]];
$('uae').innerHTML=uae.map(u=>`<div style="display:flex;justify-content:space-between;font-size:14px"><span>${u[0]}</span><span class="led">${u[1]}</span></div><div class="bar"><i data-w="${u[1]/16*100}%" style="background:var(--volt)"></i></div>`).join('');

// Tipos
const types=[
 ['Escalador','escalador','Puertos largos','Liviano · ≈55–63 kg','W/kg sostenido 20–60 min','Ascensos de 30–60 min. El top del Tour supera 6,5 W/kg en 20 min.',['E'],92],
 ['Puncher','sprint','Muros cortos y finales en subida','Liviano a medio','W/kg en 1–5 min y aceleración','Repetir esfuerzos de 1–5 min después de muchos kJ.',['F'],78],
 ['Corredor de general','ciclista-volt','Gana vueltas de tres semanas','60–66 kg','FTP en W/kg, resistencia a la fatiga y contrarreloj','7.000–7.700 kcal/día en Grandes Vueltas.',['F','P'],96],
 ['Clasicómano','ciclista-termico','Monumentos, adoquín, 250–300 km','Pesado y potente · ≈75–80 kg','Potencia absoluta 5–20 min','6–7 h a potencia media alta.',['P'],70],
 ['Velocista','descenso','Llegadas masivas','Pesado y explosivo','Pico de 5–15 s (1.400–1.900+ W)','Sobrevivir a la montaña en el grupetto.',['P'],40],
 ['Rodador y gregario','contrarreloj','Controlar, cortar viento, lanzar','Alto y pesado','Potencia absoluta sostenida','Muchas horas en cabeza del pelotón.',['F'],60]];
const tl=$('typeList');
types.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t[0];b.onclick=()=>showType(i);tl.appendChild(b)});
function showType(i){const t=types[i];[...tl.children].forEach((b,j)=>b.classList.toggle('on',i===j));
 $('typeCard').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center"><div><p class="mono" style="color:rgba(243,241,234,.5)">${t[2]}</p><h3 style="color:#F3F1EA;margin:10px 0 18px">${t[0]}</h3>
 <p class="mono" style="color:rgba(243,241,234,.5)">Morfotipo</p><p style="margin-bottom:12px">${t[3]}</p><p class="mono" style="color:rgba(243,241,234,.5)">Métrica que manda</p><p style="margin-bottom:12px;color:#CCFF00">${t[4]}</p>
 <p class="mono" style="color:rgba(243,241,234,.5)">Demanda típica</p><p>${t[5]} ${t[6].map(k=>T(k)).join(' ')}</p>
 <p class="mono" style="color:rgba(243,241,234,.5);margin-top:16px">Dependencia de la subida (relativa)</p><div class="bar"><i style="width:${t[7]}%"></i></div></div>
 <img src="assets/illus/${t[1]}.webp" alt="" style="border-radius:20px"></div>`}
showType(0);
const wkg=[['Recreativo','2–3',3],['Amateur fuerte','4–5',5],['Nacional','5–5,5',5.5],['WorldTour','5,5–6,5',6.5],['Top 10 del Tour','> 6,5',7]];
$('wkg').innerHTML=wkg.map(w=>`<div style="display:grid;grid-template-columns:150px 1fr 80px;gap:12px;align-items:center;font-size:14px"><span>${w[0]}</span><div class="bar"><i data-w="${w[2]/7*100}%"></i></div><span class="led">${w[1]}</span></div>`).join('');

// Fichas
const fichas=[
 {n:'Sergio Higuita',r:'Escalador · puncher · caso de estudio',photo:'retrato',img:'escalador',aura:'rgba(204,255,0,.4)',kv:[['Talla','1,66 m'],['Peso','57 kg'],['Nació','1997'],['Equipos','5']],
  li:[`Medellín. Apodo "Higuita Monster". ${T('P')}`,`General de la Volta a Catalunya 2022, con fuga de 133 km junto a Carapaz. ${T('P')}`,`2.º Tour de Suisse 2022, 4.º Il Lombardia 2022, 9.º Tour de Suisse 2026. ${T('P')}`,`Manzana Postobón → EF → Bora → XDS Astana → Caja Rural-Seguros RGA (2027–28). ${T('P')}`,`Potencia: no hay archivos públicos. Por perfil estaría en 5,5–6,5 W/kg en 20 min. ${T('E')} ${T('H')}`,`Por qué es el caso: cinco estructuras con sistemas distintos y vida en altura en Antioquia, lejos de la sede europea. ${T('H')}`]},
 {n:'Tadej Pogačar',photo:'pogacar',r:'Corredor de general',img:'ciclista-volt',aura:'rgba(204,255,0,.35)',kv:[['Talla','1,76 m'],['Peso Tour 24','64,5 kg'],['FTP est.','415 W'],['Carbos','120 g/h']],
  li:[`En invierno sube a unos 69 kg. ${T('P')}`,`Plateau de Beille 2024: unos 442 W durante 40 min (≈6,85 W/kg). ${T('F')} ${T('E')}`,`Su zona 2 de entrenamiento está en 320–340 W, según él mismo. ${T('P')}`,`Unos 120 g de carbohidratos por hora en etapas duras; entrenó el intestino para tolerarlos. ${T('P')}`,`Monitorea potencia, VAM, VFC y zona 2. ${T('P')}`]},
 {n:'Jonas Vingegaard',photo:'vingegaard',r:'Corredor de general',img:'contrarreloj',aura:'rgba(63,200,228,.4)',kv:[['Talla','1,75 m'],['Peso','≈60 kg'],['Blockhaus','6,35 W/kg'],['Comidas 2024','55.000']],
  li:[`El equipo no publica potencia; las cifras son estimaciones externas. ${T('E')}`,`Unos 7,38 W/kg durante 13:31 en la contrarreloj del Tour 2023. ${T('E')}`,`Ritmo constante más que ataque explosivo. ${T('E')}`,`Visma calcula cada comida al gramo con FoodCoach y pesa la comida en el bufé. ${T('P')}`,`FoodCoach integra un modelo que predice el gasto con datos históricos, biométricos y del entorno. ${T('P')}`]},
 {n:'Van der Poel y Van Aert',photo:'vdp-wva',r:'Clasicómanos',img:'ciclista-termico',aura:'rgba(255,106,43,.45)',kv:[['MVDP','≈75 kg'],['WVA','78 kg'],['Flandes 22','285 W'],['Pico','1.406 W']],
  li:[`Flandes 2022 (Strava): 6,5 h a 285 W de media y unos 500 W durante 5 min en el Oude Kwaremont. ${T('P')}`,`Strade Bianche 2021: 5,17 W/kg (389 W normalizados) durante 4:45 h. ${T('P')}`,`Van Aert gana al sprint, en contrarreloj, en adoquín y en subida. ${T('P')}`,`Gasto en Clásicas: unos 27 MJ/día. ${T('F')}`]},
 {n:'Philipsen y Merlier',photo:'philipsen-merlier',r:'Velocistas',img:'sprint',aura:'rgba(240,68,46,.45)',kv:[['Pico','1.900 W'],['Sprint','12–15 s'],['Potencia','3–6 s'],['Riesgo','grupetto']],
  li:[`Philipsen llega a 1.900 W según INSCYD, el software de su equipo. ${T('P')}`,`Cavendish: "yo hago 1.400–1.500 W, ellos 1.800–1.900 W; yo pedaleo un 10 % más rápido". ${T('P')}`,`Velocista de potencia (Merlier) frente a velocista aero, más liviano y muy rápido a alta velocidad. ${T('P')}`,`Si se les hace perder peso con más fondo, pierden potencia de sprint. ${T('P')}`]},
 {n:'El ciclista agotado',photo:'dumoulin',r:'Arquetipo negativo · ref. Dumoulin',img:'de-pie',aura:'rgba(240,68,46,.5)',neg:1,kv:[['Giro','2017'],['Pausa','2021'],['Retiro','2022'],['Tanque','vacío']],
  li:[`Carga: mucho volumen sin cruzarlo con la recuperación; el calendario cambia sin aviso.`,`Señales perdidas: fatiga, dolor y ánimo contados por chat, que nadie cruza con la potencia.`,`Presión: resultados, peso, contrato, patrocinadores y prensa. ${T('F')}`,`Autonomía: siente que otros deciden su calendario, comida y viajes. ${T('P')}`,`Salud: riesgo de déficit energético y baja densidad ósea. ${T('F')}`,`Final: pausa, regreso sin recuperarse y retiro anticipado. ${T('P')}`]}];
$('fichaGrid').innerHTML=fichas.map((f,i)=>`<div class="ficha rv d${i%3} ${f.neg?'neg':''}" tabindex="0" role="button" aria-label="Voltear ficha de ${f.n}"><div class="in">
<div class="face front glow" style="--aura:${f.aura}"><p class="mono" style="color:rgba(243,241,234,.55)">${f.r}</p><img src="${f.photo?`assets/photo/${f.photo}.webp`:`assets/illus/${f.img}.webp`}" alt="Foto: ${f.n}" loading="lazy" style="object-position:50% 20%"><h3>${f.n}</h3><div class="kv">${f.kv.map(k=>`<div><span>${k[0]}</span><strong>${k[1]}</strong></div>`).join('')}</div><p class="flip-hint">Toca para ver más ↻</p></div>
<div class="face back glow" style="--aura:${f.aura}"><p class="mono" style="color:rgba(243,241,234,.55)">${f.r}</p><h3 style="margin:8px 0 16px">${f.n}</h3><ul>${f.li.map(l=>`<li>${l}</li>`).join('')}</ul><p class="flip-hint" style="margin-top:auto;padding-top:14px">Toca para volver ↻</p></div></div></div>`).join('');
document.querySelectorAll('.ficha').forEach(f=>{const t=()=>f.classList.toggle('flip');f.addEventListener('click',t);f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}})});

// Flujos
const svg=$('flowSvg'),NS='http://www.w3.org/2000/svg';
const src=[['Entrenamiento','TrainingPeaks · Garmin'],['Bienestar y ánimo','WhatsApp · de palabra'],['Nutrición','Hojas · FoodCoach'],['Medicina','PDF · email'],['Antidopaje','ADAMS'],['Calendario','Email · chat'],['Competición','Potencia · resultados']];
const dst=[['Entrenador',''],['Nutricionista',''],['Médico','exclusivo'],['Psicóloga','exclusivo'],['Director','solo disponibilidad'],['Ciclista','dueño del dato']];
const notesNow=[`<b>Estructurado pero aislado:</b> el entrenamiento circula por su propia plataforma y no se cruza con el bienestar.`,`<b>Sin historial:</b> el ánimo y el dolor se cuentan por chat o de palabra al masajista.`,`<b>Riesgo legal:</b> el ciclista declara de memoria lo que tomó en el control.`,`<b>Duplicación manual:</b> el ciclista copia itinerarios y nóminas a su propia agenda.`];
const notesNew=[`<b>Registro único y longitudinal</b>, con fecha y autor en cada dato.`,`<b>Permisos por rol:</b> médico y psicóloga ven en exclusiva; el director solo ve disponibilidad.`,`<b>Correlación automática</b> de carga y bienestar con alertas para quien corresponde.`,`<b>Portabilidad:</b> el ciclista exporta su historial si cambia de equipo. ${T('H')}`];
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e};
function node(x,y,w,t,s,hi){const g=el('g',{class:'node'});el('rect',{x,y,width:w,height:52,rx:14,style:hi?'fill:#CCFF00;stroke:none':''},g);const a=el('text',{x:x+16,y:y+23,style:hi?'fill:#0E100E;font-weight:600':''},g);a.textContent=t;if(s){const b=el('text',{x:x+16,y:y+41,class:'lbl',style:hi?'fill:#0E100E99':''},g);b.textContent=s}return g}
function drawFlow(mode){svg.innerHTML='';const ys=src.map((_,i)=>20+i*76);
 if(!mode){ // hoy: cada fuente va a un destino suelto, líneas cruzadas y punteadas grises
  const map=[[0,0],[1,3],[1,0],[2,1],[3,2],[4,5],[5,4],[5,5],[6,0],[6,4]];
  const dy=dst.map((_,i)=>40+i*88);
  map.forEach(([a,b])=>{el('path',{class:'edge',d:`M300 ${ys[a]+26} C 560 ${ys[a]+26}, 560 ${dy[b]+26}, 800 ${dy[b]+26}`,style:'stroke-dasharray:4 6'})});
  src.forEach((s,i)=>node(40,ys[i],260,s[0],s[1]));dst.forEach((d,i)=>node(800,dy[i],260,d[0],d[1]));
  const t=el('text',{x:550,y:548,'text-anchor':'middle',class:'lbl'});t.textContent='Cada staff guarda su parte por separado · sin historial común';
 }else{
  const cx=550,cy=280,dy=dst.map((_,i)=>40+i*88);
  src.forEach((s,i)=>{const p=el('path',{class:'edge live',d:`M300 ${ys[i]+26} C 420 ${ys[i]+26}, 420 ${cy}, ${cx-110} ${cy}`});dot(p,i*.3)});
  dst.forEach((d,i)=>{const p=el('path',{class:'edge live',d:`M${cx+110} ${cy} C 680 ${cy}, 680 ${dy[i]+26}, 800 ${dy[i]+26}`});dot(p,1+i*.25)});
  src.forEach((s,i)=>node(40,ys[i],260,s[0],s[1]));dst.forEach((d,i)=>node(800,dy[i],260,d[0],d[1],i===5));
  el('circle',{cx,cy,r:110,fill:'#CCFF00',opacity:.12});el('circle',{cx,cy,r:80,fill:'#CCFF00'});
  const a=el('text',{x:cx,y:cy-4,'text-anchor':'middle',style:'fill:#0E100E;font-family:Unbounded;font-weight:700;font-size:15px'});a.textContent='Registro';
  const b=el('text',{x:cx,y:cy+16,'text-anchor':'middle',style:'fill:#0E100E;font-family:Unbounded;font-weight:700;font-size:15px'});b.textContent='único';
 }
 $('flowNotes').innerHTML=(mode?notesNew:notesNow).map(n=>`<div class="card" style="padding:20px"><p>${n}</p></div>`).join('');
}
function dot(path,delay){const c=el('circle',{r:5,class:'dot'});const m=el('animateMotion',{dur:'2.6s',repeatCount:'indefinite',begin:delay+'s'},c);m.setAttribute('path',path.getAttribute('d'))}
const fb=document.querySelectorAll('[data-flow]');fb.forEach(b=>b.onclick=()=>{fb.forEach(x=>x.classList.toggle('on',x===b));drawFlow(+b.dataset.flow)});drawFlow(0);
new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){setTimeout(()=>fb[1].click(),1600);o.disconnect()}}),{threshold:.6}).observe(svg);

// Solución
const sol=[['Registro único','Historial longitudinal con fecha y autor.','Pérdida de datos'],['Integraciones','Garmin, plataformas de entrenamiento y calendario UCI, sin cargar a mano.','Duplicación'],['Check-in de 30 s','Ánimo, sueño, escala Hooper y dolor.','Señales perdidas en chats'],['Correlación y alertas','Carga y bienestar cruzados, con aviso por rol.','Detección tardía'],['Permisos por rol','Datos clínicos solo para el médico.','Confidencialidad'],['Trazabilidad médica','Recetas, AUT, lotes y declaración de 7 días.','Riesgo legal en controles']];
$('solGrid').innerHTML=sol.map((s,i)=>`<div class="card rv d${i%3}"><p class="mono">Responde a: ${s[2]}</p><h3 style="margin-top:14px">${s[0]}</h3><p>${s[1]}</p></div>`).join('');

// Pruebas de usabilidad (recorrido cognitivo)
const tests=[[26,'Escalador y puncher','Pro','El menú de abajo lo entendí sin pensar, y eso después de 5 o 6 horas en la bici es lo que uno quiere. El check-in con las caritas de Grega es rápido; lo hice en menos de un minuto. Lo que no supe es si el entrenador ya lo había visto. Me gustaría un "visto por Lars 7:40".',['Equipo']],
[31,'Grandes generales','Pro','Tiene todo el sentido juntar potencia, comida y agenda. Mi duda es la carga manual: ya tengo TrainingPeaks, Garmin, la app de nutrición del equipo y WHOOP. Si no se conecta con eso voy a duplicar todo. La pantalla "Conecta tus datos" tiene que ir en serio.',['Integraciones']],
[23,'Media montaña','Pro','Lo que más me gustó fue el mapa con lluvia, temperatura y polen en la misma ruta. Soy alérgico y nunca lo había visto así. En concentración casi todo lo revisamos en el portátil, entonces una versión web me serviría mucho.',['Web']],
[29,'Clasicómano','Pro','Muy buena idea para bajar el ruido administrativo. Quisiera que el preparador, la nutricionista y el médico vean las alertas agrupadas, para no mandar la misma captura a tres personas.',['Equipo']],
[22,'Velocista','Amateur','Soy amateur y aun así la entendí a la primera. Lo que yo no tengo es preparador ni nutricionista. Me encantaría una versión recreativa donde Grega haga de entrenador.',['Recreativo']],
[34,'Escalador','Pro','Está muy aterrizado a lo que vivimos al terminar de entrenar. En la zona del equipo mezclaría menos los comentarios: el del preparador no pesa lo mismo que el del médico, y quiero saber quién me dijo qué.',['Equipo']],
[27,'Media montaña','Amateur','Se ve limpio y no tuve que adivinar qué tocar. Me costó leer algunos números grandes con letra de puntitos cuando el brillo estaba bajo, en la calle. Ojalá se pudieran enlazar Strava y el reloj.',['Visual','Integraciones','Recreativo']],
[25,'Puncher','Pro','Resuelve un problema real; tengo datos regados en cinco lados. El mapa de calor mensual es lo que más miraría, pero en el celular se queda corto. Una versión web para revisar el mes con el preparador sería ideal.',['Web']],
[30,'Clasicómano','Amateur','Fácil de navegar. Me gustó marcar los vasos de agua con un toque. Pediría que jale datos de otras apps, porque no voy a escribir lo que ya registra el Garmin.',['Integraciones','Recreativo']],
[28,'Velocista','Pro','El flujo es directo. La pantalla de resultado de carrera con los picos sobre el FTP me gustó mucho, y el logro de Grega motiva más de lo que pensé. Puliría el panel del staff y habilitaría una versión web.',['Equipo','Web']],
[21,'Escalador','Amateur','Súper rápida de entender. Quisiera la versión para recreativos. También me preguntaría quién ve mis datos: si el director ve que dormí mal, ¿eso afecta si me llevan a una carrera?',['Privacidad','Recreativo']],
[33,'Grandes generales','Pro','Es necesaria para centralizar la operación. Lo de los medicamentos con la declaración de los últimos 7 días me parece clave; en un control uno siempre se olvida de algo.',['Equipo','Web']],
[24,'Rodador y gregario','Pro','Lo usaría, pero que no se vuelva una obligación más. Si me llegan avisos de Grega, del entrenador, de la nutricionista y del médico, voy a silenciar todo. Quiero elegir qué avisos me llegan y cuándo.',['Equipo','Avisos']],
[36,'Media montaña · máster','Amateur','El modo claro se ve limpio, aunque el oscuro se lee mejor de noche. Tardé en encontrar el historial médico: lo busqué en Datos y estaba en Agenda. Me gustaría subir yo los exámenes en PDF.',['Visual','Web']],
[19,'Escalador · sub-23','Amateur','Para alguien que está empezando, tener todo en un solo lugar es oro. Lo del dolor por zonas está muy práctico. Cuando pase a un equipo me gustaría llevarme mi historial; que los datos sean míos.',['Privacidad']]];
const filters=['Todos','Pro','Amateur','Equipo','Integraciones','Web','Recreativo','Privacidad'];
$('testFilter').innerHTML=filters.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f}">${f==='Pro'?'Profesionales':f==='Amateur'?'Amateurs':f}</button>`).join('');
$('tests').innerHTML=tests.map((t,i)=>`<article class="glow test" data-k="${t[2]} ${t[4].join(' ')}" style="--aura:${t[2]==='Pro'?'rgba(204,255,0,.18)':'rgba(63,200,228,.2)'}"><div class="who"><div class="av" style="${t[2]==='Pro'?'':'background:#3FC8E4'}">${i+1}</div><div><b style="color:#F3F1EA">Prueba Usuario ${i+1}</b><p class="mono" style="color:rgba(243,241,234,.5);font-size:11px">${t[0]} años · ${t[1]} · ${t[2]==='Pro'?'Profesional':'Amateur'}</p></div></div><blockquote>"${t[3]}"</blockquote><div class="chips">${t[4].map(c=>`<span class="tag">${c}</span>`).join('')}</div></article>`).join('');
document.querySelectorAll('#testFilter button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#testFilter button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;document.querySelectorAll('.test').forEach(t=>t.classList.toggle('hide',f!=='Todos'&&!t.dataset.k.split(' ').includes(f)))});
const syn=[['El flujo es claro y sin curva de aprendizaje',15,'Fortaleza'],['Fortalecer la zona del equipo: alertas agrupadas, roles separados, "visto por"',6,'Alta'],['Versión web para análisis y planificación',5,'Media-alta'],['Integración con TrainingPeaks, Garmin, Strava, WHOOP',4,'Alta'],['Versión recreativa con IA como entrenador',4,'Oportunidad'],['Privacidad y propiedad de los datos',2,'Alta'],['Legibilidad de cifras Doto y ubicación del historial médico',2,'Ajuste'],['Control de notificaciones',1,'Media']];
$('synth').innerHTML=syn.map(s=>`<div class="synth-row"><span>${s[0]}</span><div class="bar"><i data-w="${s[1]/15*100}%"></i></div><span class="mono">${s[1]}/15 · ${s[2]}</span></div>`).join('');

// re-observar elementos creados
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv:not(.in)').forEach(x=>io.observe(x));
const bo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;bo.unobserve(e.target)}}),{threshold:.3});
document.querySelectorAll('.bar i[data-w]').forEach(x=>bo.observe(x));
document.querySelectorAll('.glow').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--gx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--gy',((e.clientY-r.top)/r.height*100)+'%')}));
})();
