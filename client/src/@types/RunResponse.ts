export interface IRunResponse {
  STATUS: "PASSED" | "FAILED";
  avgMemory: number;
  avgTime: number;
  failedCaseNo: number;
  results: IRunResponseResult[];
}

export interface IRunResponseResult {
  input: string;
  output: string;
  expected: string;
  passed: boolean;
  isSample: boolean;
  memory: number;
  time: number;
}
