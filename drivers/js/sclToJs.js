const ALLOWED_DATATYPES = new Set([
  "boolean",
  "integer",
  "character",
  "long",
  "float",
  "double",
  "string",
  "array",
  "return",
]);

const JAVASCRIPT_KEYWORDS = new Set([
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
]);

const VARIABLE_NAME_REGEX = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

function validateInput(datatype, variable) {
  if (!ALLOWED_DATATYPES.has(datatype)) {
    throw new Error("Invalid Datatype");
  }

  if (datatype === "array") {
    if (!variable.includes(" ")) {
      throw new Error("Invalid Array Declaration");
    }
    return variable.split(" ")[1];
  }

  if (
    JAVASCRIPT_KEYWORDS.has(variable) ||
    !VARIABLE_NAME_REGEX.test(variable)
  ) {
    console.log(variable);
    throw new Error("Invalid Variable Name");
  }

  return variable;
}

function parseArrayDeclaration(variable) {
  const [arrDatatype, arrName, arrLength] = variable.split(" ");
  validateInput(arrDatatype, arrName);
  if (isNaN(parseInt(arrLength))) {
    throw new Error("Invalid Array Length");
  }
  return { arrDatatype, arrName, arrLength };
}

function generateVariableCode(variable, datatype, index) {
  if (datatype === "array") {
    const { arrDatatype, arrName, arrLength } = parseArrayDeclaration(variable);
    return `const ${arrName} = input[${index}]; // ${arrDatatype} array with length ${arrLength}`;
  }

  let conversion = "";
  if (datatype === "integer") conversion = "parseInt";
  else if (["double", "float"].includes(datatype)) conversion = "parseFloat";
  else if (datatype === "long") conversion = "BigInt";

  const assignment = conversion
    ? `${conversion}(input[${index}])`
    : `input[${index}]`;
  return `const ${variable} = ${assignment}; // ${datatype}`;
}

// * Main Function
function convertSclToJs(scl) {
  const lines = scl
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  const variables = [];
  const variableAndType = [];
  let returnStatement = "";

  const variableCode = lines
    .map((line, index) => {
      const [datatypeRaw, variable] = line
        .split("->")
        .map((part) => part.trim());
      const datatype = datatypeRaw.toLowerCase();

      if (datatype === "return") {
        if (!variables.includes(variable)) {
          throw new Error("Return Variable Not Found");
        }
        returnStatement = `return ${variable};`;
        return null;
      }

      if (variables.includes(variable)) {
        throw new Error("Variable Already Exists");
      }

      const varName = validateInput(datatype, variable);

      variables.push(varName);
      variableAndType.push({ name: variable, type: datatype });
      return generateVariableCode(variable, datatype, index);
    })
    .filter(Boolean);

  const head = [];

  const body = `
const execute = (${variables.join(", ")}) => {
\t// Your code here
\t${returnStatement}
};`;

  const tail = `
const main = (input) => {
${variableCode.map((code) => `\t${code}`).join("\n")}

\treturn execute(${variables.join(", ")});
};`;

  const code = [head, body, tail];

  return {
    error: false,
    message: null,
    code: code.join("\n"),
    variableWithDataType: variableAndType,
    syntax: {
      head,
      body,
      tail,
    },
  };
}

export default convertSclToJs;
