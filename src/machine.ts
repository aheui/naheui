import { jongTable } from "./table.ts";
import { Tracepath } from "./tracepath/tracepath.ts";

export interface MachineState {
  cursor: Cursor;
  storages: number[][];
  terminated: boolean;
  breakpoints: Record</* y */ number, Record</* x */ number, boolean>>;
  tracepath: Tracepath;
}

export interface Cursor {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export function createMachineState(): MachineState {
  return {
    cursor: { x: 0, y: 0, dx: 0, dy: 1 },
    storages: jongTable.map(() => []),
    terminated: false,
    breakpoints: {},
    tracepath: [],
  };
}
