import { Code, type CodeSpace, isValidAheuiCode } from "./code.ts";
import {
  chos,
  dxTable,
  dyTable,
  ignore,
  jongs,
  jongTable,
  reflect,
} from "./table.ts";
import {
  getCursorDir,
  getMomentBitfields,
  updateOutConnected,
  updateOutDir,
} from "./tracepath/moment-bitfields.ts";
import { step as stepTracepath, Tracepath } from "./tracepath/tracepath.ts";

export interface MachineState {
  cursor: Cursor;
  storages: number[][];
  currentStorageIndex: number;
  terminated: boolean;
  tracepath: Tracepath;
}

export interface Cursor {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export type Breakpoints = Record<
  /* y */ number,
  Record</* x */ number, boolean>
>;

export function createMachineState(): MachineState {
  return {
    cursor: { x: 0, y: 0, dx: 0, dy: 1 },
    storages: jongTable.map(() => []),
    currentStorageIndex: 0,
    terminated: false,
    tracepath: [],
  };
}

export interface RunConfig {
  codeSpace: CodeSpace;
  machineState: MachineState;
  machineFuel: number;
  tracepathFuel: number;
  needInterrupt: () => boolean;
  handleInterrupt: (machineState: MachineState) => void;
  checkBreakpoint: (machineState: MachineState) => boolean;
  numInput: () => Promise<number | undefined>;
  strInput: () => Promise<string | undefined>;
  numOutput: (num: number) => void;
  strOutput: (str: string) => void;
}
export interface RunResult {
  machineState: MachineState;
  haltReason: "out-of-fuel" | "breakpoint" | "terminated";
}
export async function run(config: RunConfig): Promise<RunResult> {
  const { codeSpace, machineState, tracepathFuel } = config;
  machineState.tracepath.push([
    0,
    0,
    tracepathFuel,
    getMomentBitfields("down", "down", false, false),
  ]);
  while (!machineState.terminated) {
    if (config.machineFuel <= 0) {
      return { machineState, haltReason: "out-of-fuel" };
    } else --config.machineFuel;
    if (config.needInterrupt()) config.handleInterrupt(machineState);
    const code = codeSpace[machineState.cursor.y]?.[machineState.cursor.x];
    if (isValidAheuiCode(code)) {
      turnCursor(machineState.cursor, code.jung);
      const storageSize = getCurrentStorageSize(machineState);
      if (storageSize < code.parameterCount) reflectCursor(machineState.cursor);
      else if (arithmeticOperations.has(code.cho)) {
        doArithmeticOperation(machineState, code);
      } else if (code.cho === chos.ㅁ) {
        const storageIndex = machineState.currentStorageIndex;
        const storage = machineState.storages[storageIndex];
        const value = pop(storage, storageIndex)!;
        if (code.jong === jongs.ㅇ) {
          config.numOutput(value);
        } else if (code.jong === jongs.ㅎ) {
          config.strOutput(String.fromCodePoint(value));
        }
      } else if (code.cho === chos.ㅂ) {
        const storageIndex = machineState.currentStorageIndex;
        const storage = machineState.storages[storageIndex];
        if (code.jong === jongs.ㅇ) {
          const num = await config.numInput();
          if (num == null) reflectCursor(machineState.cursor);
          else storage.push(num);
        } else if (code.jong === jongs.ㅎ) {
          const str = await config.strInput();
          if (!str) reflectCursor(machineState.cursor);
          else storage.push(str.codePointAt(0) ?? 0);
        } else storage.push(code.strokeCount);
      } else doOperation(machineState, code);
    }
    if (!machineState.terminated) {
      moveCursor(machineState, codeSpace, tracepathFuel);
    }
  }
  return { machineState, haltReason: "terminated" };
}

function getCurrentStorageSize(machineState: MachineState): number {
  return machineState.storages[machineState.currentStorageIndex].length;
}

const arithmeticOperations = new Set(
  [chos.ㄷ, chos.ㄸ, chos.ㅌ, chos.ㄴ, chos.ㄹ],
);
function doArithmeticOperation(
  machineState: MachineState,
  code: Code,
): void {
  const storageIndex = machineState.currentStorageIndex;
  const storage = machineState.storages[storageIndex];
  const rhs = pop(storage, storageIndex)!;
  const lhs = pop(storage, storageIndex)!;
  let result: number;
  switch (code.cho) {
    case chos.ㄷ:
      result = (lhs + rhs) | 0;
      break;
    case chos.ㄸ:
      result = (lhs - rhs) | 0;
      break;
    case chos.ㅌ:
      result = (lhs * rhs) | 0;
      break;
    case chos.ㄴ:
      result = (lhs / rhs) | 0;
      break;
    case chos.ㄹ:
      result = (lhs % rhs) | 0;
      break;
    default:
      result = 0;
      break;
  }
  storage.push(result);
}

function doOperation(machineState: MachineState, code: Code): void {
  switch (code.cho) {
    case chos.ㅎ:
      machineState.terminated = true;
      return;
    case chos.ㅃ: {
      const storageIndex = machineState.currentStorageIndex;
      const storage = machineState.storages[storageIndex];
      duplicate(storage, storageIndex);
      return;
    }
    case chos.ㅍ: {
      const storageIndex = machineState.currentStorageIndex;
      const storage = machineState.storages[storageIndex];
      swap(storage, storageIndex);
      return;
    }
    case chos.ㅅ:
      machineState.currentStorageIndex = code.jong;
      return;
    case chos.ㅆ: {
      const srcStorageIndex = machineState.currentStorageIndex;
      const srcStorage = machineState.storages[srcStorageIndex];
      const dstStorage = machineState.storages[code.jong];
      send(dstStorage, srcStorage, srcStorageIndex);
      return;
    }
    case chos.ㅈ: {
      const storageIndex = machineState.currentStorageIndex;
      const storage = machineState.storages[machineState.currentStorageIndex];
      const a = pop(storage, storageIndex)!;
      const b = pop(storage, storageIndex)!;
      storage.push((a <= b) ? 1 : 0);
      return;
    }
    case chos.ㅊ: {
      const storageIndex = machineState.currentStorageIndex;
      const storage = machineState.storages[machineState.currentStorageIndex];
      if (pop(storage, storageIndex) === 0) reflectCursor(machineState.cursor);
    }
  }
}

function send(
  dstStorage: number[],
  srcStorage: number[],
  srcStorageIndex: number,
): void {
  dstStorage.push(pop(srcStorage, srcStorageIndex)!);
}

function pop(storage: number[], storageIndex: number): number | undefined {
  const isQueue = storageIndex === jongs.ㅇ || storageIndex === jongs.ㅎ;
  if (isQueue) return storage.shift();
  return storage.pop();
}

function duplicate(storage: number[], storageIndex: number): void {
  const isQueue = storageIndex === jongs.ㅇ || storageIndex === jongs.ㅎ;
  if (isQueue) storage.unshift(storage[0]);
  else storage.push(storage[storage.length - 1]);
}

function swap(storage: number[], storageIndex: number): void {
  const isQueue = storageIndex === jongs.ㅇ || storageIndex === jongs.ㅎ;
  if (isQueue) {
    const temp = storage[0];
    storage[0] = storage[1];
    storage[1] = temp;
  } else {
    const last = storage.length - 1;
    const secondLast = last - 1;
    const temp = storage[last];
    storage[last] = storage[secondLast];
    storage[secondLast] = temp;
  }
}

function moveCursor(
  machineState: MachineState,
  codeSpace: CodeSpace,
  tracepathFuel: number,
): void {
  const { cursor, tracepath } = machineState;
  const { dx, dy } = cursor;
  cursor.x += dx;
  cursor.y += dy;
  const line = codeSpace[cursor.y];
  const w = line?.length ?? 0;
  const h = codeSpace.length;
  let noxwrap = false;
  let noywrap = false;
  if (cursor.x < 0 && dx < 0) cursor.x = w - 1;
  else if (cursor.x >= w && dx > 0) cursor.x = 0;
  else noxwrap = true;
  if (cursor.y < 0 && dy < 0) cursor.y = h - 1;
  else if (cursor.y >= h && dy > 0) cursor.y = 0;
  else noywrap = true;
  const nojumped = (Math.abs(dx) < 2) && (Math.abs(dy) < 2);
  const isContinuous = nojumped && noxwrap && noywrap;
  const cursorDir = getCursorDir(cursor);
  const lastMoment = tracepath.at(-1);
  if (lastMoment) {
    let lastMomentBitfields = lastMoment[3];
    lastMomentBitfields = updateOutDir(lastMomentBitfields, cursorDir);
    lastMomentBitfields = updateOutConnected(lastMomentBitfields, isContinuous);
    lastMoment[3] = lastMomentBitfields;
  }
  stepTracepath(tracepath, [
    cursor.x,
    cursor.y,
    tracepathFuel,
    getMomentBitfields(cursorDir, cursorDir, isContinuous, false),
  ]);
}

function turnCursor(cursor: Cursor, jung: number): void {
  const dx = dxTable[jung];
  const dy = dyTable[jung];
  if (dx === reflect) reflectCursor(cursor);
  else if (dx !== ignore) cursor.dx = dx;
  if (dy === reflect) reflectCursor(cursor);
  else if (dy !== ignore) cursor.dy = dy;
}

function reflectCursor(cursor: Cursor): void {
  cursor.dx = (-cursor.dx) | 0;
  cursor.dy = (-cursor.dy) | 0;
}
