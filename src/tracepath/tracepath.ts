import { isInConnected, updateOutConnected } from "./moment-bitfields.ts";

export type Tracepath = Moment[];

export type Moment = [
  // x
  number,
  // y
  number,
  // fuel
  number,
  // bitfields
  number,
];

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function calcBoundingRect(tracepath: Tracepath): Rect {
  if (tracepath.length < 1) return { x: 0, y: 0, w: 0, h: 0 };
  let [top, left, right, bottom] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const moment of tracepath) {
    const [x, y] = moment;
    top = Math.min(y, top);
    left = Math.min(x, left);
    right = Math.max(x + 1, right);
    bottom = Math.max(y + 1, bottom);
  }
  return {
    x: top,
    y: left,
    w: right - left,
    h: bottom - top,
  };
}

export function step(tracepath: Tracepath, moment: Moment): void {
  burn(tracepath);
  const last = tracepath[tracepath.length - 1];
  if (last) last[3] = updateOutConnected(last[3], isInConnected(moment[3]));
  tracepath.push(moment);
}

export function stepBack(tracepath: Tracepath): void {
  tracepath.pop();
}

export function burn(tracepath: Tracepath): void {
  for (const moment of tracepath) --moment[2];
  const rest = tracepath.filter((moment) => moment[2] > 0);
  tracepath.length = 0;
  tracepath.push(...rest);
}
