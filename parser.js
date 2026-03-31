const VALID_KEYS = new Set(["E", "4", "5", "U", "8", "9", "P"]);

export function parseNotes(input) {
  const result = [];
  const tokens = input
    .toUpperCase()
    .replace(/[^E45U89P\-\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    for (const char of token) {
      if (char === "-") {
        result.push({ rest: true, duration: 200 });
      } else if (VALID_KEYS.has(char)) {
        result.push({ key: char, duration: 250 });
      }
    }
  }

  return result;
}

export function convertSongTextToNotes(text) {
  const normalized = text.toLowerCase();

  const mapping = [
    { pattern: /\b(do|c|sa)\b/g, note: "E" },
    { pattern: /\b(re|d)\b/g, note: "4" },
    { pattern: /\b(mi|e|ga)\b/g, note: "5" },
    { pattern: /\b(fa|f|ma)\b/g, note: "U" },
    { pattern: /\b(so|sol|g|pa)\b/g, note: "8" },
    { pattern: /\b(la|a|dha)\b/g, note: "9" },
    { pattern: /\b(ti|si|b|ni)\b/g, note: "P" }
  ];

  const extracted = [];
  for (const { pattern, note } of mapping) {
    let match;
    while ((match = pattern.exec(normalized)) !== null) {
      extracted.push({ index: match.index, note });
    }
  }

  extracted.sort((a, b) => a.index - b.index);

  if (extracted.length) {
    return extracted.map(({ note }) => ({ key: note, duration: 250 }));
  }

  // Fallback: create a simple melody from words if explicit note words are absent.
  const words = normalized.split(/\s+/).filter(Boolean).slice(0, 64);
  const scale = ["E", "4", "5", "U", "8", "9", "P"];

  return words.map((word, idx) => {
    const charSum = [...word].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const key = scale[(charSum + idx) % scale.length];
    return { key, duration: 220 + (word.length % 3) * 40 };
  });
}
