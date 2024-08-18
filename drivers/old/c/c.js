const driver = "Gcc 9.3.0";
const language = "c";

const callCompiler = (code) => {
  fetch("https://driver.scriptopia.tech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  }).then(async (res) => {
    const data = await res.json();
  });
};

const runTestCase = (functionSchema, testCase, index) => {
  const { input, output } = testCase;
  const { functionBody, functionName, functionReturn, functionArgs } =
    functionSchema;

  const code = `
#include <stdio.h>
#include <stdlib.h>

${functionBody}

int main() {
  ${functionArgs.forEach((arg) => {
    arg.type === "number" ? "int result = " : "";
    functionReturn === "boolean" ? "int result = " : "";
    functionReturn === "string" ? "char* result = " : "";
  })}


    ${functionReturn === "number" ? "int result = " : ""}
    ${functionReturn === "boolean" ? "int result = " : ""}
    ${functionReturn === "string" ? "char* result = " : ""}
    
    ${functionName}(${input});

    ${functionReturn === "string" ? 'printf("%s", result);' : ""}
    ${functionReturn === "boolean" ? 'printf("%d", result);' : ""}
    ${functionReturn === "number" ? 'printf("%d", result);' : ""}
    
    return 0;
}
`;

  callCompiler(code);
};

const handler = (event) => {
  try {
    const { functionSchema, testCases } = event;

    testCases.forEach((testCase, index) => {
      runTestCase(functionSchema, testCase, index);
    });
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

// Example JSON INPUT
const eventType = "array";

import(`../testEvents/${eventType}.json`, { assert: { type: "json" } }).then(
  (event) => {}
);
