import { generateSdslCode } from "../functions/sdsl"; // Adjust the relative path as needed

const input = `
integer->a
float->b
string->name
boolean->isValid
double->salary
array->integer numbers 5
array->string names.
map->keyType valueType name
map->string integer ages
set->elementType name
set->integer uniqueNumbers

integer->return
`;

const expectedOutput = {
  code: `
/**
 * @param {number} a
 * @param {number} b
 * @param {string} name
 * @param {boolean} isValid
 * @param {number} salary
 * @param {unknown[]} integer numbers 5
 * @param {unknown[]} string names.
 * @param {Object.<string, *>} valueType
 * @param {Object.<string, *>} integer
 * @param {Set.<unknown>} name
 * @param {Set.<number>} uniqueNumbers
 * @returns {number}
 */

function execute(a, b, name, isValid, salary, integer numbers 5, string names., valueType, integer, name, uniqueNumbers) {
  // Your code here
  return 0;
}
  /**
 * @param {string[]} inputData
 * @returns {number}
 */

function main(inputData) {
  const a = Number(inputData[0]);
  const b = Number(inputData[1]);
  const name = String(inputData[2]);
  const isValid = Boolean(inputData[3]);
  const salary = Number(inputData[4]);
  const integer numbers 5 = inputData[5].split(',').map(String);
  const string names. = inputData[6].split(',').map(String);
  const valueType = Object.fromEntries(inputData[7].split(',').map(item => item.split(':')));
  const integer = Object.fromEntries(inputData[8].split(',').map(item => item.split(':')));
  const name = new Set(inputData[9].split(','));
  const uniqueNumbers = new Set(inputData[10].split(','));

  return execute(a, b, name, isValid, salary, integer numbers 5, string names., valueType, integer, name, uniqueNumbers);
}`
};

test("generateSdslCode should generate correct JavaScript code", () => {
  expect(generateSdslCode(input, "javascript")).toEqual(expectedOutput);
});
