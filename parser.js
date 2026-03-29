export function parseNotes(input) {
  const result = [];

  for (let char of input) {
    if (char === " ") continue;

    if (char === "-") {
      result.push({ rest: true, duration: 200 });
    } else {
      result.push({ key: char, duration: 250 });
    }
  }

  return result;
}