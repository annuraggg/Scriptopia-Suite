import convertSclToC from "./sclToC.js";

const handler = async (event) => {
  const { scl, testCases, code } = event;
  const { head, body, tail } = convertSclToC(scl.join("\n")).syntax;

  testCases.forEach((testCase) => {
    const { input, output } = testCase;
    const newTail = [
      tail,
      `\nprintf("%s\\n", main(${input.map((item) => item).join(", ")}));`,
    ].join("\n");

    const finalCode = [head, code, newTail].join("\n");
    console.log(finalCode);
    console.log("******");
  });
};

export default handler;

const event = {
  scl: ["array->integer nums 5", "integer->target", "", "return->nums"],
  testCases: [
    {
      input: ["(int[]){2,7,11,15}, 4", "9"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f3f",
      },
    },
    {
      input: ["(int[]){3,2,4}, 3", "6"],
      output: "[1.2]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f40",
      },
    },
    {
      input: ["(int[]){3,3}, 2", "6"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f41",
      },
    },
  ],
  code: `
int* execute(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return NULL;
}
  `,
};

handler(event);
