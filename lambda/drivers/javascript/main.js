import { performance } from "perf_hooks";
import { parseSdsl } from "./sdsl.mjs";

const driver = "NodeJS v18.x";
const timestamp = Date.now();

// Configuration constants
const MAX_EXECUTION_TIME = 3000; // 3 seconds max execution time
const MAX_MEMORY_USAGE = 512; // 512MB max memory usage
const MAX_CODE_LENGTH = 1024 * 50; // 50KB max code length
const MAX_CONSOLE_LOGS = 100; // Maximum number of console.log calls
const TIMEOUT_ERROR = "Execution timed out";

// Sandbox dangerous globals
const createSandbox = () => {
  return {
    console: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
    // Add other safe globals here
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined,
    require: undefined,
    process: undefined,
    global: undefined,
    module: undefined,
    __filename: undefined,
    __dirname: undefined,
  };
};

export const handler = async (event) => {
  try {
    // Input validation
    if (!event?.code || !event?.sdsl || !event?.testCases) {
      throw new Error("Missing required parameters: code, sdsl, or testCases");
    }

    // Code size validation
    if (event.code.length > MAX_CODE_LENGTH) {
      throw new Error(
        `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`
      );
    }

    // Validate SDSL structure
    const sdslValidation = parseSdsl(event.sdsl);
    if (!sdslValidation.success) {
      throw new Error(`Invalid SDSL: ${sdslValidation.error}`);
    }

    const { results, avgTime, avgMemory } = await runTestCases(
      event.code,
      event.sdsl,
      event.testCases
    );

    const failedCase = results.find((result) => !result.passed);
    const status = failedCase ? "FAILED" : "PASSED";
    const failedCaseNo = failedCase ? failedCase.caseNo : -1;

    return {
      STATUS: status,
      failedCaseNo: failedCaseNo,
      avgTime: Math.max(0, avgTime) + 20,
      avgMemory: Math.max(0, avgMemory) + 10,
      results: results,
      driver: driver,
      timestamp: timestamp,
    };
  } catch (error) {
    return {
      STATUS: "ERROR",
      message: error.message,
      driver: driver,
      timestamp: timestamp,
    };
  }
};

const runTestCases = async (code, sdsl, testCases) => {
  const results = [];
  let totalTime = 0;
  let totalMemory = 0;

  // Validate test cases structure
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("Invalid or empty test cases");
  }

  const sdslResult = parseSdsl(sdsl);
  if (!sdslResult.success) {
    throw new Error(`Failed to parse SDSL: ${sdslResult.error}`);
  }

  for (const [index, testCase] of testCases.entries()) {
    // Validate test case structure
    if (
      !testCase?.input ||
      !Array.isArray(testCase.input) ||
      !testCase.hasOwnProperty("output")
    ) {
      throw new Error(`Invalid test case structure at index ${index}`);
    }

    const result = await executeFn(code, sdslResult.data, testCase);

    results.push({
      caseNo: index + 1,
      ...result,
    });
    totalTime += result.time;
    totalMemory += result.memory;
  }

  const avgTime = totalTime / testCases.length;
  const avgMemory = totalMemory / testCases.length;

  return { results, avgTime, avgMemory };
};

const executeFn = async (code, sdslData, testCase) => {
  const { input, output, isSample, _id } = testCase;
  let consoleLogs = [];
  let logCount = 0;

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  // Parse inputs based on SDSL types
  const parsedInputs = parseInputs(input, sdslData.inputs);

  // Create a safe console.log wrapper
  const safeConsoleLog = (...args) => {
    if (logCount >= MAX_CONSOLE_LOGS) {
      throw new Error(
        `Exceeded maximum number of console.log calls (${MAX_CONSOLE_LOGS})`
      );
    }
    logCount++;
    consoleLogs.push(args.join(" "));
  };

  // Prepare sandbox context
  const sandbox = createSandbox();
  sandbox.console.log = safeConsoleLog;

  // Build the execution script
  const sandboxKeys = Object.keys(sandbox);
  const sandboxParams = sandboxKeys.join(", ");
  const sandboxValues = sandboxKeys.map((key) => sandbox[key]);

  // Create a function that will run in the context with the sandbox values
  let error = null;
  let result;

  try {
    const executionFunction = new Function(
      ...sandboxKeys,
      `
      
      ${code}
      return execute(${parsedInputs
        .map((input) => JSON.stringify(input))
        .join(", ")});
    `
    );

    // Execute with timeout
    result = await Promise.race([
      Promise.resolve(executionFunction(...sandboxValues)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(TIMEOUT_ERROR)), MAX_EXECUTION_TIME)
      ),
    ]);

    // Check memory usage after execution
    const currentMemory = process.memoryUsage().heapUsed / (1024 * 1024);
    const memoryUsed = currentMemory - initialMemory / (1024 * 1024);
    if (memoryUsed > MAX_MEMORY_USAGE) {
      throw new Error("Memory limit exceeded");
    }
  } catch (e) {
    error = e;
    if (e.message === TIMEOUT_ERROR) {
      error = new Error("Code execution timed out");
    }
  }

  const end = performance.now();
  const finalMemory = process.memoryUsage().heapUsed;

  // Calculate memory usage
  const memoryUsed = (finalMemory - initialMemory) / (1024 * 1024);

  const time = end - start;
  const memory = memoryUsed;

  let passed = false;
  try {
    passed = JSON.stringify(result) === JSON.stringify(JSON.parse(output));
  } catch (e) {
    error = error || new Error("Failed to compare output");
  }

  return {
    time,
    memory,
    passed,
    output: result ? JSON.stringify(result) : null,
    isSample,
    input,
    error: error?.message || null,
    expected: output,
    _id,
    consoleOutput: consoleLogs,
  };
};

const parseInputs = (inputs, sdslInputs) => {
  try {
    return inputs.map((input, index) => {
      const sdslInput = sdslInputs[index];
      if (!sdslInput) {
        throw new Error(
          `Missing SDSL input definition for input index ${index}`
        );
      }

      switch (sdslInput.type) {
        case "array":
          try {
            const parsed = JSON.parse(input);
            if (!Array.isArray(parsed)) {
              throw new Error(`Input at index ${index} is not a valid array`);
            }
            return parsed;
          } catch (e) {
            throw new Error(
              `Failed to parse array at index ${index}: ${e.message}`
            );
          }
        case "integer":
          const intVal = parseInt(input);
          if (isNaN(intVal)) {
            throw new Error(`Invalid integer at index ${index}`);
          }
          return intVal;
        case "float":
        case "double":
          const floatVal = parseFloat(input);
          if (isNaN(floatVal)) {
            throw new Error(`Invalid float/double at index ${index}`);
          }
          return floatVal;
        case "boolean":
          if (input !== "true" && input !== "false") {
            throw new Error(`Invalid boolean at index ${index}`);
          }
          return input === "true";
        case "string":
        case "char":
          return input;
        case "long":
          try {
            return BigInt(input);
          } catch (e) {
            throw new Error(`Invalid BigInt at index ${index}`);
          }
        case "map":
          try {
            return Object.fromEntries(
              input.split(",").map((pair) => {
                const [key, value] = pair.split(":");
                if (!key || value === undefined) {
                  throw new Error("Invalid key-value pair");
                }
                return [key, parseValueByType(value, sdslInput.elementType)];
              })
            );
          } catch (e) {
            throw new Error(
              `Failed to parse map at index ${index}: ${e.message}`
            );
          }
        case "set":
          try {
            return new Set(
              input
                .split(",")
                .map((value) => parseValueByType(value, sdslInput.elementType))
            );
          } catch (e) {
            throw new Error(
              `Failed to parse set at index ${index}: ${e.message}`
            );
          }
        default:
          throw new Error(
            `Unsupported type ${sdslInput.type} at index ${index}`
          );
      }
    });
  } catch (error) {
    throw new Error(`Input parsing error: ${error.message}`);
  }
};

const parseValueByType = (value, type) => {
  if (value === undefined || value === null) {
    throw new Error("Cannot parse undefined or null value");
  }

  try {
    switch (type) {
      case "integer":
        const intVal = parseInt(value);
        if (isNaN(intVal)) throw new Error("Invalid integer value");
        return intVal;
      case "float":
      case "double":
        const floatVal = parseFloat(value);
        if (isNaN(floatVal)) throw new Error("Invalid float value");
        return floatVal;
      case "boolean":
        if (value !== "true" && value !== "false")
          throw new Error("Invalid boolean value");
        return value === "true";
      case "long":
        return BigInt(value);
      default:
        return value;
    }
  } catch (error) {
    throw new Error(`Value parsing error for type ${type}: ${error.message}`);
  }
};

// Test
const params = {
  testCases: [
    {
      input: ["[2,7,11,15]", "9"],
      output: "[0, 1]",
      difficulty: "easy",
      isSample: true,
      _id: "6725bf1a0a1e95cd0afc01bc",
    },
    {
      input: ["[-3,4,3,90]", "0"],
      output: "[0, 2]",
      difficulty: "medium",
      isSample: true,
      _id: "6725bf1a0a1e95cd0afc01bd",
    },
    {
      input: ["[1,4,4,4,5,6]", "7"],
      output: "[0, 5]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01be",
    },
    {
      input: ["[1]", "2"],
      output: "[]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01bf",
    },
    {
      input: ["[3,3,4,5]", "6"],
      output: "[0, 1]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c0",
    },
    {
      input: ["[123,456,789,579]", "1368"],
      output: "[2, 3]",
      difficulty: "hard",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c1",
    },
    {
      input: ["[0,4,3,0]", "0"],
      output: "[0, 3]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c2",
    },
    {
      input: ["[1,2,3,9]", "8"],
      output: "[]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c3",
    },
    {
      input: ["[5,10]", "15"],
      output: "[0, 1]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c4",
    },
    {
      input: ["[-1,-2,3,7]", "6"],
      output: "[0, 3]",
      difficulty: "medium",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c5",
    },
    {
      input: ["[10,5,2,7]", "12"],
      output: "[0, 2]",
      difficulty: "medium",
      isSample: true,
      _id: "6725bf1a0a1e95cd0afc01c6",
    },
    {
      input: ["[3,6,1,2]", "8"],
      output: "[1, 3]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c7",
    },
    {
      input: ["[15,-7,10,5]", "8"],
      output: "[0, 1]",
      difficulty: "medium",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c8",
    },
    {
      input: ["[-3,1,4,-1]", "0"],
      output: "[1, 3]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01c9",
    },
    {
      input: ["[8,2,4,6]", "10"],
      output: "[0, 1]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01ca",
    },
    {
      input: ["[1,-3,7,5]", "4"],
      output: "[1, 2]",
      difficulty: "medium",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01cb",
    },
    {
      input: ["[2,4,3,1]", "5"],
      output: "[0, 2]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01cc",
    },
    {
      input: ["[9,3,-2,6]", "7"],
      output: "[0, 2]",
      difficulty: "easy",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01cd",
    },
    {
      input: ["[5,2,8,1]", "10"],
      output: "[1, 2]",
      difficulty: "medium",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01ce",
    },
    {
      input: ["[4,7,-3,6]", "3"],
      output: "[2, 3]",
      difficulty: "medium",
      isSample: false,
      _id: "6725bf1a0a1e95cd0afc01cf",
    },
  ],
  sdsl: "array<integer> -> nums \n integer -> target \n\n integer<array> -> return",
  code: "function execute(nums, target) { return 'hi'}",
};

handler(params).then(console.log).catch(console.error);
