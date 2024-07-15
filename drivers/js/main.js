import { performance } from "perf_hooks";

const driver = "NodeJS v18.x";
const timestamp = Date.now();

const handler = async (event) => {
  try {
    const { functionSchema, testCases } = event;
    const { functionName, functionBody, functionArgs } = functionSchema;

    const { results, avgTime, avgMemory } = runTestCases(
      functionName,
      functionBody,
      testCases,
      functionArgs
    );

    const failedCase = results.find((result) => !result.passed);
    const status = failedCase ? "FAILED" : "PASSED";
    const failedCaseNo = failedCase ? failedCase.caseNo : -1;

    return {
      STATUS: status,
      failedCaseNo: failedCaseNo,
      avgTime: avgTime,
      avgMemory: avgMemory,
      results: results,
      driver: driver,
      timestamp: timestamp,
    };
  } catch (error) {
    console.error("Error executing function:", error);
    return {
      STATUS: "ERROR",
      message: error.message,
      driver: driver,
      timestamp: timestamp,
    };
  }
};

const runTestCases = (functionName, fnScript, testCases, functionArgs) => {
  const results = [];
  let totalTime = 0;
  let totalMemory = 0;

  testCases.forEach((testCase, index) => {
    const {
      time,
      memory,
      passed,
      output,
      isSample,
      input,
      expected,
      _id,
      consoleOutput,
    } = executeFn(functionName, functionArgs, fnScript, testCase);

    results.push({
      caseNo: index + 1,
      time,
      memory,
      passed,
      output,
      isSample,
      input,
      expected,
      _id,
      consoleOutput,
    });
    totalTime += time;
    totalMemory += memory;
  });

  const avgTime = totalTime / testCases.length;
  const avgMemory = totalMemory / testCases.length;

  return { results, avgTime, avgMemory };
};

const obj = {
  functionName: "addTwo",
  functionArgs: [
    { name: "a", type: "number" },
    { name: "b", type: "number" },
  ],
  fnScript: `function addTwo(a, b) return a + b; `,
  testCase: { input: "[1,2]", output: "3" },
};

const executeFn = (functionName, functionArgs, fnScript, testCase) => {
  const { input, output, isSample, _id } = testCase;
  let consoleLogs = []; // Array to capture console logs

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  let actualInput = [];
  input.forEach((arg, index) => {
    let newInput = arg;
    if (functionArgs[index].type === "string") {
      newInput = arg;
    } else if (functionArgs[index].type === "number") {
      newInput = parseInt(arg);
    } else if (functionArgs[index].type === "array") {
      newInput = JSON.parse(arg);
    } else if (functionArgs[index].type === "boolean") {
      newInput = arg === "true";
    }

    actualInput.push(newInput);
  });

  // Override console.log to capture logs
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    consoleLogs.push(args.join(" "));
    originalConsoleLog.apply(console, args);
  };

  const evalScript = `
  ${fnScript}
  ${functionName}(${actualInput});
  `;

  /*
  function addTwo(a, b) return a + b;
  addTwo(1, 2);
  */

  // Evaluate script
  const result = eval(evalScript);

  // Restore original console.log
  console.log = originalConsoleLog;

  const end = performance.now();
  const finalMemory = process.memoryUsage().heapUsed;

  const time = end - start;
  const memory = (finalMemory - initialMemory) / (1024 * 1024); // Convert bytes to MB
  const passed = JSON.stringify(result) === JSON.stringify(JSON.parse(output));

  return {
    time,
    memory,
    passed,
    output: result,
    isSample,
    input,
    expected: output,
    _id,
    consoleOutput: consoleLogs, // Include captured console logs in the result
  };
};

export { handler };
