export interface Submission {
  status: string;
  time: string;
  language: string;
  runtime: string;
  memory: string;
  beatsTime: string;
  beatsMemory: string;
  code: string;
}

export interface Case {
  name: string;
  input: string[];
  output: string;
  difficulty: string;
  score: number;
  isSample: boolean;
  expected: string;
}