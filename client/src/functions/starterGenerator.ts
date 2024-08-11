/* eslint-disable no-case-declarations */
// const starterGenerator = (
//   functionName: string,
//   functionArgs: {
//     name: string;
//     type: string;
//   }[],
//   functionReturnType: string,
//   language: string
// ) => {
//   let starterCode = "";
//   switch (language) {
//     case "javascript":
//       starterCode = `const ${functionName} = (${functionArgs
//         .map((arg) => arg.name)
//         .join(", ")}) => {
//   // Write your code here
//   return ${functionArgs.map((arg) => arg.name).join(", ")};
// };`;
//       break;
//     case "python":
//       starterCode = `def ${functionName}(${functionArgs
//         .map((arg) => arg.name)
//         .join(", ")}):
//   # Write your code here
//   return ${functionArgs.map((arg) => arg.name).join(", ")}`;
//       break;
//     case "java":
//       starterCode = `public ${functionReturnType} ${functionName}(${functionArgs
//         .map((arg) => `${arg.type} ${arg.name}`)
//         .join(", ")}) {
//   // Write your code here
//   return ${functionArgs.map((arg) => arg.name).join(", ")};
// }`;
//       break;
//     default:
//       starterCode = `// Write your code here`;
//   }
//   return starterCode;
// };

import { convertSclToC, convertSclToJs } from "./scl";

const starterGenerator = (scl: string[], language: string) => {
  const joinedScl = scl?.join("\n");
  let statement = "";

  switch (language) {
    case "javascript":
      statement = convertSclToJs(joinedScl).code as string;
      break;

    case "c":
      statement = convertSclToC(joinedScl).code as string;
      break;

    default:
      statement = `// Write your code here`;
      break;
  }

  const splitStatement = statement.split("\n");
  const executeFn: string[] = [];

  let started = false;
  for (const line of splitStatement) {
    if (line.includes("execute") && started !== true) started = true;
    if (!line.includes("main") && started) executeFn.push(line);
    else break;
  }

  console.log(executeFn);
  return executeFn.join("\n");
};

export default starterGenerator;
