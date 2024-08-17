interface IResult {
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
  driver: string;
  timestamp: Date;
}

export interface ISubmission {
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
  createdAt: Date;
}

export default ISubmission;
export type { IResult, IDriverMeta };
