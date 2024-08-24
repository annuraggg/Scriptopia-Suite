export interface SclObject {
    name: string;
    type:
    | "boolean"
    | "integer"
    | "character"
    | "long"
    | "float"
    | "double"
    | "string"
    | "array"
    | "return";
    arrayProps?: {
        type:
        | "boolean"
        | "integer"
        | "character"
        | "long"
        | "float"
        | "double"
        | "string";
        size: number;
    };
}

export interface SclObjResponse {
    error: boolean;
    sclObject?: SclObject[];
    message?: string;
}