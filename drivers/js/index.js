import convertSclToJs from "./sclToJs.js";

const handler = async (event) => {
  const { scl, testCases, code } = event;
  const { head, body, tail } = convertSclToJs(scl.join("\n")).syntax;

  testCases.forEach((testCase) => {
    const { input, output } = testCase;
    const newTail = [
      tail,
      `\nconsole.log(main([${input.map((item) => item)}]));`,
    ].join("\n");

    const finalCode = [head, code, newTail].join("\n");
  });
};

export default handler;

const event = {
  scl: ["array->integer nums 5", "integer->target", "", "return->nums"],
  testCases: [
    {
      input: ["[2,7,11,15]", "9"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f3f",
      },
    },
    {
      input: ["[3,2,4]", "6"],
      output: "[1.2]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f40",
      },
    },
    {
      input: ["[3,3]", "6"],
      output: "[0,1]",
      difficulty: "easy",
      isSample: true,
      _id: {
        $oid: "66b9a75a46d47620c5c61f41",
      },
    },
  ],
  code: `
const execute = (nums, target) => {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], i);
    }
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement) && map.get(complement) !== i) {
            return [i, map.get(complement)];
        }
    }
    return null;
};
  `,
};

handler(event);
