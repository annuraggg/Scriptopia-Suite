import { performance } from "perf_hooks";

const handler = async (event) => {
  try {
    const { functionSchema, testCases } = event;
    const { functionName, functionBody } = functionSchema;

    console.log(functionSchema);

    const { results, avgTime, avgMemory } = runTestCases(
      functionName,
      functionBody,
      testCases
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
    };
  } catch (error) {
    console.error("Error executing function:", error);
    return {
      STATUS: "ERROR",
      message: error.message,
    };
  }
};

const runTestCases = (functionName, fnScript, testCases) => {
  const results = [];
  let totalTime = 0;
  let totalMemory = 0;

  testCases.forEach((testCase, index) => {
    const { time, memory, passed, output } = executeFn(
      functionName,
      fnScript,
      testCase
    );

    results.push({ caseNo: index + 1, time, memory, passed, output });
    totalTime += time;
    totalMemory += memory;
  });

  const avgTime = totalTime / testCases.length;
  const avgMemory = totalMemory / testCases.length;

  return { results, avgTime, avgMemory };
};

const executeFn = (functionName, fnScript, testCase) => {
  const { input, output } = testCase;

  const parsedInput = parseInput(input);

  // Define the function from the script
  eval(fnScript);

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  // Execute the function
  const result = eval(`${functionName}(...parsedInput)`);

  const end = performance.now();
  const finalMemory = process.memoryUsage().heapUsed;

  const time = end - start;
  const memory = finalMemory - initialMemory;
  const passed = JSON.stringify(result) === JSON.stringify(JSON.parse(output));

  return { time, memory, passed, output: result };
};

const parseInput = (input) => {
  // Parsing the input string to actual arguments
  return JSON.parse(`[${input}]`);
};

export { handler }