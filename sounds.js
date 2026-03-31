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

async function decodeArrayBuffer(arrayBuffer) {
  return audioCtx.decodeAudioData(arrayBuffer);
}

async function loadSound(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sound not found: ${url}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return decodeArrayBuffer(arrayBuffer);
}

export async function initSounds(map) {
  const entries = Object.entries(map);
  for (const [key, url] of entries) {
    try {
      buffers[key] = await loadSound(url);
    } catch {
      buffers[key] = null;
    }
  }
}

function inferKeyFromFilename(name) {
  const stem = name.split(".")[0].toUpperCase();
  const candidate = stem.slice(-1);
  if (fallbackFreq[candidate]) return candidate;
  if (fallbackFreq[stem]) return stem;
  return null;
}

export async function connectSoundFiles(fileList) {
  const files = Array.from(fileList || []);
  let connected = 0;

  for (const file of files) {
    const key = inferKeyFromFilename(file.name);
    if (!key) continue;

    try {
      const buffer = await decodeArrayBuffer(await file.arrayBuffer());
      buffers[key] = buffer;
      connected += 1;
    } catch {
      // Ignore invalid audio files and continue.
    }
  }

  return connected;
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
