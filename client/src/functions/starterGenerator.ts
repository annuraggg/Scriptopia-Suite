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

import sclToObject from "./scl/sclToObject";
import createJsTemplate from "./templates/js";

const starterGenerator = (scl: string[], language: string) => {
  const joinedScl = scl?.join("\n");
  const sclObj = sclToObject(joinedScl).sclObject!;
  let statement = "";

  switch (language) {
    case "javascript":
      statement = createJsTemplate(sclObj) as string;
      break;

    default:
      statement = `// Write your code here`;
      break;
  }

  return statement
};

export default starterGenerator;
