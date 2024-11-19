interface RunResponse {
  STATUS: "PASSED" | "FAILED";
  avgMemory: number;
  avgTime: number;
  failedCaseNo: number;
  results: RunResponseResult[];
}

interface RunResponseResult {
  input: string[];
  output: string;
  expected: string;
  passed: boolean;
  isSample: boolean;
  memory: number;
  time: number;
  error: string;
  consoleOutput: string[];
}

export type { RunResponse, RunResponseResult };
