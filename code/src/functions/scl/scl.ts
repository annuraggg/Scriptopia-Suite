import {
  LanguageGenerator,
  ParsedSCL,
  SCLInput,
  TypeMap,
} from "@shared-types/Scl";

const typeMap: TypeMap = {
  integer: {
    python: "int",
    javascript: "number",
    java: "int",
    cpp: "int",
    csharp: "int",
    php: "int",
    r: "integer",
    typescript: "number",
    swift: "Int",
    go: "int",
  },
  float: {
    python: "float",
    javascript: "number",
    java: "float",
    cpp: "float",
    csharp: "float",
    php: "float",
    r: "numeric",
    typescript: "number",
    swift: "Float",
    go: "float32",
  },
  double: {
    python: "float",
    javascript: "number",
    java: "double",
    cpp: "double",
    csharp: "double",
    php: "float",
    r: "numeric",
    typescript: "number",
    swift: "Double",
    go: "float64",
  },
  string: {
    python: "str",
    javascript: "string",
    java: "String",
    cpp: "std::string",
    csharp: "string",
    php: "string",
    r: "character",
    typescript: "string",
    swift: "String",
    go: "string",
  },
  boolean: {
    python: "bool",
    javascript: "boolean",
    java: "boolean",
    cpp: "bool",
    csharp: "bool",
    php: "bool",
    r: "logical",
    typescript: "boolean",
    swift: "Bool",
    go: "bool",
  },
  char: {
    python: "str",
    javascript: "string",
    java: "char",
    cpp: "char",
    csharp: "char",
    php: "string",
    r: "character",
    typescript: "string",
    swift: "Character",
    go: "rune",
  },
  long: {
    python: "int",
    javascript: "BigInt",
    java: "long",
    cpp: "long long",
    csharp: "long",
    php: "int",
    r: "integer",
    typescript: "bigint",
    swift: "Int64",
    go: "int64",
  },
  array: {
    python: "List",
    javascript: "Array",
    java: "ArrayList",
    cpp: "std::vector",
    csharp: "List",
    php: "array",
    r: "vector",
    typescript: "Array",
    swift: "Array",
    go: "slice",
  },
  map: {
    python: "Dict",
    javascript: "Object",
    java: "HashMap",
    cpp: "std::unordered_map",
    csharp: "Dictionary",
    php: "array",
    r: "list",
    typescript: "Record",
    swift: "Dictionary",
    go: "map",
  },
  set: {
    python: "Set",
    javascript: "Set",
    java: "HashSet",
    cpp: "std::unordered_set",
    csharp: "HashSet",
    php: "array",
    r: "set",
    typescript: "Set",
    swift: "Set",
    go: "map[Type]bool",
  },
};

function parseSCL(sclCode: string): ParsedSCL {
  const lines = sclCode
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const inputs: SCLInput[] = [];
  let returnType: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [type, rest] = line.split("->");

    if (!type || !rest) {
      throw new Error(`Invalid SCL syntax at line ${i + 1}: ${line}`);
    }

    if (rest === "return") {
      if (returnType !== null) {
        throw new Error(`Multiple return types defined at line ${i + 1}`);
      }
      returnType = type;
    } else if (type === "array" || type === "map" || type === "set") {
      const [elementType, name, size] = rest.split(" ");
      if (!elementType || !name) {
        throw new Error(
          `Invalid ${type} declaration at line ${i + 1}: ${line}`
        );
      }
      inputs.push({
        type,
        elementType,
        name,
        size: size ? parseInt(size) : null,
      });
    } else {
      const name = rest;
      if (!Object.keys(typeMap).includes(type)) {
        throw new Error(`Unknown type "${type}" at line ${i + 1}`);
      }
      inputs.push({ type, name, elementType: "", size: null });
    }
  }

  if (returnType === null) {
    throw new Error("No return type specified in SCL");
  }

  return { inputs, returnType };
}

type SupportedLanguages = "python" | "javascript" | "java"; // Add other languages as needed

function generateCode(parsedSCL: ParsedSCL, language: SupportedLanguages) {
  const generators: Record<SupportedLanguages, LanguageGenerator> = {
    python: generatePython,
    javascript: generateJavaScript,
    java: generateJava,
    // cpp: generateCpp,
    // csharp: generateCSharp,
    // php: generatePhp,
    // r: generateR,
    // typescript: generateTypeScript,
    // swift: generateSwift,
    // go: generateGo,
  };

  const generator = generators[language];
  if (!generator) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return generator(parsedSCL.inputs, parsedSCL.returnType);
}

function generatePython(inputs: SCLInput[], returnType: string) {
  const paramList = inputs.map((input) => input.name).join(", ");
  const typeHints = inputs
    .map((input) => {
      if (input.type === "array") {
        return `${input.name}: List[${typeMap[input.elementType].python}]`;
      } else if (input.type === "map") {
        return `${input.name}: Dict[${typeMap[input.elementType].python}, Any]`;
      } else if (input.type === "set") {
        return `${input.name}: Set[${typeMap[input.elementType].python}]`;
      }
      return `${input.name}: ${typeMap[input.type].python}`;
    })
    .join(", ");

  return `
  from typing import List, Dict, Set, Any
  
  def execute(${typeHints}) -> ${typeMap[returnType].python}:
      # Your code here
      pass
  
  def main(input_data: List[str]) -> ${typeMap[returnType].python}:
      ${inputs
        .map((input, index) => {
          if (input.type === "array") {
            return `${input.name} = list(map(${
              typeMap[input.elementType].python
            }, input_data[${index}].split(',')))`;
          } else if (input.type === "map") {
            return `${input.name} = {k: v for k, v in (item.split(':') for item in input_data[${index}].split(','))}`;
          } else if (input.type === "set") {
            return `${input.name} = set(map(${
              typeMap[input.elementType].python
            }, input_data[${index}].split(',')))`;
          }
          return `${input.name} = ${
            typeMap[input.type].python
          }(input_data[${index}])`;
        })
        .join("\n    ")}
  
      return execute(${paramList})
    `.trim();
}

function generateJavaScript(inputs: SCLInput[], returnType: string) {
  const paramList = inputs.map((input) => input.name).join(", ");
  const typeComments = inputs
    .map((input) => {
      if (input.type === "array") {
        return `// @param {${typeMap[input.elementType].javascript}[]} ${
          input.name
        }`;
      } else if (input.type === "map") {
        return `// @param {Object.<string, *>} ${input.name}`;
      } else if (input.type === "set") {
        return `// @param {Set.<${typeMap[input.elementType].javascript}>} ${
          input.name
        }`;
      }
      return `// @param {${typeMap[input.type].javascript}} ${input.name}`;
    })
    .join("\n");

  return `
  /**
  ${typeComments}
   * @returns {${typeMap[returnType].javascript}}
   */
  function execute(${paramList}) {
    // Your code here
  }
  
  /**
   * @param {string[]} inputData
   * @returns {${typeMap[returnType].javascript}}
   */
  function main(inputData) {
    ${inputs
      .map((input, index) => {
        if (input.type === "array") {
          return `const ${input.name} = inputData[${index}].split(',').map(${
            input.elementType === "integer" ? "parseInt" : "parseFloat"
          });`;
        } else if (input.type === "map") {
          return `const ${input.name} = Object.fromEntries(inputData[${index}].split(',').map(item => item.split(':')));`;
        } else if (input.type === "set") {
          return `const ${
            input.name
          } = new Set(inputData[${index}].split(',').map(${
            typeMap[input.elementType].javascript
          }));`;
        }
        return `const ${input.name} = ${
          input.type === "integer" ||
          input.type === "float" ||
          input.type === "double"
            ? "Number"
            : typeMap[input.type].javascript
        }(inputData[${index}]);`;
      })
      .join("\n  ")}
  
    return execute(${paramList});
  }
    `.trim();
}

function generateJava(inputs: SCLInput[], returnType: string) {
  const paramList = inputs
    .map((input) => {
      if (input.type === "array") {
        return `ArrayList<${typeMap[input.elementType].java}> ${input.name}`;
      } else if (input.type === "map") {
        return `HashMap<String, ${typeMap[input.elementType].java}> ${
          input.name
        }`;
      } else if (input.type === "set") {
        return `HashSet<${typeMap[input.elementType].java}> ${input.name}`;
      }
      return `${typeMap[input.type].java} ${input.name}`;
    })
    .join(", ");

  return `
  import java.util.*;
  
  public class Solution {
      public static ${typeMap[returnType].java} execute(${paramList}) {
          // Your code here
          return ${
            returnType === "boolean" ? "false" : "0"
          }; // Placeholder return
      }
  
      public static void main(String[] args) {
          Scanner scanner = new Scanner(System.in);
          ${inputs
            .map((input) => {
              if (input.type === "array") {
                return `ArrayList<${typeMap[input.elementType].java}> ${
                  input.name
                } = new ArrayList<>(Arrays.asList(scanner.nextLine().split(",")).stream().map(${
                  typeMap[input.elementType].java
                }::parse${
                  input.elementType.charAt(0).toUpperCase() +
                  input.elementType.slice(1)
                }).collect(Collectors.toList()));`;
              } else if (input.type === "map") {
                return `HashMap<String, ${typeMap[input.elementType].java}> ${
                  input.name
                } = new HashMap<>();
          for (String item : scanner.nextLine().split(",")) {
              String[] parts = item.split(":");
              ${input.name}.put(parts[0], ${
                  typeMap[input.elementType].java
                }.parse${
                  input.elementType.charAt(0).toUpperCase() +
                  input.elementType.slice(1)
                }(parts[1]));
          }`;
              } else if (input.type === "set") {
                return `HashSet<${typeMap[input.elementType].java}> ${
                  input.name
                } = new HashSet<>(Arrays.asList(scanner.nextLine().split(",")).stream().map(${
                  typeMap[input.elementType].java
                }::parse${
                  input.elementType.charAt(0).toUpperCase() +
                  input.elementType.slice(1)
                }).collect(Collectors.toSet()));`;
              }
              return `${typeMap[input.type].java} ${input.name} = scanner.next${
                input.type.charAt(0).toUpperCase() + input.type.slice(1)
              }();`;
            })
            .join("\n        ")}
  
          ${typeMap[returnType].java} result = execute(${inputs
    .map((input) => input.name)
    .join(", ")});
          System.out.println(result);
      }
  }
    `.trim();
}

export {
  parseSCL,
  generateCode,
  generatePython,
  generateJavaScript,
  generateJava,
};
