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

import { generateSdslCode } from "@shared-functions/sdsl";

// import sdslToObject from "./sdsl/sdslToObject";

const starterGenerator = (sdsl: string[], language: string) => {
  console.log(sdsl, language);
  const code = generateSdslCode(sdsl.join("\n"), language, false);
  console.log(code);
  return code.code;
};

export default starterGenerator;
