// Grega en bici (SVG) con uniforme PelotonSync y emociones de ciclista.
// Se usa en la web (animado) y para generar los cuadros del prototipo de Figma.
(function (g) {
  const KITS = {
    team: ['#0E100E', '#CCFF00', '#CCFF00', '#F3F1EA'], ruta: ['#3FC8E4', '#0E100E', '#3FC8E4', '#3FC8E4'],
    rend: ['#FF6A2B', '#0E100E', '#FF6A2B', '#FF6A2B'], agenda: ['#8E6BFF', '#CCFF00', '#8E6BFF', '#8E6BFF'],
    equipo: ['#5BD68A', '#0E100E', '#5BD68A', '#5BD68A']
  };
  const BODY = {
    normal: ['#F4FFB0', '#CCFF00', '#7FA300'], bajon: ['#E8F2B8', '#BFD94A', '#7C8F2A'], recuperacion: ['#E2E6CF', '#AEB78C', '#6E7458'], alerta: ['#FFD2B8', '#FF6A2B', '#C0301E']
  };
  let uid = 0;
  function legPts(a) {
    const px = 104 + Math.cos(a) * 13, py = 114 + Math.sin(a) * 13, hx = 100, hy = 74, kx = (hx + px) / 2 + 12, ky = (hy + py) / 2 - 4;
    return `${hx},${hy} ${kx.toFixed(1)},${ky.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`;
  }
  function face(m) {
    const ink = '#0E100E';
    switch (m) {
      case 'feliz': return `<path d="M119 46q4-6 8 0M129 46q4-6 8 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><circle cx="116" cy="54" r="3" fill="#FF9B2F" opacity=".5"/>`;
      case 'ganador': return `<path d="M119 44q4-6 8 0M129 44q4-6 8 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M122 52q6 8 12 0z" fill="${ink}"/>`;
      case 'animado': return `<rect class="eye" x="121" y="40" width="5" height="10" rx="2.5" fill="${ink}"/><rect class="eye" x="131" y="40" width="5" height="10" rx="2.5" fill="${ink}"/><path d="M119 36l8 3M139 36l-8 3" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M124 55q5 4 10 0" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/><g stroke="#FF6A2B" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M30 40H6M36 56H14M28 72H0"/></g>`;
      case 'tenso': return `<rect x="121" y="41" width="5" height="9" rx="2.5" fill="${ink}"/><rect x="131" y="41" width="5" height="9" rx="2.5" fill="${ink}"/><path d="M119 38l8-3M139 38l-8-3" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M123 56h12" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M123 56v-2M127 56v-2M131 56v-2M135 56v-2" stroke="${ink}" stroke-width="1.5"/>`;
      case 'bajon': return `<path d="M119 44q4 4 8 0M129 44q4 4 8 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M119 38l7 2M138 38l-7 2" stroke="${ink}" stroke-width="2" stroke-linecap="round"/><path d="M124 58q5-5 10 0" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M121 50q-2 5 0 6q2-1 0-6z" fill="#3FC8E4"/>`;
      case 'agotado': return `<path d="M119 45h8M129 45h8" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M121 41l6 2M135 41l-6 2" stroke="${ink}" stroke-width="2" stroke-linecap="round"/><ellipse cx="129" cy="55" rx="4" ry="3" fill="${ink}"/><path d="M127 57q2 5 4 0" fill="#FF6A2B"/><path d="M92 36q-4 6 0 8q4-2 0-8z" fill="#3FC8E4"/><path d="M86 48q-3 5 0 7q3-2 0-7z" fill="#3FC8E4"/>`;
      case 'recuperacion': return `<path d="M119 46q4 4 8 0M129 46q4 4 8 0" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><text x="140" y="16" font-family="Geist Mono,monospace" font-size="12" font-weight="700" fill="#8E6BFF">z</text><text x="148" y="6" font-family="Geist Mono,monospace" font-size="15" font-weight="700" fill="#8E6BFF">Z</text>`;
      case 'alerta': return `<circle cx="123" cy="45" r="4.5" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="133" cy="45" r="4.5" fill="#fff" stroke="${ink}" stroke-width="2"/><circle cx="124" cy="45" r="2" fill="${ink}"/><circle cx="134" cy="45" r="2" fill="${ink}"/><text x="146" y="22" font-family="Unbounded,sans-serif" font-size="22" font-weight="700" fill="#F0442E">!</text>`;
      default: return `<rect class="eye" x="121" y="38" width="5" height="12" rx="2.5" fill="${ink}"/><rect class="eye" x="131" y="38" width="5" height="12" rx="2.5" fill="${ink}"/>`;
    }
  }
  function arms(m, j) {
    const ink = '#8A8F84';
    if (m === 'ganador') return `<path class="armw" d="M98 52L80 22M126 52L146 20" stroke="${ink}" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="78" cy="19" r="4" fill="${ink}"/><circle cx="148" cy="17" r="4" fill="${ink}"/>
      <g class="confeti"><rect x="60" y="8" width="5" height="9" fill="#3FC8E4" transform="rotate(20 62 12)"/><rect x="166" y="10" width="5" height="9" fill="#FF6A2B" transform="rotate(-25 168 14)"/><rect x="40" y="30" width="5" height="9" fill="#8E6BFF" transform="rotate(40 42 34)"/><rect x="182" y="34" width="5" height="9" fill="#CCFF00" transform="rotate(-10 184 38)"/><circle cx="100" cy="4" r="3" fill="#F0442E"/><circle cx="190" cy="16" r="3" fill="#5BD68A"/></g>`;
    if (m === 'gregario') return `<line x1="128" y1="62" x2="160" y2="60" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M96 54L78 30" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><rect x="68" y="8" width="16" height="24" rx="4" fill="#CCFF00" stroke="${ink}" stroke-width="2"/><rect x="72" y="4" width="8" height="5" rx="2" fill="${ink}"/>`;
    return `<line class="arm" x1="128" y1="62" x2="160" y2="60" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
  }
  function gregaSVG(kit, mood, angle) {
    mood = mood || 'pedaleando'; angle = angle || 0;
    const [j, s, f, hc] = KITS[kit] || KITS.team, id = 'g' + (uid++);
    const b = BODY[mood] || BODY.normal, drop = mood === 'agotado' ? 4 : 0;
    const spokesRot = (angle * 60).toFixed(1);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" aria-hidden="true"><defs><radialGradient id="${id}b" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="${b[0]}"/><stop offset=".5" stop-color="${b[1]}"/><stop offset="1" stop-color="${b[2]}"/></radialGradient><clipPath id="${id}c"><circle cx="112" cy="50" r="30"/></clipPath></defs>
<ellipse cx="110" cy="152" rx="90" ry="5" fill="#000000" fill-opacity=".18"/>
<g class="w" data-cx="48" data-cy="118"><circle cx="48" cy="118" r="30" fill="none" stroke="#4F534E" stroke-width="7"/><path class="sp" transform="rotate(${spokesRot} 48 118)" d="M48 92V144M22 118H74M30 100L66 136M66 100L30 136" stroke="#4F534E" stroke-width="1.4"/></g>
<g class="w" data-cx="170" data-cy="118"><circle cx="170" cy="118" r="30" fill="none" stroke="#A9ADA6" stroke-width="7"/><path class="sp" transform="rotate(${spokesRot} 170 118)" d="M170 92V144M144 118H196M152 100L188 136M188 100L152 136" stroke="#A9ADA6" stroke-width="1.4"/></g>
<g fill="none" stroke="${f}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M48 118L104 114L86 74L150 72L104 114M48 118L86 74M150 72L170 118M150 72L158 58"/></g>
<path d="M150 60H166" stroke="#0E100E" stroke-width="5" stroke-linecap="round"/><path d="M76 72H96" stroke="#0E100E" stroke-width="6" stroke-linecap="round"/>
<polyline class="leg1" points="${legPts(angle)}" fill="none" stroke="#A9ADA6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline class="leg2" points="${legPts(angle + Math.PI)}" fill="none" stroke="#6b7066" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
${arms(mood, j)}
<g class="bd" transform="translate(0 ${drop})"><circle cx="112" cy="50" r="31.5" fill="none" stroke="#F3F1EA" stroke-opacity=".35" stroke-width="1.5"/><circle cx="112" cy="50" r="30" fill="url(#${id}b)"/>
<g clip-path="url(#${id}c)"><rect x="70" y="63" width="90" height="40" fill="${j}"/><rect x="70" y="64" width="90" height="4" fill="${s}"/>
<g transform="translate(101 70.5) scale(.15)"><circle cx="36" cy="36" r="26" fill="none" stroke="${s}" stroke-width="9"/><circle cx="68" cy="36" r="26" fill="none" stroke="${s}" stroke-width="9"/><circle cx="100" cy="36" r="28" fill="${s}"/></g></g>
<path d="M88 31Q98 15 120 17Q138 20 140 31Z" fill="${hc}"/><path d="M102 21L106 28M114 18L116 27M127 19L127 27" stroke="#000000" stroke-opacity=".3" stroke-width="2"/>
${face(mood)}<circle cx="101" cy="42" r="4" fill="#fff" opacity=".7"/></g></svg>`;
  }
  g.gregaSVG = gregaSVG; g.gregaLegPts = legPts;
  if (typeof module !== 'undefined') module.exports = { gregaSVG, legPts };
})(typeof window !== 'undefined' ? window : globalThis);
