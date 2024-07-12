import { Document } from "mongoose";

export interface IResult {
  caseNo: number;
  caseId: string;
  output: string;
  isSample: boolean;
  memory: number;
  time: number;
  passed: boolean;
  console?: string;
}

export interface IDriverMeta {
  driver: string;
  timestamp: Date;
}

export interface ISubmission extends Document {
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
