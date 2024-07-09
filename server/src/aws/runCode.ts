import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const REGION = "ap-south-1";

const runCode = async (
  language: string,
  functionSchema: {
    functionName: string;
    functionArgs: string[];
    functionBody: string;
    functionReturn: string;
  },
  testCases: { name: string; input: string; output: string }[]
) => {
  const lambdaClient = new LambdaClient({ region: REGION });
  const params = {
    FunctionName: `${language}-compiler`,
    // Payload: JSON.stringify({ code, problem }),
  };

  try {
    const data = await lambdaClient.send(new InvokeCommand(params));
    if (data.FunctionError) {
      throw new Error(data.FunctionError);
    }
    if (data.Payload) {
      console.log("Success: ", JSON.parse(data.Payload.toString()));
      return JSON.parse(data.Payload.toString());
    }

    return { status: "ERROR" };
  } catch (err) {
    console.error("Error: ", err);
    return { status: "ERROR" };
  }
};

export { runCode };
