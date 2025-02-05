interface Result {
  caseNo: number;
  caseId: string;
  output: string;
  isSample: boolean;
  memory: number;
  time: number;
  passed: boolean;
  console?: string;
}

interface DriverMeta {
  driver: string;
  timestamp: Date;
}

interface Submission {
  problem?: string;
  user?: string;
  code: string;
  language: string;
  status: "FAILED" | "SUCCESS";
  avgMemory: number;
  avgTime: number;
  failedCaseNumber: number;
  results: Result[];
  meta: DriverMeta;
  createdAt: Date;
  updatedAt: Date;
}

export type { Result, DriverMeta, Submission };
