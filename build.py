# Ensambla las páginas: cabecera, menú y pie compartidos.
import pathlib,re
B=pathlib.Path(__file__).parent
LOGO='''<svg viewBox="4 4 136 64" aria-hidden="true"><path class="ring1" d="M36 62C50.36 62 62 50.36 62 36S50.36 10 36 10 10 21.64 10 36s11.64 26 26 26Z" fill="none" stroke="#4F534E" stroke-width="9"/><path d="M68 62C82.36 62 94 50.36 94 36S82.36 10 68 10 42 21.64 42 36s11.64 26 26 26Z" fill="none" stroke="var(--bg)" stroke-width="15" class="ring2 cut"/><path class="ring2" d="M68 62C82.36 62 94 50.36 94 36S82.36 10 68 10 42 21.64 42 36s11.64 26 26 26Z" fill="none" stroke="#A9ADA6" stroke-width="9"/><path class="ring1" d="M44.9 11.57A26 26 0 0 1 57.55 21.46" fill="none" stroke="var(--bg)" stroke-width="15"/><path class="ring1" d="M44.9 11.57A26 26 0 0 1 57.55 21.46" fill="none" stroke="#4F534E" stroke-width="9"/><circle class="ball" cx="100" cy="36" r="28" fill="#CCFF00" stroke="var(--bg)" stroke-width="6"/></svg>'''
INTRO='''<div id="intro" aria-hidden="true"><button class="skip" type="button">Saltar</button><div class="lines"></div><div class="stage"><div class="road"></div>
<svg viewBox="4 4 136 64"><g class="wheel w1"><circle cx="36" cy="36" r="26" fill="none" stroke="#4F534E" stroke-width="9"/><g class="spokes" stroke="#4F534E" stroke-width="1.5"><path d="M36 12V60M12 36H60M19 19L53 53M53 19L19 53"/></g></g><g class="wheel w2"><circle cx="68" cy="36" r="26" fill="none" stroke="#090B08" stroke-width="15"/><circle cx="68" cy="36" r="26" fill="none" stroke="#A9ADA6" stroke-width="9"/><g class="spokes" stroke="#A9ADA6" stroke-width="1.5"><path d="M68 12V60M44 36H92M51 19L85 53M85 19L51 53"/></g></g><circle class="iball" cx="100" cy="36" r="28" fill="#CCFF00" stroke="#090B08" stroke-width="6"/></svg>
<div class="word"><span style="animation-delay:1.9s">Peloton</span><span style="animation-delay:2s"><b>Sync</b></span></div></div>
<div class="meta"><span>Tu equipo, a rueda contigo</span><span class="count">000</span><span>SAHG SAS × Higuita Monster</span></div></div>'''
PAGES=[('index','Inicio'),('marca','Manual de marca'),('investigacion','Investigación'),('wireframe','Wireframe'),('prototipo','Prototipo')]
def head(title,desc):
    return f'''<!doctype html><html lang="es" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#090B08">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Doto:wght@700;800&family=Geist+Mono:wght@400;500&family=Geist:wght@300;400;600&family=Unbounded:wght@300;700&display=swap" rel="stylesheet">
<script>try{{var t=localStorage.getItem('ps-theme');if(t)document.documentElement.dataset.theme=t;if(sessionStorage.getItem('ps-intro'))document.documentElement.classList.add('no-intro')}}catch(e){{}}</script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script><script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<link rel="stylesheet" href="styles.css"><script src="app.js" defer></script><script src="effects.js" defer></script></head><body>'''+INTRO
def nav(cur):
    li=''.join(f'<li><a href="{"/" if p=="index" else "/"+p}"{" aria-current=\"page\"" if p==cur else ""}>{n}</a></li>' for p,n in PAGES)
    return f'''<div class="progress"></div><nav class="nav" aria-label="Principal"><a class="brand" href="/">{LOGO}<span>Peloton<b>Sync</b></span></a><ul>{li}</ul>
<button class="theme-btn" type="button" aria-label="Cambiar tema"></button><button class="theme-btn menu-btn" type="button" aria-label="Menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg></button></nav>'''
FOOT='''<footer><div class="wrap"><div class="cols"><div><a class="brand" href="/" style="display:flex;gap:10px;align-items:center;text-decoration:none;font-family:var(--f-display);font-weight:700">'''+LOGO.replace('<svg','<svg width="54" height="28"')+'''<span>Peloton<b class="volt">Sync</b></span></a>
<p style="margin-top:14px;max-width:460px">Proyecto de práctica: propuesta de innovación y prototipo navegable UX/UI de alta fidelidad. Desarrollado en el entorno de SAHG SAS y Higuita Monster, con Sergio Higuita como caso de estudio. Entrega: 16 de noviembre de 2026.</p></div>
<div><p class="mono" style="margin-bottom:10px">Cómo leer las fuentes</p><p style="display:flex;flex-wrap:wrap;gap:6px;max-width:420px"><span class="tag f">F · científica u oficial</span><span class="tag p">P · prensa o equipo</span><span class="tag e">E · estimación</span><span class="tag b">B · contexto del proyecto</span><span class="tag h">H · hipótesis sin validar</span></p></div></div>
<p class="mono" style="margin-top:40px">Ilustraciones, pantallas y personaje Grega: diseño propio del proyecto. Cifras de la app: datos de ejemplo. Las pruebas de usabilidad se hicieron por recorrido cognitivo con proto-personas.</p></div></footer>'''
for p,n in PAGES:
    src=(B/'src'/f'{p}.html').read_text()
    m=re.match(r'<!--(.*?)\|(.*?)-->',src)
    title,desc=m.group(1),m.group(2)
    body=src[m.end():]
    (B/f'{p}.html').write_text(head(title,desc)+nav(p)+'<main>'+body+'</main>'+FOOT+'</body></html>')
(B/'assets/favicon.svg').write_text(LOGO.replace('var(--bg)','#090B08').replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"'))
print('ok')
