import sclObjToC from "./sclToC.js";
import convertSclToC from "./sclToC.js";
import sclToObject from "./sclToObj.js";

const dataTypeMap = {
  boolean: "bool",
  character: "char*",
  integer: "int",
  long: "long",
  float: "float",
  double: "double",
  string: "char*",
};

const handler = async (event) => {
  const { scl, testCases, code } = event;
  const { sclObject } = sclToObject(scl.join("\n"));

  testCases.forEach((testCase) => {
    const [DEFAULT_HEAD, FINAL_BODY, FINAL_TAIL, DEFAULT_FUNCTIONS] = sclObjToC(
      scl.join("\n"),
      "scl",
      code
    );
    const splitTail = FINAL_TAIL.split("\n");
    const newTail = [];
    const arraySizesWithNames = [];

    let index = 0;
    for (const line of splitTail) {
      if (!line.includes("readline()")) {
        newTail.push(line);
        continue;
      }
      const input = testCase.input[index];
      if (typeof input === "object") {
        const arraySize = input.length;
        const arrayName = sclObject[index].name;
        const arrayType = sclObject[index].arrayProps.type;
        arraySizesWithNames.push({
          name: arrayName,
          size: arraySize,
          type: arrayType,
          value: input,
        });
      } else {
        const newLine = line.replace("readline()", `"${input}"`);
        newTail.push(newLine);
      }
      index++;

      for (const { name, size, type, value } of arraySizesWithNames) {
        if (name === "return") continue;
        const line = `${dataTypeMap[type]} ${name}[${size}] = {${value.join(
          ", "
        )}};`;
        const sizeLine = `int ${name}Size = ${size};`;

        if (!newTail.includes(line)) {
          newTail.push(sizeLine);
          newTail.push(line);
        }
      }
    }

    console.log(
      [DEFAULT_HEAD, FINAL_BODY, newTail.join("\n"), DEFAULT_FUNCTIONS].join(
        "\n"
      )
    );

    // console.log("-------------------------------");
    // console.log(newTail.join("\n"));
  });
};

export default handler;

// const event = {
//   scl: [
//     "array->integer nums 20",
//     "integer->target",
//     "return->array->integer result 2",
//   ],
//   testCases: [
//     {
//       input: [[2, 7, 11, 15], 4],
//       output: "[0,1]",
//       returnLength: "2",
//       difficulty: "easy",
//       isSample: true,
//       _id: {
//         $oid: "66b9a75a46d47620c5c61f3f",
//       },
//     },
//     // {
//     //   input: [[3, 2, 4], 6],
//     //   output: "[1,2]",
//     //   returnLength: "2",
//     //   difficulty: "easy",
//     //   isSample: true,
//     //   _id: {
//     //     $oid: "66b9a75a46d47620c5c61f40",
//     //   },
//     // },
//     // {
//     //   input: [[3, 3], 2],
//     //   output: "[0,1]",
//     //   returnLength: "2",
//     //   difficulty: "easy",
//     //   isSample: true,
//     //   _id: {
//     //     $oid: "66b9a75a46d47620c5c61f41",
//     //   },
//     // },
//   ],
//   code: `
// int* execute(int* nums, int numsSize, int target, int* returnSize) {
//     int* result = (int*)malloc(2 * sizeof(int));
//     *returnSize = 2;

//     for (int i = 0; i < numsSize; i++) {
//         for (int j = i + 1; j < numsSize; j++) {
//             if (nums[i] + nums[j] == target) {
//                 result[0] = i;
//                 result[1] = j;
//                 return result;
//             }
//         }
//     }

//     result[0] = 0;
//     result[1] = 1;
//     return result;
// }
//   `,
// };

const event = {
  scl: ["integer->a", "integer->b", "return->integer->sum"],
  testCases: [
    {
      input: [2, 3],
      output: "5",
      returnLength: "1",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f3f",
      },
    },
  ],
  code: `
int execute(int a, int b, int* returnSize) {
    *returnSize = 1;
    return a + b;
}
  `,
};

handler(event);
