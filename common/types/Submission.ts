interface Result {
  _id?: string;
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
  _id?: string;
  driver: string;
  timestamp: Date;
}

interface Submission {
  _id?: string;
  problem: string; // should match the ObjectId type in the schema
  user: string; // should match the ObjectId type in the schema
  code: string;
  language: string;
  status: "FAILED" | "SUCCESS";
  avgMemory: number;
  avgTime: number;
  failedCaseNumber: number;
  results: Result[];
  meta: DriverMeta;
  createdAt?: Date;
}

export type { Result, DriverMeta, Submission };
