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

// import sclToObject from "./scl/sclToObject";

const starterGenerator = (scl: string[], language: string) => {
  console.log(scl, language);
  // const joinedScl = scl?.join("\n");
  // const sclObj = sclToObject(joinedScl).sclObject!;
  let statement = "";

  return statement;
};

export default starterGenerator;
