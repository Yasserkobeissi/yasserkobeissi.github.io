/* A car you tune. A line drawing that redraws with every slider. */
export function createCar(root, { onChange }) {
  const svg = root.querySelector('svg'); const path = svg.querySelector('#carBody'); const wf = svg.querySelector('#wheelF'), wr = svg.querySelector('#wheelR'), win = svg.querySelector('#carWin'), glow = svg.querySelector('#carGlow');
  const s = { roof: 50, wheels: 50, length: 50, stance: 50 };
  const draw = () => {
    const L = 320 + (s.length / 100) * 160; const x0 = 300 - L / 2, x1 = 300 + L / 2; const base = 150; const roofY = base - 42 - (s.roof / 100) * 48; const wr_ = 16 + (s.wheels / 100) * 18; const track = 0.22 + (s.stance / 100) * 0.14; const fx = x0 + L * track, rx = x1 - L * track;
    const hood = base - 18 - (s.roof / 100) * 6; const aPillar = x0 + L * 0.36, cPillar = x1 - L * 0.26;
    path.setAttribute('d', `M ${x0} ${base} L ${x0 + 6} ${hood + 2} Q ${x0 + 30} ${hood - 4} ${aPillar - 40} ${hood - 6} C ${aPillar} ${roofY + 6} ${aPillar + 10} ${roofY} ${aPillar + 40} ${roofY} L ${cPillar - 20} ${roofY} C ${cPillar + 20} ${roofY + 2} ${cPillar + 40} ${hood - 10} ${x1 - 24} ${hood - 2} Q ${x1} ${hood + 6} ${x1} ${base - 2} L ${x1} ${base} Z`);
    win.setAttribute('d', `M ${aPillar - 10} ${hood - 4} C ${aPillar + 6} ${roofY + 10} ${aPillar + 14} ${roofY + 5} ${aPillar + 44} ${roofY + 5} L ${cPillar - 22} ${roofY + 5} C ${cPillar + 12} ${roofY + 7} ${cPillar + 26} ${hood - 10} ${cPillar + 30} ${hood - 6} Z`);
    [wf, wr].forEach((w, i) => { const cx = i ? rx : fx; w.setAttribute('cx', cx); w.setAttribute('cy', base); w.setAttribute('r', wr_); });
    glow.setAttribute('x1', x0); glow.setAttribute('x2', x1); glow.setAttribute('y1', base + wr_ + 10); glow.setAttribute('y2', base + wr_ + 10);
    let key = 'default'; if (s.roof < 28) key = 'roofLow'; else if (s.roof > 78) key = 'roofHigh'; else if (s.wheels > 78) key = 'wheelsBig'; else if (s.wheels < 24) key = 'wheelsSmall'; else if (s.length > 78) key = 'long'; else if (s.length < 24) key = 'short'; else if (s.stance > 78) key = 'stanceWide';
    onChange?.(key, s);
  };
  root.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('input', () => { s[r.name] = +r.value; draw(); }));
  draw(); return { draw };
}
