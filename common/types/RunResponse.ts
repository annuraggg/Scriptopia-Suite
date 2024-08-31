interface IRunResponse {
  STATUS: "PASSED" | "FAILED";
  avgMemory: number;
  avgTime: number;
  failedCaseNo: number;
  results: IRunResponseResult[];
}

interface IError {
  name: string;
  message: string;
}

interface IRunResponseResult {
  input: string[];
  output: string;
  expected: string;
  passed: boolean;
  isSample: boolean;
  memory: number;
  time: number;
  error: IError;
  consoleOutput: string[];
}

export type { IRunResponse, IRunResponseResult };
