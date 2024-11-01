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
  "matrix", // New: Support for 2D arrays
  "tuple", // New: Support for fixed-size heterogeneous collections
];

// New: Support for array/matrix dimensions
interface ArrayDimensions {
  rows?: number;
  cols?: number;
  length?: number;
}

export interface sdslReturnType {
  error: boolean;
  message: string | null;
  code: string | null;
  variableWithDataType: {
    name: string;
    type: string;
    isArray?: boolean;
    arrayInfo?: {
      elementType: string;
      dimensions: ArrayDimensions;
    };
  }[];
}

const convertsdslToJs = (sdsl: string): sdslReturnType => {
  const code: string[] = [];
  const names: string[] = [];
  const variableAndType: {
    name: string;
    type: string;
    isArray?: boolean;
    arrayInfo?: {
      elementType: string;
      dimensions: ArrayDimensions;
    };
  }[] = [];

  let returnStatement = "";
  let returnType = "";

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
  const lines = sdsl.split("\n");

  for (const line of lines) {
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    const arrow = line.indexOf("->");
    if (arrow === -1) {
      return {
        error: true,
        message: "Invalid Syntax",
        code: null,
        variableWithDataType: [],
      };
    }

    const datatypeRaw = line.substring(0, arrow).trim();
    const datatype = datatypeRaw.toLowerCase().trim();
    const variable = line.substring(datatype.length + 2).trim();

    // Handle return type declaration
    if (datatype === "return") {
      // New: Support for array returns
      const returnParts = variable.split(" ");
      if (returnParts.length > 1) {
        // Array return type: "return array integer result"
        if (returnParts[0] === "array") {
          returnType = `${returnParts[1]}[]`;
          returnStatement = `  return ${returnParts[2]};`;
          if (!names.includes(returnParts[2])) {
            return {
              error: true,
              message: "Return Variable Not Found",
              code: null,
              variableWithDataType: [],
            };
          }
        }
      } else {
        // Simple return type
        if (names.includes(variable)) {
          returnType = datatype;
          returnStatement = `  return ${variable};`;
        } else {
          return {
            error: true,
            message: "Return Variable Not Found",
            code: null,
            variableWithDataType: [],
          };
        }
      }
      continue;
    }

    // Validate datatype
    if (!allowedDatatypes.includes(datatype)) {
      return {
        error: true,
        message: "Invalid Datatype",
        code: null,
        variableWithDataType: [],
      };
    }

    // Handle array declarations
    if (datatype === "array") {
      const splitItems = variable.split(" ");
      if (splitItems.length < 3) {
        return {
          error: true,
          message: "Invalid Array Declaration",
          code: null,
          variableWithDataType: [],
        };
      }

      const [arrDatatype, arrName, arrLength] = splitItems;

      // Validate array parameters
      if (
        !allowedDatatypes.includes(arrDatatype) ||
        !variableNameRegex.test(arrName) ||
        isNaN(parseInt(arrLength)) ||
        names.includes(arrName) ||
        keywords.includes(arrName)
      ) {
        return {
          error: true,
          message: "Invalid Array Parameters",
          code: null,
          variableWithDataType: [],
        };
      }

      names.push(arrName);
      variableAndType.push({
        name: arrName,
        type: "array",
        isArray: true,
        arrayInfo: {
          elementType: arrDatatype,
          dimensions: { length: parseInt(arrLength) },
        },
      });

      const finalString = `   const ${arrName} = new Array(${arrLength}); // ${arrDatatype} array`;
      mainCode.push(finalString);
    }
    // Handle matrix declarations
    else if (datatype === "matrix") {
      const splitItems = variable.split(" ");
      if (splitItems.length < 4) {
        return {
          error: true,
          message: "Invalid Matrix Declaration",
          code: null,
          variableWithDataType: [],
        };
      }

      const [matrixDatatype, matrixName, rows, cols] = splitItems;

      // Validate matrix parameters
      if (
        !allowedDatatypes.includes(matrixDatatype) ||
        !variableNameRegex.test(matrixName) ||
        isNaN(parseInt(rows)) ||
        isNaN(parseInt(cols)) ||
        names.includes(matrixName) ||
        keywords.includes(matrixName)
      ) {
        return {
          error: true,
          message: "Invalid Matrix Parameters",
          code: null,
          variableWithDataType: [],
        };
      }

      names.push(matrixName);
      variableAndType.push({
        name: matrixName,
        type: "matrix",
        isArray: true,
        arrayInfo: {
          elementType: matrixDatatype,
          dimensions: {
            rows: parseInt(rows),
            cols: parseInt(cols),
          },
        },
      });

      const finalString = `   const ${matrixName} = Array(${rows}).fill().map(() => Array(${cols})); // ${matrixDatatype} matrix`;
      mainCode.push(finalString);
    }
    // Handle tuple declarations
    else if (datatype === "tuple") {
      const splitItems = variable.split(" ");
      const tupleName = splitItems[0];
      const tupleTypes = splitItems.slice(1);

      if (
        !variableNameRegex.test(tupleName) ||
        names.includes(tupleName) ||
        keywords.includes(tupleName)
      ) {
        return {
          error: true,
          message: "Invalid Tuple Parameters",
          code: null,
          variableWithDataType: [],
        };
      }

      names.push(tupleName);
      variableAndType.push({
        name: tupleName,
        type: "tuple",
        arrayInfo: {
          elementType: tupleTypes.join(","),
          dimensions: { length: tupleTypes.length },
        },
      });

      const finalString = `   const ${tupleName} = []; // Tuple of ${tupleTypes.join(
        ", "
      )}`;
      mainCode.push(finalString);
    }
    // Handle regular variable declarations
    else {
      if (
        !variableNameRegex.test(variable) ||
        names.includes(variable) ||
        keywords.includes(variable)
      ) {
        return {
          error: true,
          message: "Invalid Variable Declaration",
          code: null,
          variableWithDataType: [],
        };
      }

      names.push(variable);
      variableAndType.push({ name: variable, type: datatype });

      const finalString = `   const ${variable}; // ${datatype}`;
      mainCode.push(finalString);
    }
  }

  // Generate initialization code
  mainCode.forEach((line, index) => {
    let conversion: string;
    const varInfo = variableAndType[index];

    if (varInfo.isArray) {
      if (varInfo.type === "matrix") {
        // Initialize matrix with input values
        const { rows, cols } = varInfo?.arrayInfo?.dimensions || {};
        mainCode[index] = line.replace(
          /;.*$/,
          ` = Array(${rows}).fill().map((_, i) => Array(${cols}).fill().map((_, j) => input[i * ${cols} + j]));`
        );
      } else {
        // Initialize array with input values
        mainCode[index] = line.replace(
          /;.*$/,
          ` = input.slice(${
            index * (varInfo?.arrayInfo?.dimensions?.length || 0)
          }, ${(index + 1) * (varInfo?.arrayInfo?.dimensions?.length || 0)});`
        );
      }
    } else {
      // Regular variable initialization
      switch (varInfo.type) {
        case "integer":
        case "long":
          conversion = "parseInt";
          break;
        case "float":
        case "double":
          conversion = "parseFloat";
          break;
        default:
          conversion = "";
      }

      if (conversion) {
        mainCode[index] = line.replace(
          /;.*$/,
          ` = ${conversion}(input[${index}]); // Initialized from input[${index}]`
        );
      } else {
        mainCode[index] = line.replace(
          /;.*$/,
          ` = input[${index}]; // Initialized from input[${index}]`
        );
      }
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

const convertsdslToC = (sdsl: string): sdslReturnType => {
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

  const lines = sdsl.split("\n");
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
    returnStatement.trim()?.split(" ")?.[1]?.slice(0, -1)
  );

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
    variableWithDataType,
  };
};

export { convertsdslToJs };
