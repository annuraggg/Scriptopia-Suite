import { SclObject } from "@/@types/Scl";

const createJsTemplate = (scl: SclObject[]) => {
  const sclWithoutReturn = scl.filter((scl) => scl.type !== "return");
  const finalStatement = [];
  const inputNames = sclWithoutReturn.map((scl) => scl.name);
  finalStatement.push(`const execute = (${inputNames.join(", ")}) => {`);
  finalStatement.push("  // Your code here");

  finalStatement.push("};\n");
  return finalStatement.join("\n");
};

export default createJsTemplate;
