import { performance } from "perf_hooks";

const driver = "NodeJS v18.x";
const timestamp = Date.now();

const handler = async (event) => {
  try {
    const { code, sclObject, testCases } = event;

    const { results, avgTime, avgMemory } = runTestCases(
      code,
      sclObject,
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

const runTestCases = (code, sclObject, testCases) => {
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
      error,
    } = executeFn(code, sclObject, testCase);

    results.push({
      caseNo: index + 1,
      time,
      memory,
      passed,
      output,
      isSample,
      input,
      expected,
      error,
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

const executeFn = (code, sclObject, testCase) => {
  const { input, output, isSample, _id } = testCase;
  let consoleLogs = []; // Array to capture console logs

  const start = performance.now();
  const initialMemory = process.memoryUsage().heapUsed;

  // Parse the input correctly
  const actualInput = [
    JSON.parse(input[0]), // Convert stringified array to actual array
    parseInt(input[1]), // Parse target to integer
  ];

  // Override console.log to capture logs
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    consoleLogs.push(args.join(" "));
    originalConsoleLog.apply(console, args);
  };

  // Build the script to evaluate
  const evalScript = `
    ${code}
    execute(${JSON.stringify(actualInput[0])}, ${actualInput[1]});
  `;

  // Evaluate the function
  let error;
  let result;
  try {
    result = eval(evalScript); // Execute the function with parsed input
  } catch (e) {
    error = e;
  }

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
    output: JSON.stringify(result) || null,
    isSample,
    input,
    error: error || null,
    expected: output,
    _id,
    consoleOutput: consoleLogs, // Include captured console logs in the result
  };
};

export { handler };

const event = {
  sclObject: [
    {
      name: "nums",
      type: "array",
      arrayProps: {
        type: "integer",
        size: 5,
      },
    },
    {
      name: "target",
      type: "integer",
    },
    {
      name: "nums",
      type: "return",
    },
  ],
  testCases: [
    {
      input: ["[2,7,11,15]", "9"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f3f",
      },
    },
    {
      input: ["[3,2,4]", "6"],
      output: "[1,2]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f40",
      },
    },
    {
      input: ["[3,3]", "6"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f41",
      },
    },
  ],
  code: `
const execute = (nums, target) => {
  const map = new Map();
  console.log('mewo');
  for (let i = 0; i < nums.length; i++) {
    const complement = targe2t - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];  // Return both indices
    }
    map.set(nums[i], i);
  }
  return null;
};

  `,
};

const resp = await handler(event);
console.log(resp);
