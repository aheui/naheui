import {
  dxTable,
  dyTable,
  parameterCounts,
  strokeCountTable,
} from "./table.ts";

export function createCodeSpace(sourceCode: string): CodeSpace {
  return sourceCode.split(/\r?\n/g).map((line) =>
    line.split("").map((char) => new Code(char))
  );
}

export function isValidAheuiCode(code?: Code): code is Code {
  if (!code) return false;
  return code.idx > -1;
}

export type CodeSpace = Code[][];
export class Code {
  public readonly idx: number; // 가(0)-힣(11171) 중 몇번째에 해당하는지
  public readonly cho: number;
  public readonly jung: number;
  public readonly jong: number;
  constructor(public readonly char: string) {
    const idx = this.idx = calcIdx(char);
    this.cho = calcCho(idx);
    this.jung = calcJung(idx);
    this.jong = calcJong(idx);
  }
  get parameterCount(): number {
    return parameterCounts[this.cho];
  }
  get strokeCount(): number {
    return strokeCountTable[this.jong];
  }
  get dx(): number {
    return dxTable[this.jung];
  }
  get dy(): number {
    return dyTable[this.jung];
  }
}

const ga = "가".charCodeAt(0);
const he = "힣".charCodeAt(0);
const end = he - ga;

function calcIdx(char: string): number {
  const index = char.charCodeAt(0) - ga;
  if (index < 0) return -1;
  if (index > end) return -1;
  return index;
}

function calcCho(charIndex: number): number {
  return (charIndex / 588) | 0;
}

function calcJung(charIndex: number): number {
  return (((charIndex / 28) | 0) % 21) | 0;
}

function calcJong(charIndex: number): number {
  return charIndex % 28;
}
