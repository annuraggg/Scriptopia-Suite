import { Context } from "hono";
import { sendSuccess } from "../utils/sendResponse";

const getHome = async (c: Context) => {
  const response = {
    problems: [
      {
        id: "1",
        name: "Two Sums",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        status: "Solved",
      },
      {
        id: "2",
        name: "Add Two Numbers",
        difficulty: "Medium",
        tags: ["Linked List", "Math"],
        status: "Solved",
      },
      {
        id: "3",
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["Hash Table", "Two Pointers", "String"],
        status: "Solved",
      },
      {
        id: "4",
        name: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        status: "Not Solved",
      },
      {
        id: "5",
        name: "Longest Palindromic Substring",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        status: "Solved",
      },
    ],
  };

  return sendSuccess(c, 200, "Success", response);
};

export default {
  getHome,
};
