import { jongTable } from "./table.ts";
import { Tracepath } from "./tracepath/tracepath.ts";

export interface MachineState {
  cursor: Cursor;
  storages: number[][];
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
    terminated: false,
    tracepath: [],
  };
}

export interface RunConfig {
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
  return { machineState: config.machineState, haltReason: "terminated" };
}
