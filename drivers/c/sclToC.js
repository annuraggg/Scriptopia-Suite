import sclToObject from "./sclToObj.js";

const dataTypeMap = {
  boolean: "bool",
  character: "char*",
  integer: "int",
  long: "long",
  float: "float",
  double: "double",
  string: "char*",
};



const arrayDataTypeMap = {
  boolean: "bool*",
  character: "char**",
  integer: "int*",
  long: "long*",
  float: "float*",
  double: "double*",
  string: "char**",
};

const variableFunctionMap = {
  boolean: "parse_int(readline()) != 0",
  character: "*readline()",
  integer: "parse_int(readline())",
  long: "parse_long(readline())",
  float: "parse_float(readline())",
  double: "parse_double(readline())",
  string: "readline()",
};

const sclObjToC = (scl, type, body) => {
  let parsedScl;
  if (type === "scl" && !Array.isArray(scl))
    parsedScl = sclToObject(scl).sclObject;
  else parsedScl = scl;

  const FINAL_BODY = parseBody(body);
  const FINAL_TAIL = parseTail(parsedScl, FINAL_BODY);

  const aggregateString = [
    DEFAULT_HEAD,
    FINAL_BODY,
    FINAL_TAIL,
    DEFAULT_FUNCTIONS,
  ];

  return aggregateString;
};

const parseBody = (body) => {
  if (!body) return "";
  return body.trim();
};

const parseTail = (parsedScl) => {
  const finalMain = [];
  const arrayNames = [];
  finalMain.push("int main() {");

  for (const variable of parsedScl) {
    if (variable.type === "array" && variable.name !== "return") {
      if (!variable.arrayProps?.type) return;
      const arrayLoop = parseArrayLoop(variable);
      arrayNames.push(variable.name);

      finalMain.push(arrayLoop);
    } else if (variable.name === "return") {
      continue;
    } else {
      const startDataType = dataTypeMap[variable.type];
      const name = variable.name;
      const endValue = variableFunctionMap[variable.type];

      const finalString = `${startDataType} ${name} = ${endValue};`;
      finalMain.push(finalString);
    }
  }

  const returnScl = parsedScl.find((scl) => scl.name === "return");
  const returnType = returnScl?.type;

  if (returnType === "array") {
  }

  let finalReturnType = dataTypeMap[returnType];

  if (returnType === "array") {
    finalReturnType = arrayDataTypeMap[returnScl.arrayProps.type];
  }

  finalMain.push(`int returnSize;`);

  // create struct call

  finalMain.push(
    `${finalReturnType} result = execute(${parsedScl
      .map((scl) =>
        scl.type === "array" && scl.name !== "return"
          ? `${scl.name}, ${scl.name}Size`
          : scl.type === "return" || scl.name === "return"
          ? ""
          : scl.name
      )
      .join(", ")}&returnSize);`
  );

  // print based on return type
  if (returnType === "array") {
    const returnPrintStr = `for (int i = 0; i < returnSize; i++) {
        printf("%d ", result[i]);
    }`;

    finalMain.push(returnPrintStr);
  } else if (returnType === "string") {
    finalMain.push(`printf("%d\\n", result);`);
  } else {
    finalMain.push(`printf("%d\\n", result);`);
  }

  finalMain.push("return 0;");
  finalMain.push("}");

  return finalMain.join("\n");
};

const parseArrayLoop = (scl) => {
  if (!scl.arrayProps) return;

  // const tempArr = `char** ${scl.name}_temp = split_string(rtrim(readline()));`;

  // const maxSize = scl.arrayProps.size;

  // const arrSize = `int ${scl.name}Size = 0;
  // while (${scl.name}_temp[${scl.name}Size] != NULL && ${scl.name}Size < ${maxSize}) {
  //   ${scl.name}Size++;
  // }`;

  // const memoryAlloc = `${dataTypeMap[scl.arrayProps?.type]}* ${scl.name} =
  // malloc(${scl.name}Size * sizeof(${dataTypeMap[scl.arrayProps?.type]}));`;

  // let loopItemValue = "";

  // switch (scl.arrayProps.type) {
  //   case "boolean":
  //     loopItemValue = `parse_int(*(${scl.name}_temp + i)) != 0`;
  //     break;
  //   case "character":
  //     loopItemValue = `**(${scl.name}_temp + i)`;
  //     break;
  //   case "integer":
  //     loopItemValue = `parse_int(*(${scl.name}_temp + i))`;
  //     break;
  //   case "long":
  //     loopItemValue = `parse_long(*(${scl.name}_temp + i))`;
  //     break;
  //   case "float":
  //     loopItemValue = `parse_float(*(${scl.name}_temp + i))`;
  //     break;
  //   case "double":
  //     loopItemValue = `parse_double(*(${scl.name}_temp + i))`;
  //     break;
  //   case "string":
  //     loopItemValue = `*(${scl.name}__temp + i)`;
  //     break;
  // }

  // const loopLine = ` for (int i = 0; i < ${scl.arrayProps?.size}; i++) {
  //   ${dataTypeMap[scl.arrayProps?.type]} ${scl.name}_item = ${loopItemValue};
  //     *(${scl.name} + i) = ${scl.name}_item;
  //   }`;

  // const arr =

  // const finalString = [tempArr, memoryAlloc, loopLine].join("\n");
  // return finalString;
  return `readline();`;
};

const DEFAULT_HEAD = `
  #include <assert.h>
  #include <ctype.h>
  #include <limits.h>
  #include <math.h>
  #include <stdbool.h>
  #include <stddef.h>
  #include <stdint.h>
  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>

  char* readline();
  char* ltrim(char*);
  char* rtrim(char*);
  char** split_string(char*);

  double parse_double(char*);
  float parse_float(char*);
  int parse_int(char*);
  long parse_long(char*);


  struct CaseStruct {
      int caseNo;              // Type: Number
      char caseId[256];        // Type: String (assuming a maximum length of 255 characters plus null terminator)
      char output[256];        // Type: String (assuming a maximum length of 255 characters plus null terminator)
      bool isSample;           // Type: Boolean
      int memory;              // Type: Number
      int time;                // Type: Number
      bool passed;             // Type: Boolean
      char console[256];       // Type: String (assuming a maximum length of 255 characters plus null terminator)
  };

  `;
const DEFAULT_FUNCTIONS = `
  char* readline() {
      size_t alloc_length = 1024;
      size_t data_length = 0;

      char* data = malloc(alloc_length);

      while (true) {
          char* cursor = data + data_length;
          char* line = fgets(cursor, alloc_length - data_length, stdin);

          if (!line) {
              break;
          }

          data_length += strlen(cursor);

          if (data_length < alloc_length - 1 || data[data_length - 1] == '\\n') {
              break;
          }

          alloc_length <<= 1;

          data = realloc(data, alloc_length);

          if (!data) {
              data = '\\0';

              break;
          }
      }

      if (data[data_length - 1] == '\\n') {
          data[data_length - 1] = '\\0';

          data = realloc(data, data_length);

          if (!data) {
              data = '\\0';
          }
      } else {
          data = realloc(data, data_length + 1);

          if (!data) {
              data = '\\0';
          } else {
              data[data_length] = '\\0';
          }
      }

      return data;
  }

  char* ltrim(char* str) {
      if (!str) {
          return '\\0';
      }

      if (!*str) {
          return str;
      }

      while (*str != '\\0' && isspace(*str)) {
          str++;
      }

      return str;
  }

  char* rtrim(char* str) {
      if (!str) {
          return '\\0';
      }

      if (!*str) {
          return str;
      }

      char* end = str + strlen(str) - 1;

      while (end >= str && isspace(*end)) {
          end--;
      }

      *(end + 1) = '\\0';

      return str;
  }

  char** split_string(char* str) {
      char** splits = NULL;
      char* token = strtok(str, " ");

      int spaces = 0;

      while (token) {
          splits = realloc(splits, sizeof(char*) * ++spaces);

          if (!splits) {
              return splits;
          }

          splits[spaces - 1] = token;

          token = strtok(NULL, " ");
      }

      return splits;
  }

  double parse_double(char* str) {
      char* endptr;
      double value = strtod(str, &endptr);

      if (endptr == str || *endptr != '\\0') {
          exit(EXIT_FAILURE);
      }

      return value;
  }

  float parse_float(char* str) {
      char* endptr;
      float value = strtof(str, &endptr);

      if (endptr == str || *endptr != '\\0') {
          exit(EXIT_FAILURE);
      }

      return value;
  }

  int parse_int(char* str) {
      char* endptr;
      int value = strtol(str, &endptr, 10);

      if (endptr == str || *endptr != '\\0') {
          exit(EXIT_FAILURE);
      }

      return value;
  }

  long parse_long(char* str) {
      char* endptr;
      long value = strtol(str, &endptr, 10);

      if (endptr == str || *endptr != '\\0') {
          exit(EXIT_FAILURE);
      }

      return value;
  }
  `;

export default sclObjToC;
