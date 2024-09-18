interface SclObject {
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

interface SclObjResponse {
    error: boolean;
    sclObject?: SclObject[];
    message?: string;
}

export type { SclObject, SclObjResponse };