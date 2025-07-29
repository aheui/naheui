import process from "node:process";
import { toText } from "jsr:@std/streams@1/to-text";

import { createCodeSpace } from "./code.ts";
import { createMachineState, run } from "./machine.ts";

class InputParser {
  private buffer: string;
  private pos = 0;
  private constructor(buffer: string) {
    this.buffer = buffer;
  }
  static async fromStdin(): Promise<InputParser> {
    const text = await toText(Deno.stdin.readable);
    return new InputParser(text);
  }
  static empty(): InputParser {
    return new InputParser("");
  }
  readChar(): string | undefined {
    if (this.pos >= this.buffer.length) return;
    const char = this.buffer.codePointAt(this.pos);
    if (char == null) return;
    this.pos += char > 0xFFFF ? 2 : 1;
    return String.fromCodePoint(char);
  }
  readNumber(): number | undefined {
    while (this.pos < this.buffer.length) {
      const char = this.buffer.codePointAt(this.pos);
      if (char == null) break;
      const charStr = String.fromCodePoint(char);
      if (!/\s/.test(charStr)) break;
      this.pos += char > 0xFFFF ? 2 : 1;
    }
    if (this.pos >= this.buffer.length) return;
    let numStr = "";
    const firstChar = this.buffer.codePointAt(this.pos);
    if (firstChar === 45) {
      numStr += "-";
      this.pos++;
    }
    while (this.pos < this.buffer.length) {
      const char = this.buffer.codePointAt(this.pos);
      if (char == null) break;
      const charStr = String.fromCodePoint(char);
      if (!/[0-9]/.test(charStr)) break;
      numStr += charStr;
      this.pos += char > 0xFFFF ? 2 : 1;
    }
    if (numStr.length < 1 || numStr === "-") return;
    return Number(numStr);
  }
}

const sourceCode = await Deno.readTextFile(Deno.args[0]);
const codeSpace = createCodeSpace(sourceCode);
const machineState = createMachineState();
const inputParser = Deno.stdin.isTerminal()
  ? InputParser.empty()
  : await InputParser.fromStdin();

const result = await run({
  codeSpace,
  machineState,
  machineFuel: Infinity,
  tracepathFuel: 0,
  needInterrupt: () => false,
  handleInterrupt: () => {},
  checkBreakpoint: () => false,
  numInput: () => Promise.resolve(inputParser.readNumber()),
  strInput: () => Promise.resolve(inputParser.readChar()),
  numOutput: (num) => process.stdout.write(String(num)),
  strOutput: (str) => process.stdout.write(str),
});

if (result.machineState.phase.type === "terminated") {
  Deno.exit(result.machineState.phase.exitCode);
} else {
  Deno.exit(-1);
}
