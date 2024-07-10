const { performance } = require("perf_hooks");
//import { performance } from "perf_hooks";

const handler = async (event) => {
  try {
    const { functionSchema, testCases } = event;
    const { functionName, functionBody, functionArgs } = functionSchema;

    console.log(functionSchema);

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
    };
  } catch (error) {
    console.error("Error executing function:", error);
    return {
      STATUS: "ERROR",
      message: error.message,
    };
  }
};

const runTestCases = (functionName, fnScript, testCases, functionArgs) => {
  const results = [];
  let totalTime = 0;
  let totalMemory = 0;

  testCases.forEach((testCase, index) => {
    const { time, memory, passed, output } = executeFn(
      functionName,
      functionArgs,
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

const executeFn = (functionName, functionArgs, fnScript, testCase) => {
  const { input, output } = testCase;

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  let actualInput = [];
  const arrInput = JSON.parse(input);
  arrInput.forEach((arg, index) => {
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

  const evalScript = `
  ${fnScript}
  ${functionName}(${actualInput});
  `;

  console.log(evalScript);

  const result = eval(evalScript);

  const end = performance.now();
  const finalMemory = process.memoryUsage().heapUsed;

  const time = end - start;
  const memory = finalMemory - initialMemory;
  const passed = JSON.stringify(result) === JSON.stringify(JSON.parse(output));

  return { time, memory, passed, output: result };
};

// export { handler };

module.exports = { handler };

const testEvent = {
  functionSchema: {
    functionName: "sum",
    functionArgs: [
      { name: "a", type: "number" },
      { name: "b", type: "number" },
    ],
    functionBody: `function sum(a, b) {
    return a + b;
    }`,
    functionReturn: "number",
  },
  testCases: [
    {
      input: "[2, 9]",
      output: "11",
      difficulty: "easy",
      isSample: true,
      _id: "668a435ddce9a929d18990f7",
    },
  ],
};

handler(testEvent).then(console.log);
