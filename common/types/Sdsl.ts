export interface SdslInput {
    type: string;
    elementType: string;
    name: string;
    size: number | null;
  }
  
  export interface ParsedSdsl {
    inputs: SdslInput[];
    returnType: string;
  }
  
  export interface LanguageTypeMap {
    [key: string]: string;
  }
  
  export interface TypeMap {
    [key: string]: LanguageTypeMap;
  }
  
  export type LanguageGenerator = (
    inputs: SdslInput[],
    returnType: string,
    fullCode: boolean
  ) => string;
  
  export interface GeneratorResult {
    success: boolean;
    code: string | null;
    error: string | null;
    language?: string;
    metadata?: {
      inputCount: number;
      hasArrayInputs: boolean;
      returnType: string;
      timestamp: number;
      generatedAt?: number;
    };
  }
  
  export interface ParseResult {
    success: boolean;
    error: string | null;
    data: ParsedSdsl | null;
    metadata?: {
      inputCount: number;
      hasArrayInputs: boolean;
      returnType: string;
      timestamp: number;
    };
  }