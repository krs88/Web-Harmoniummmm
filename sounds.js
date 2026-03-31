const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};
const fallbackFreq = {
  E: 261.63,
  4: 293.66,
  5: 329.63,
  U: 349.23,
  8: 392.0,
  9: 440.0,
  P: 493.88
};

async function loadSound(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sound not found: ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return audioCtx.decodeAudioData(arrayBuffer);
}

export async function initSounds(map) {
  const entries = Object.entries(map);
  for (const [key, url] of entries) {
    try {
      buffers[key] = await loadSound(url);
    } catch {
      // Keep working with oscillator fallback if static assets are missing.
      buffers[key] = null;
    }
  }
}

function playTone(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.value = 0.16;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.start(now);
  osc.stop(now + 0.3);
}

export function playSound(key) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (buffers[key]) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    source.connect(audioCtx.destination);
    source.start(0);
    return;
  }

  playTone(fallbackFreq[key] || 261.63);
}
