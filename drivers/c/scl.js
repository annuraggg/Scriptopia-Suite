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

const C_KEYWORDS = new Set([
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
]);

const VARIABLE_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

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

  if (C_KEYWORDS.has(variable) || !VARIABLE_NAME_REGEX.test(variable)) {
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

function getCDatatype(datatype) {
  switch (datatype) {
    case "boolean":
      return "int";
    case "integer":
    case "long":
      return "int";
    case "float":
    case "double":
      return "double";
    case "character":
      return "char";
    case "string":
      return "char*";
    default:
      return "int";
  }
}

function generateVariableCode(variable, datatype, index) {
  const cDatatype = getCDatatype(datatype);

  if (datatype === "array") {
    const { arrDatatype, arrName, arrLength } = parseArrayDeclaration(variable);
    return `${getCDatatype(
      arrDatatype
    )} ${arrName}[${arrLength}]; // ${arrDatatype} array with length ${arrLength}`;
  }

  let conversion = "";
  if (cDatatype === "int") conversion = "atoi";
  else if (cDatatype === "double") conversion = "atof";
  else if (cDatatype === "char*") conversion = "";
  else conversion = "*"; // for char

  const assignment = conversion
    ? `${conversion}(argv[${index + 1}])`
    : `argv[${index + 1}]`;
  return `${cDatatype} ${variable}${
    datatype === "string" ? "" : ""
  } = ${assignment}; // ${datatype}`;
}

// * Main Function
function convertSclToC(scl) {
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

  const head = [
    "#include <stdio.h>",
    "#include <stdlib.h>",
    "#include <string.h>",
    "",
  ];

  const body = `
  ${getCDatatype(returnStatement.split(" ")[1] || "int")} execute(${variables
    .map(
      (v) =>
        `${getCDatatype(variableAndType.find((vt) => vt.name === v).type)} ${v}`
    )
    .join(", ")}) {
  \t// Your code here
  \t${returnStatement}
  }`;

  const tail = `
  int main(int argc, char* argv[]) {
  ${variableCode.map((code) => `\t${code}`).join("\n")}
  
  \treturn 0;
  }`;

  const code = [...head, body, tail];

  return {
    error: false,
    message: null,
    code: code.join("\n"),
    variableWithDataType: variableAndType,
    syntax: {
      head: head.join("\n"),
      body,
      tail,
    },
  };
}

export default convertSclToC;
