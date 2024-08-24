interface IResult {
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

interface IDriverMeta {
  _id?: string;
  driver: string;
  timestamp: Date;
}

interface ISubmission {
  _id?: string;
  problem: string;
  user: string;
  code: string;
  language: string;
  status: "FAILED" | "SUCCESS";
  avgMemory: number;
  avgTime: number;
  failedCaseNumber: number;
  results: IResult[];
  meta: IDriverMeta;
  createdAt?: Date;
}

export type { IResult, IDriverMeta, ISubmission };
