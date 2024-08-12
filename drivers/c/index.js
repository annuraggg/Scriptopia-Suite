import sclObjToC from "./sclToC.js";
import convertSclToC from "./sclToC.js";

const handler = async (event) => {
  const { scl, testCases, code } = event;

  testCases.forEach((testCase) => {
    const { input, output } = testCase;
    const executeStatement = sclObjToC(scl.join("\n"), "scl", code);
    console.log(executeStatement);
    console.log("******");
  });
};

export default handler;

const event = {
  scl: ["array->integer nums 20", "integer->target"],
  testCases: [
    {
      input: ["[2,7,11,15], 4"],
      output: "[0,1]",
      returnLength: "2",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f3f",
      },
    },
    {
      input: ["[3,2,4], 3, 6", "&returnSize"],
      output: "[1,2]",
      returnLength: "2",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f40",
      },
    },
    {
      input: ["[3,3], 2, 6", "&returnSize"],
      output: "[0,1]",
      returnLength: "2",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f41",
      },
    },
  ],
  code: `
int* execute(int* nums, int target) {
    int* result = (int*)malloc(2 * sizeof(int));
    int numsSize = sizeof(nums);
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
