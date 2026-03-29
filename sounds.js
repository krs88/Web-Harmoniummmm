const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

async function loadSound(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

export async function initSounds(map) {
  for (let key in map) {
    buffers[key] = await loadSound(map[key]);
  }
}

export function playSound(key) {
  if (!buffers[key]) return;

  const source = audioCtx.createBufferSource();
  source.buffer = buffers[key];
  source.connect(audioCtx.destination);
  source.start(0);
}