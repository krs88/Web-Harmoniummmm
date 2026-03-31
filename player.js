import { playSound } from "./sounds.js";

let song = [];
let index = 0;
let playing = false;
let speed = 1;
let timer = null;

export function loadSong(s) {
  song = Array.isArray(s) ? s : [];
  index = 0;
}

export function play() {
  if (playing) return;
  playing = true;
  loop();
}

export function pause() {
  playing = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export function stop() {
  pause();
  index = 0;
}

export function setSpeed(s) {
  speed = Number(s) || 1;
}

function loop() {
  if (!playing) return;
  if (index >= song.length) {
    playing = false;
    timer = null;
    return;
  }

  const note = song[index];
  if (!note?.rest && note?.key) {
    playSound(note.key);
  }

  index += 1;
  timer = setTimeout(loop, (note?.duration || 250) / speed);
}
