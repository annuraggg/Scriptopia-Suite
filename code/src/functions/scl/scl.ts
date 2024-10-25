import { LanguageGenerator, TypeMap } from "@shared-types/Scl";

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

type SupportedLanguages = "python" | "javascript" | "java";

export interface ParsedSCL {
  inputs: SCLInput[];
  returnType: string;
}

export interface GeneratorResult {
  success: boolean;
  code: string | null;
  error: string | null;
  language?: string;
  metadata?: {
    inputCount: number;
    hasArrayInputs: boolean;
    returnType: string;
    timestamp: number;
    generatedAt?: number;
  };
}

export interface SCLInput {
  type: string;
  elementType: string;
  name: string;
  size: number | null;
}

export interface ParseResult {
  success: boolean;
  error: string | null;
  data: ParsedSCL | null;
  metadata?: {
    inputCount: number;
    hasArrayInputs: boolean;
    returnType: string;
    timestamp: number;
  };
}

function parseSCL(sclCode: string): ParseResult {
  try {
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
        return {
          success: false,
          error: `Invalid SCL syntax at line ${i + 1}: ${line}`,
          data: null,
        };
      }

      if (rest === "return") {
        if (returnType !== null) {
          return {
            success: false,
            error: `Multiple return types defined at line ${i + 1}`,
            data: null,
          };
        }
        returnType = type;
      } else if (type === "array" || type === "map" || type === "set") {
        const [elementType, name, size] = rest.split(" ");
        if (!elementType || !name) {
          return {
            success: false,
            error: `Invalid ${type} declaration at line ${i + 1}: ${line}`,
            data: null,
          };
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
          return {
            success: false,
            error: `Unknown type "${type}" at line ${i + 1}`,
            data: null,
          };
        }
        inputs.push({ type, name, elementType: "", size: null });
      }
    }

    if (returnType === null) {
      return {
        success: false,
        error: "No return type specified in SCL",
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: { inputs, returnType },
      metadata: {
        inputCount: inputs.length,
        hasArrayInputs: inputs.some((input) => input.type === "array"),
        returnType,
        timestamp: Date.now(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Unexpected error while parsing SCL: ${error.message}`,
      data: null,
    };
  }
}

function generateCode(
  sclCode: string,
  language: SupportedLanguages
): GeneratorResult {
  try {
    // First parse the SCL
    const parseResult = parseSCL(sclCode);
    if (!parseResult.success || !parseResult.data) {
      return {
        success: false,
        code: null,
        error: parseResult.error,
        metadata: parseResult.metadata,
      };
    }

    const generators: Record<SupportedLanguages, LanguageGenerator> = {
      python: generatePython,
      javascript: generateJavaScript,
      java: generateJava,
    };

    const generator = generators[language];
    if (!generator) {
      return {
        success: false,
        code: null,
        error: `Unsupported language: ${language}`,
        language,
      };
    }

    // Generate the code
    const generatedCode = generator(
      parseResult.data.inputs,
      parseResult.data.returnType
    );

    if (!parseResult.metadata) {
      return {
        success: true,
        code: generatedCode,
        error: null,
        language,
      };
    }

    return {
      success: true,
      code: generatedCode,
      error: null,
      language,
      metadata: {
        ...parseResult.metadata,
        generatedAt: Date.now(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      code: null,
      error: `Error generating code: ${error?.message}`,
      language,
    };
  }
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
