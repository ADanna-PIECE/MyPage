// Coordinates the intro: the Loader signals when the curtain starts lifting,
// and the hero elements + particles begin their reveal at that exact moment.
type Fn = () => void;

const listeners: Fn[] = [];
let revealed = false;

export function markIntroReveal() {
  if (revealed) return;
  revealed = true;
  for (const fn of listeners) fn();
  listeners.length = 0;
}

export function onIntroReveal(fn: Fn) {
  if (revealed) {
    fn();
    return;
  }
  listeners.push(fn);
}
