import { initSounds, playSound, connectSoundFiles } from "./sounds.js";
import { parseNotes, convertSongTextToNotes } from "./parser.js";
import { loadSong, play, pause, stop, setSpeed } from "./player.js";
import { songs } from "./songs.js";

const soundMap = {
  E: "assets/sounds/E.mp3",
  4: "assets/sounds/4.mp3",
  5: "assets/sounds/5.mp3",
  U: "assets/sounds/U.mp3",
  8: "assets/sounds/8.mp3",
  9: "assets/sounds/9.mp3",
  P: "assets/sounds/P.mp3"
};

await initSounds(soundMap);

const keysRoot = document.getElementById("keys");
const soundStatus = document.getElementById("soundStatus");

Object.keys(soundMap).forEach((key) => {
  const button = document.createElement("button");
  button.className = "key";
  button.textContent = key;
  button.dataset.key = key;
  button.onclick = () => {
    playSound(key);
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 120);
  };
  keysRoot.appendChild(button);
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (!soundMap[key]) return;
  playSound(key);
  const button = document.querySelector(`.key[data-key="${key}"]`);
  button?.classList.add("active");
  setTimeout(() => button?.classList.remove("active"), 120);
});

// Controls
document.getElementById("play").onclick = play;
document.getElementById("pause").onclick = pause;
document.getElementById("stop").onclick = stop;
document.getElementById("speed").oninput = (e) => setSpeed(Number(e.target.value));

// Song dropdown
const select = document.getElementById("songSelect");
Object.keys(songs).forEach((name) => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.innerText = name;
  select.appendChild(opt);
});

select.onchange = () => {
  loadSong(songs[select.value]);
};

if (select.options.length > 0) {
  select.value = select.options[0].value;
  loadSong(songs[select.value]);
}

// Manual note conversion
document.getElementById("convert").onclick = () => {
  const text = document.getElementById("noteInput").value;
  const parsed = parseNotes(text);
  loadSong(parsed);
  play();
};

// AI-ish song text to notes conversion
document.getElementById("aiConvert").onclick = () => {
  const text = document.getElementById("songTextInput").value;
  const aiNotes = convertSongTextToNotes(text);
  loadSong(aiNotes);
  play();

  document.getElementById("noteInput").value = aiNotes
    .map((n) => (n.rest ? "-" : n.key))
    .join(" ");
};

// Custom sound connection
document.getElementById("connectSounds").onclick = async () => {
  const files = document.getElementById("soundFiles").files;

  if (!files || files.length === 0) {
    soundStatus.textContent = "Select audio files first (names should include E,4,5,U,8,9,P).";
    return;
  }

  const count = await connectSoundFiles(files);
  if (count > 0) {
    soundStatus.textContent = `Connected ${count} custom sound file(s).`;
  } else {
    soundStatus.textContent = "No matching files found. Use names like E.mp3, 4.wav, P.ogg.";
  }
};
