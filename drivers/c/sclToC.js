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
    const [arrDatatype, arrName, arrLength] = variable.split(" ");
    if (!arrDatatype || !arrName || !arrLength) {
      throw new Error("Invalid Array Declaration");
    }
    if (C_KEYWORDS.has(arrName) || !VARIABLE_NAME_REGEX.test(arrName)) {
      throw new Error("Invalid Variable Name");
    }
    if (isNaN(parseInt(arrLength))) {
      throw new Error("Invalid Array Length");
    }
    return arrName;
  }

  if (C_KEYWORDS.has(variable) || !VARIABLE_NAME_REGEX.test(variable)) {
    throw new Error("Invalid Variable Name");
  }

  return variable;
}

function getCDatatype(datatype) {
  switch (datatype) {
    case "boolean":
      return "int";
    case "integer":
      return "int";
    case "long":
      return "long";
    case "float":
      return "float";
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
    const [arrDatatype, arrName, arrLength] = variable.split(" ");
    return `${getCDatatype(
      arrDatatype
    )} ${arrName}[${arrLength}]; // Array of ${arrDatatype} with length ${arrLength}`;
  }

  let conversion = "";
  if (cDatatype === "int") conversion = "atoi";
  else if (cDatatype === "long") conversion = "atol";
  else if (cDatatype === "float" || cDatatype === "double") conversion = "atof";
  else if (cDatatype === "char*") conversion = "strdup";

  const assignment = conversion
    ? `${conversion}(argv[${index + 1}])`
    : `argv[${index + 1}][0]`; // for char
  return `${cDatatype} ${variable} = ${assignment}; // ${datatype}`;
}

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

      const varName = validateInput(datatype, variable);

      if (variables.includes(varName)) {
        throw new Error("Variable Already Exists");
      }

      variables.push(varName);
      variableAndType.push({ name: varName, type: datatype });
      return generateVariableCode(variable, datatype, index);
    })
    .filter(Boolean);

  const head = [
    "#include <stdio.h>",
    "#include <stdlib.h>",
    "#include <string.h>",
    "",
  ];

  const returnType = getCDatatype(
    variableAndType.find((vt) => vt.name === returnStatement.split(" ")[1])
      ?.type || "int"
  );

  const body = `
${returnType} execute(${variableAndType
    .map((v) => `${getCDatatype(v.type)} ${v.name}`)
    .join(", ")}) {
    // Your code here
    ${returnStatement}
}`;

  const tail = `
  int main(int argc, char* argv[]) {
  ${variableCode.map((code) => `    ${code}`).join("\n")}
  
      ${
        returnType === "void" ? "" : `${returnType} result = `
      }execute(${variables.join(", ")});
      // Print or use the result as needed
      ${returnType !== "void" ? `printf("Result: %d\\n", result);` : ""}
  
      return 0;
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
