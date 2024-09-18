export interface RunResponse {
  STATUS: "PASSED" | "FAILED";
  avgMemory: number;
  avgTime: number;
  failedCaseNo: number;
  results: RunResponseResult[];
}

export interface RunResponseResult {
  input: string[];
  output: string;
  expected: string;
  passed: boolean;
  isSample: boolean;
  memory: number;
  time: number;
  consoleOutput: string[];
}
