// moment는 4바이트로 이루어져있음
//
// 각 바이트는 다음을 의미함 (lower byte부터)
// 0: in direction
// 1: out direction
// 2: in connected
// 3: out connected
//
// 즉 iv ov ic oc

export type DirStr = "up" | "down" | "left" | "right";
const up = 0b0001;
const down = 0b0010;
const left = 0b0100;
const right = 0b1000;
const dirnums = { up, down, left, right };
const dirstrs: Record<number, DirStr> = {
  [up]: "up",
  [down]: "down",
  [left]: "left",
  [right]: "right",
};

export interface SideTable {
  ti: boolean;
  to: boolean;
  bi: boolean;
  bo: boolean;
  li: boolean;
  lo: boolean;
  ri: boolean;
  ro: boolean;
}
export function getSideTable(bitfields: number): SideTable {
  const inDirnum = bitfields & inDirMask;
  const outDirnum = (bitfields & outDirMask) >> 8;
  return {
    ti: Boolean(inDirnum & down),
    to: Boolean(outDirnum & up),
    bi: Boolean(inDirnum & up),
    bo: Boolean(outDirnum & down),
    li: Boolean(inDirnum & right),
    lo: Boolean(outDirnum & left),
    ri: Boolean(inDirnum & left),
    ro: Boolean(outDirnum & right),
  };
}

const inDirMask = 0x000000ff;
const outDirMask = 0x0000ff00;
const inConnectedMask = 0x00010000;
const outConnectedMask = 0x01000000;

function toDirstr(num: number): DirStr {
  return dirstrs[num] || "down";
}

export function getInDir(bitfields: number): DirStr {
  return toDirstr(bitfields & inDirMask);
}

export function getOutDir(bitfields: number): DirStr {
  return toDirstr((bitfields & outDirMask) >> 8);
}

export function updateInDir(bitfields: number, inDir: DirStr): number {
  return (bitfields & ~inDirMask) | dirnums[inDir];
}

export function updateOutDir(bitfields: number, outDir: DirStr): number {
  return (bitfields & ~outDirMask) | (dirnums[outDir] << 8);
}

export function isInConnected(bitfields: number): boolean {
  return (bitfields & inConnectedMask) !== 0;
}

export function isOutConnected(bitfields: number): boolean {
  return (bitfields & outConnectedMask) !== 0;
}

export function updateInConnected(
  bitfields: number,
  inConnected: boolean,
): number {
  return inConnected
    ? (bitfields | inConnectedMask)
    : (bitfields & ~inConnectedMask);
}

export function updateOutConnected(
  bitfields: number,
  outConnected: boolean,
): number {
  return outConnected
    ? (bitfields | outConnectedMask)
    : (bitfields & ~outConnectedMask);
}
