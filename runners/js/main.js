const { performance } = require("perf_hooks");

const handler = async (event) => {
  try {
    const {
      functionName,
      functionArgs,
      functionBody,
      functionReturn,
      testCases,
    } = event;

    const fnScript = createFunctionScript(
      functionName,
      functionArgs,
      functionBody,
      functionReturn
    );

    const { results, avgTime, avgMemory } = runTestCases(
      functionName,
      fnScript,
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

const createFunctionScript = (
  functionName,
  functionArgs,
  functionBody,
  functionReturn
) => {
  const args = functionArgs.map((arg) => arg.name);

  const fn = `
    function ${functionName}(${args.join(", ")}) {
        ${functionBody}
    }
    `;

  return fn;
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

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  const result = new Function(`return (${fnScript});`)()(...input);

  const end = performance.now();
  const finalMemory = process.memoryUsage().heapUsed;

  const time = end - start;
  const memory = finalMemory - initialMemory;
  const passed = result === output;

  return { time, memory, passed, output: result };
};

const testEvent = {
  functionName: "sum",
  functionArgs: [
    {
      name: "no1",
      type: "number",
    },
    {
      name: "no2",
      type: "number",
    },
  ],
  functionBody: "return no1 + no2;",
  functionReturn: "number",
  testCases: [
    {
      input: [1, 2],
      output: 3,
    },
  ],
};
handler(testEvent).then(console.log);

module.exports = { handler };
