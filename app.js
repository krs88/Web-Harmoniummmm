import { initSounds } from "./sounds.js";
import { parseNotes } from "./parser.js";
import { loadSong, play, pause, stop, setSpeed } from "./player.js";
import { songs } from "./songs.js";

const soundMap = {
  "E": "assets/sounds/E.mp3",
  "4": "assets/sounds/4.mp3",
  "5": "assets/sounds/5.mp3",
  "U": "assets/sounds/U.mp3",
  "8": "assets/sounds/8.mp3",
  "9": "assets/sounds/9.mp3",
  "P": "assets/sounds/P.mp3"
};

await initSounds(soundMap);

// Controls
document.getElementById("play").onclick = play;
document.getElementById("pause").onclick = pause;
document.getElementById("stop").onclick = stop;
document.getElementById("speed").oninput = e => setSpeed(e.target.value);

// Song dropdown
const select = document.getElementById("songSelect");
Object.keys(songs).forEach(name => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.innerText = name;
  select.appendChild(opt);
});

select.onchange = () => loadSong(songs[select.value]);

// Convert input
document.getElementById("convert").onclick = () => {
  const text = document.getElementById("noteInput").value;
  loadSong(parseNotes(text));
  play();
};