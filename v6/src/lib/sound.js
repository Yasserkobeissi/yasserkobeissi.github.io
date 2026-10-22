/* A small score: marker scratch under the cursor, a page turn, a tape press. Off until the visitor turns it on. */
export function createSound() {
  let ac = null, on = false, scratchGain, scratchFilter, noise;
  const start = () => {
    if (ac) return; ac = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    noise = ac.createBufferSource(); noise.buffer = buf; noise.loop = true;
    scratchFilter = ac.createBiquadFilter(); scratchFilter.type = 'bandpass'; scratchFilter.frequency.value = 2200; scratchFilter.Q.value = 0.8;
    scratchGain = ac.createGain(); scratchGain.gain.value = 0;
    noise.connect(scratchFilter).connect(scratchGain).connect(ac.destination); noise.start();
  };
  const burst = (freq, dur, gain, type = 'lowpass') => { if (!ac || !on) return; const src = ac.createBufferSource(); src.buffer = noise.buffer; const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, ac.currentTime); f.frequency.exponentialRampToValueAtTime(freq * 0.25, ac.currentTime + dur); const g = ac.createGain(); g.gain.setValueAtTime(gain, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur); src.connect(f).connect(g).connect(ac.destination); src.start(); src.stop(ac.currentTime + dur); };
  let level = 0;
  return {
    get on() { return on; },
    toggle() { start(); on = !on; if (ac.state === 'suspended') ac.resume(); if (!on) scratchGain.gain.setTargetAtTime(0, ac.currentTime, 0.05); return on; },
    scratch(speed) { if (!ac || !on) return; level = Math.min(0.06, level + speed * 0.0006); scratchFilter.frequency.setTargetAtTime(1500 + Math.min(3000, speed * 40), ac.currentTime, 0.02); },
    tick() { if (!ac || !on) return; scratchGain.gain.setTargetAtTime(level, ac.currentTime, 0.03); level *= 0.82; },
    flip() { burst(1800, 0.35, 0.25); }, tape() { burst(900, 0.12, 0.18, 'bandpass'); }, pin() { burst(4000, 0.06, 0.12, 'highpass'); },
  };
}
