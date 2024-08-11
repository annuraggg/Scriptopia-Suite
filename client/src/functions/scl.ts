const allowedDatatypes = [
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

export interface sclReturnType {
  error: boolean;
  message: string | null;
  code: string | null;
  variableWithDataType: { name: string; type: string }[];
}

const convertSclToJs = (scl: string): sclReturnType => {
  const code: string[] = [];
  const names: string[] = [];

  const variableAndType: { name: string; type: string }[] = [];

  let returnStatement = "";

  const keywords = [
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
    "enum",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
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
    "as",
    "assert",
    "async",
    "boolean",
    "constructor",
    "declare",
    "any",
    "never",
    "unknown",
    "object",
    "string",
    "number",
    "symbol",
    "bigint",
    "public",
    "private",
    "protected",
    "static",
    "readonly",
    "namespace",
    "module",
    "type",
    "from",
    "of",
  ];

  const variableNameRegex = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

  const mainCode = [];
  const lines = scl.split("\n");
  for (const line of lines) {
    if (line.trim() === "") continue;
    if (line.trim().startsWith("#")) continue;
    const arrow = line.indexOf("->");

    if (arrow === -1)
      return {
        error: true,
        message: "Invalid Syntax",
        code: null,
        variableWithDataType: [],
      };

    const datatypeRaw = line.substring(0, arrow).trim();
    const datatype = datatypeRaw.toLowerCase().trim();
    const variable = line.substring(datatype.length + 2).trim();

    if (!allowedDatatypes.includes(datatype))
      return {
        error: true,
        message: "Invalid Datatype",
        code: null,
        variableWithDataType: [],
      };

    if (datatype === "return") {
      if (names.includes(variable)) returnStatement = `  return ${variable};`;
      else
        return {
          error: true,
          message: "Return Variable Not Found",
          code: null,
          variableWithDataType: [],
        };
      continue;
    }

    if (names.includes(variable))
      return {
        error: true,
        message: "Variable Already Exists",
        code: null,
        variableWithDataType: [],
      };

    if (keywords.includes(variable))
      return {
        error: true,
        message: "Invalid Variable Name (Keyword)",
        code: null,
        variableWithDataType: [],
      };

    if (!variableNameRegex.test(variable) && datatype != "array")
      return {
        error: true,
        message: "Invalid Variable Name (Alphanumeric)",
        code: null,
        variableWithDataType: [],
      };

    variableAndType.push({ name: variable, type: datatype });

    if (datatype == "array") {
      const splitItems = variable.split(" ");
      const arrDatatype = splitItems[0];
      const arrName = splitItems[1];
      const arrLength = splitItems[2];

      if (!allowedDatatypes.includes(arrDatatype))
        return {
          error: true,
          message: "Invalid Datatype",
          code: null,
          variableWithDataType: [],
        };

      if (names.includes(arrName))
        return {
          error: true,
          message: "Variable Already Exists",
          code: null,
          variableWithDataType: [],
        };

      if (keywords.includes(arrName))
        return {
          error: true,
          message: "Invalid Variable Name (Keyword)",
          code: null,
          variableWithDataType: [],
        };

      if (!variableNameRegex.test(arrName))
        return {
          error: true,
          message: "Invalid Variable Name (Alphanumeric)",
          code: null,
          variableWithDataType: [],
        };

      if (isNaN(parseInt(arrLength)))
        return {
          error: true,
          message: "Invalid Array Length",
          code: null,
          variableWithDataType: [],
        };

      names.push(arrName);

      const finalString = `   const ${arrName}; // ${arrDatatype} array with length ${arrLength}`;
      mainCode.push(finalString);
    } else {
      names.push(variable);

      const finalString = `   const ${variable}; // ${datatype}`;
      mainCode.push(finalString);
    }
  }

  mainCode.forEach((line, index) => {
    let conversion: string;

    if (line.includes("int")) conversion = "parseInt";
    else if (line.includes("double")) conversion = "parseFloat";
    else if (line.includes("long")) conversion = "BigInt";
    else conversion = ""; // Direct assignment for `char` and `char[]`

    if (conversion) {
      // Replace the comment with initialization
      mainCode[index] = line.replace(
        /;.*$/,
        ` = ${conversion}(input[${index++}]); // Datatype: ${
          line.trim().split(" ")[3]
        }`
      );
    } else {
      // Direct assignment for `char` and `char[]`
      mainCode[index] = line.replace(
        /;.*$/,
        ` = input[${index++}]; // Datatype: ${line.trim().split(" ")[3]} ${
          line.trim().split(" ")[4] === "array" ? "array" : ""
        }`
      );
    }
  });

  code.push(`const execute = (${names.join(", ")}) => {`);
  code.push("  // Your code here");
  code.push(returnStatement);
  code.push("};\n");

  code.push("const main = (input) => {");
  code.push(mainCode.join("\n"));

  code.push("\n   return execute(");
  code.push("    " + names.join(", "));
  code.push("  );");

  code.push("};");
  return {
    error: false,
    message: null,
    code: code.join("\n"),
    variableWithDataType: variableAndType,
  };
};

const convertSclToC = (scl: string): sclReturnType => {
  const code: string[] = [];
  const names: string[] = [];

  const variableWithDataType: { name: string; type: string }[] = [];
  const nameWithType: string[] = [];

  const keywords = [
    "auto",
    "break",
    "case",
    "char",
    "const",
    "continue",
    "default",
    "do",
    "double",
    "else",
    "enum",
    "extern",
    "float",
    "for",
    "goto",
    "if",
    "inline",
    "int",
    "long",
    "register",
    "return",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "switch",
    "typedef",
    "union",
    "unsigned",
    "void",
    "volatile",
    "while",
    "int8_t",
    "int16_t",
    "int32_t",
    "int64_t",
    "uint8_t",
    "uint16_t",
    "uint32_t",
    "uint64_t",
    "bool",
    "true",
    "false",
    "NULL",
  ];

  const variableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const mainCode = [];
  let returnStatement = "";

  const lines = scl.split("\n");
  for (const line of lines) {
    if (line.trim() === "") continue;
    if (line.trim().startsWith("#")) continue;

    const arrow = line.indexOf("->");

    if (arrow === -1)
      return {
        error: true,
        message: "Invalid Syntax",
        code: null,
        variableWithDataType: [],
      };

    const datatypeRaw = line.substring(0, arrow).trim();
    const datatype = datatypeRaw.toLowerCase().trim();
    const variable = line.substring(datatype.length + 2).trim();

    if (!allowedDatatypes.includes(datatype) && datatype !== "array")
      return {
        error: true,
        message: "Invalid Datatype",
        code: null,
        variableWithDataType: [],
      };

    if (datatype === "return") {
      if (names.includes(variable)) returnStatement = `  return ${variable};`;
      else
        return {
          error: true,
          message: "Return Variable Not Found",
          code: null,
          variableWithDataType: [],
        };
      continue;
    }

    if (names.includes(variable))
      return {
        error: true,
        message: "Variable Already Exists",
        code: null,
        variableWithDataType: [],
      };

    if (keywords.includes(variable))
      return {
        error: true,
        message: "Invalid Variable Name (Keyword)",
        code: null,
        variableWithDataType: [],
      };

    if (!variableNameRegex.test(variable) && datatype !== "array")
      return {
        error: true,
        message: "Invalid Variable Name (Alphanumeric)",
        code: null,
        variableWithDataType: [],
      };

    variableWithDataType.push({ name: variable, type: datatype });

    if (datatype === "array") {
      const splitItems = variable.split(" ");
      const arrDatatype = splitItems[0];
      const arrName = splitItems[1];
      const arrLength = splitItems[2];

      if (!allowedDatatypes.includes(arrDatatype))
        return {
          error: true,
          message: "Invalid Datatype",
          code: null,
          variableWithDataType: [],
        };

      if (names.includes(arrName))
        return {
          error: true,
          message: "Variable Already Exists",
          code: null,
          variableWithDataType: [],
        };

      if (keywords.includes(arrName))
        return {
          error: true,
          message: "Invalid Variable Name (Keyword)",
          code: null,
          variableWithDataType: [],
        };

      if (!variableNameRegex.test(arrName))
        return {
          error: true,
          message: "Invalid Variable Name (Alphanumeric)",
          code: null,
          variableWithDataType: [],
        };

      if (isNaN(parseInt(arrLength)))
        return {
          error: true,
          message: "Invalid Array Length",
          code: null,
          variableWithDataType: [],
        };

      names.push(arrName);

      let cDatatype: string;

      switch (arrDatatype) {
        case "boolean":
          cDatatype = "int"; // C does not have a boolean type; use int instead
          break;
        case "integer":
        case "long":
          cDatatype = "int";
          break;
        case "float":
        case "double":
          cDatatype = "double";
          break;
        case "character":
          cDatatype = "char";
          break;
        case "string":
          cDatatype = "char"; // C strings are arrays of char
          break;
        default:
          cDatatype = "int"; // Default to int for unspecified datatypes
      }

      nameWithType.push(`${cDatatype} ${arrName}[${arrLength}]`);
      const finalString = `  ${cDatatype} ${arrName}[${arrLength}]; // Array of ${arrDatatype} with length ${arrLength}`;
      mainCode.push(finalString);
    } else {
      let cDatatype: string;

      switch (datatype) {
        case "boolean":
          cDatatype = "int"; // C does not have a boolean type; use int instead
          break;
        case "integer":
        case "long":
          cDatatype = "int";
          break;
        case "float":
        case "double":
          cDatatype = "double";
          break;
        case "character":
          cDatatype = "char";
          break;
        case "string":
          cDatatype = "char"; // C strings are arrays of char
          break;
        default:
          cDatatype = "int"; // Default to int for unspecified datatypes
      }

      nameWithType.push(
        `${cDatatype} ${variable}${datatype === "string" ? "[1024]" : ""}`
      );
      names.push(variable);

      const finalString = `  ${cDatatype} ${variable}${
        datatype === "string" ? "[1024]" : ""
      }; // ${datatype}`;
      mainCode.push(finalString);
    }
  }

  // Add initialization for command-line arguments
  mainCode.forEach((line, index) => {
    let conversion: string;

    if (line.includes("int")) conversion = "atoi";
    else if (line.includes("double")) conversion = "atof";
    else if (line.includes("long")) conversion = "strtol";
    else conversion = ""; // Direct assignment for `char` and `char[]`

    if (conversion) {
      // Replace the comment with initialization
      mainCode[index] = line.replace(
        /;.*$/,
        ` = ${conversion}(argv[${index++}]); // Initialized from argv[${index}]`
      );
    } else {
      // Direct assignment for `char` and `char[]`
      mainCode[index] = line.replace(
        /;.*$/,
        ` = argv[${index++}]; // Initialized from argv[${index}]`
      );
    }
  });

  const getReturnType = (name: string) => {
    for (const item of nameWithType) {
      if (item.includes(name)) {
        return item.split(" ")[0];
      }
    }
    return "int"; // Default to int if not found
  };

  const codeReturnType = getReturnType(
    returnStatement.trim().split(" ")[1].slice(0, -1)
  );

  code.push("#include <stdio.h>");
  code.push("#include <stdlib.h>");
  code.push("#include <string.h>");
  code.push(" ");

  code.push(`${codeReturnType} execute(${nameWithType.join(", ")}) {`);
  code.push(returnStatement);
  code.push("  // Your code here");
  code.push("}\n");

  code.push("int main(int argc, char* argv[]) {");

  code.push(mainCode.join("\n"));

  code.push("\n  return 0;");
  code.push("}");

  return {
    error: false,
    message: null,
    code: code.join("\n"),
    variableWithDataType,
  };
};

export { convertSclToJs, convertSclToC };
