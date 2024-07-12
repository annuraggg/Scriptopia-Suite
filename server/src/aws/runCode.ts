import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { IFunctionArg, ITestCase } from "../../@types/Problem";
const REGION = "ap-south-1";

const runCode = async (
  language: string,
  functionSchema: {
    functionName: string;
    functionArgs: IFunctionArg[];
    functionBody: string;
    functionReturn: string;
  },
  testCases: ITestCase[]
) => {
  const lambdaClient = new LambdaClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY!,
    },
  });

  const data = { functionSchema, testCases };
  const params = {
    FunctionName: `${language}-compiler`,
    Payload: JSON.stringify(data),
  };

  try {
    const data = await lambdaClient.send(new InvokeCommand(params));
    if (data.FunctionError) {
      return;
    }
    if (data.Payload) {
      const d = JSON.parse(new TextDecoder().decode(data.Payload));
      return d;
    }

    return { status: "ERROR" };
  } catch (err) {
    return { status: "ERROR" };
  }
};

export { runCode };
