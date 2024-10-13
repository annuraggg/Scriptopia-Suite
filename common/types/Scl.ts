export interface SCLInput {
  type: string;
  name: string;
  elementType: string;
  size?: number | null;
}

export interface ParsedSCL {
  inputs: SCLInput[];
  returnType: string;
}

export interface LanguageTypeMap {
  [key: string]: string;
}

export interface TypeMap {
  [key: string]: LanguageTypeMap;
}

export type LanguageGenerator = (
  inputs: SCLInput[],
  returnType: string
) => string;
