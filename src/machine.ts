import { type CodeSpace, isValidAheuiCode } from "./code.ts";
import { dxTable, dyTable, ignore, jongTable, reflect } from "./table.ts";
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
  currentStorage: number;
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
    currentStorage: 0,
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
  numInput: () => Promise<number>;
  strInput: () => Promise<string>;
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
      // TODO: do operation
    }
    if (!machineState.terminated) {
      moveCursor(machineState, codeSpace, tracepathFuel);
    }
  }
  return { machineState, haltReason: "terminated" };
}

function getCurrentStorageSize(machineState: MachineState): number {
  return machineState.storages[machineState.currentStorage].length;
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
