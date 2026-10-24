import Matter from 'matter-js';
/* The letters of LOUD. Past nine on the knob they lose the fight with gravity. You can throw them. */
export function createLetters(root, word) {
  root.innerHTML = word.split('').map((c) => `<span class="ltr">${c}</span>`).join('');
  const letters = [...root.children]; const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Runner } = Matter;
  let engine = null, runner = null, bodies = [], frame = null, dropped = false;
  const drop = () => {
    if (dropped) return; dropped = true; engine = Engine.create({ gravity: { y: 1.4 } });
    const W = innerWidth, H = innerHeight; const walls = [Bodies.rectangle(W / 2, H + 40, W * 2, 80, { isStatic: true }), Bodies.rectangle(-40, H / 2, 80, H * 2, { isStatic: true }), Bodies.rectangle(W + 40, H / 2, 80, H * 2, { isStatic: true })];
    bodies = letters.map((el) => { const r = el.getBoundingClientRect(); el.style.position = 'fixed'; el.style.left = '0'; el.style.top = '0'; el.style.width = `${r.width}px`; el.style.height = `${r.height}px`; el.style.transform = `translate(${r.left}px,${r.top}px)`; const b = Bodies.rectangle(r.left + r.width / 2, r.top + r.height / 2, r.width * .9, r.height * .72, { restitution: .5, friction: .4, chamfer: { radius: 10 } }); Body.setAngularVelocity(b, (Math.random() - .5) * .3); Body.setVelocity(b, { x: (Math.random() - .5) * 8, y: -4 }); return b; });
    const mouse = Mouse.create(document.body); const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: .2, render: { visible: false } } }); mouse.element.removeEventListener('wheel', mouse.mousewheel); mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    Composite.add(engine.world, [...walls, ...bodies, mc]); runner = Runner.create(); Runner.run(runner, engine);
    const tick = () => { bodies.forEach((b, i) => { const el = letters[i]; const w = parseFloat(el.style.width), h = parseFloat(el.style.height); el.style.transform = `translate(${b.position.x - w / 2}px,${b.position.y - h / 2}px) rotate(${b.angle}rad)`; }); frame = requestAnimationFrame(tick); }; tick();
    root.classList.add('is-down');
  };
  const reset = () => { if (!dropped) return; dropped = false; cancelAnimationFrame(frame); Runner.stop(runner); Engine.clear(engine); letters.forEach((el) => { el.style.cssText = ''; }); root.classList.remove('is-down'); };
  return { drop, reset, get dropped() { return dropped; } };
}
