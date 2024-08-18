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
    | "array";
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

interface Response {
  error: boolean;
  sclObject?: SclObject[];
  message?: string;
}

const VARIABLE_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const RESERVED_KEYWORDS = new Set([
  // JavaScript reserved keywords
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",

  // Python reserved keywords
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",

  // Java reserved keywords
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",

  // C/C++ reserved keywords
  "alignas",
  "alignof",
  "and",
  "and_eq",
  "asm",
  "auto",
  "bitand",
  "bitor",
  "bool",
  "break",
  "case",
  "catch",
  "char",
  "class",
  "compl",
  "const",
  "const_cast",
  "continue",
  "decltype",
  "default",
  "delete",
  "do",
  "double",
  "dynamic_cast",
  "else",
  "enum",
  "explicit",
  "export",
  "extern",
  "false",
  "float",
  "for",
  "friend",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "mutable",
  "namespace",
  "new",
  "noexcept",
  "not",
  "not_eq",
  "nullptr",
  "operator",
  "or",
  "or_eq",
  "private",
  "protected",
  "public",
  "register",
  "reinterpret_cast",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "static_assert",
  "static_cast",
  "struct",
  "switch",
  "template",
  "this",
  "thread_local",
  "throw",
  "true",
  "try",
  "typedef",
  "typeid",
  "typename",
  "union",
  "unsigned",
  "using",
  "virtual",
  "void",
  "volatile",
  "wchar_t",
  "while",
  "xor",
  "xor_eq",
]);
const VALID_DATATYPES = [
  "boolean",
  "integer",
  "character",
  "long",
  "float",
  "double",
  "string",
  "array",
  "return",

];


const sclToObject = (scl: string): Response => {
  const lines = scl.split("\n");
  const sclObject: SclObject[] = [];

  for (const line of lines) {
    if (line.trim() === "") continue;
    if (line.startsWith("#")) continue;
    const arrowIndex = line.indexOf("->");
    if (arrowIndex === -1) return { error: true, message: "Invalid SCL" };

    const dataType = line.slice(0, arrowIndex).trim() as SclObject["type"];
    const variableName = line.slice(arrowIndex + 2).trim();

    if (!dataType || !variableName)
      return { error: true, message: "Invalid SCL" };

    if (!VALID_DATATYPES.includes(dataType)) {
      return { error: true, message: "Invalid Datatype" };
    }

    if (dataType !== "array") {
      const { error, message } = validVariable(variableName);
      if (error) return { error: true, message: message };
      sclObject.push({ name: variableName, type: dataType });
    } else {
      const [arrayDataType, arrayName, arraySize] = variableName.split(" ");
      if (!arrayDataType || !arrayName || isNaN(parseInt(arraySize))) {
        return { error: true, message: "Invalid array specification" };
      }

      const { error, message } = validVariable(arrayName);
      if (error) return { error: true, message: message };

      if (!VALID_DATATYPES.includes(arrayDataType)) {
        return { error: true, message: "Invalid Datatype" };
      }

      sclObject.push({
        name: arrayName,
        type: dataType,
        arrayProps: {
          type: arrayDataType as
            | "boolean"
            | "integer"
            | "character"
            | "long"
            | "float"
            | "double"
            | "string",
          size: parseInt(arraySize),
        },
      });
    }
  }

  return { error: false, sclObject };
};

const validVariable = (variable: string) => {
  if (!VARIABLE_REGEX.test(variable))
    return { error: true, message: "Invalid variable name" };

  if (RESERVED_KEYWORDS.has(variable))
    return { error: true, message: "Reserved keyword used as variable name" };

  return { error: false, variable };
};

export default sclToObject;
