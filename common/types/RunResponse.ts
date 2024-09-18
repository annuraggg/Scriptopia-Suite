interface RunResponse {
  STATUS: "PASSED" | "FAILED";
  avgMemory: number;
  avgTime: number;
  failedCaseNo: number;
  results: RunResponseResult[];
}

interface Error {
  name: string;
  message: string;
}

interface RunResponseResult {
  input: string[];
  output: string;
  expected: string;
  passed: boolean;
  isSample: boolean;
  memory: number;
  time: number;
  error: Error;
  consoleOutput: string[];
}

export type { RunResponse, RunResponseResult };
