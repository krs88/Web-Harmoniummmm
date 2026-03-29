import { playSound } from "./sounds.js";

let song = [];
let index = 0;
let playing = false;
let speed = 1;

export function loadSong(s) {
  song = s;
  index = 0;
}

export function play() {
  playing = true;
  loop();
}

export function pause() {
  playing = false;
}

export function stop() {
  playing = false;
  index = 0;
}

export function setSpeed(s) {
  speed = s;
}

function loop() {
  if (!playing || index >= song.length) return;

  const note = song[index];

  if (!note.rest) playSound(note.key);

  index++;
  setTimeout(loop, note.duration / speed);
}