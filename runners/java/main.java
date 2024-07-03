import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class LambdaFunction implements RequestHandler<LambdaFunction.Event, LambdaFunction.Response> {

    public static class Event {
        public String functionName;
        public String[] functionArgs;
        public String functionBody;
        public TestCase[] testCases;

        public static class TestCase {
            public Object[] input;
            public Object output;
        }
    }

    public static class Response {
        public String STATUS;
        public int failedCaseNo;
        public double avgTime;
        public double avgMemory;
        public Object[] results;
    }

    @Override
    public Response handleRequest(Event event, Context context) {
        try {
            String functionName = event.functionName;
            String[] functionArgs = event.functionArgs;
            String functionBody = event.functionBody;
            TestCase[] testCases = event.testCases;

            String fnScript = createFunctionScript(functionName, functionArgs, functionBody);

            Result result = runTestCases(functionName, fnScript, testCases);

            boolean hasFailedCase = false;
            for (Result.TestCaseResult testCaseResult : result.results) {
                if (!testCaseResult.passed) {
                    hasFailedCase = true;
                    break;
                }
            }

            String status = hasFailedCase ? "FAILED" : "PASSED";
            int failedCaseNo = hasFailedCase ? result.results[result.results.length - 1].caseNo : -1;

            return new Response() {
                {
                    this.STATUS = status;
                    this.failedCaseNo = failedCaseNo;
                    this.avgTime = result.avgTime;
                    this.avgMemory = result.avgMemory;
                    this.results = result.results;
                }
            };
        } catch (Exception e) {
            System.err.println("Error executing function: " + e.getMessage());
            return new Response() {
                {
                    this.STATUS = "ERROR";
                    this.failedCaseNo = -1;
                    this.avgTime = 0;
                    this.avgMemory = 0;
                    this.results = new Object[0];
                }
            };
        }
    }

    private String createFunctionScript(String functionName, String[] functionArgs, String functionBody) {
        StringBuilder args = new StringBuilder();
        for (int i = 0; i < functionArgs.length; i++) {
            args.append(functionArgs[i]);
            if (i < functionArgs.length - 1) {
                args.append(", ");
            }
        }

        return "public static Object " + functionName + "(" + String.join(", ", functionArgs) + ") {\n" +
                "    " + functionBody + "\n" +
                "}";
    }

    private Result runTestCases(String functionName, String fnScript, Event.TestCase[] testCases) {
        Result result = new Result();
        long totalTime = 0;
        long totalMemory = 0;

        for (int i = 0; i < testCases.length; i++) {
            long startTime = System.nanoTime();
            long startMemory = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();

            Object output = executeFn(functionName, fnScript, testCases[i].input);

            long endTime = System.nanoTime();
            long endMemory = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();

            long timeTaken = (endTime - startTime) / 1_000_000; // Convert nanoseconds to milliseconds
            long memoryUsed = endMemory - startMemory;

            boolean passed = output.equals(testCases[i].output);
            result.results[i] = new Result.TestCaseResult(i + 1, timeTaken, memoryUsed, passed, output);

            totalTime += timeTaken;
            totalMemory += memoryUsed;
        }

        result.avgTime = (double) totalTime / testCases.length;
        result.avgMemory = (double) totalMemory / testCases.length;

        return result;
    }

    private Object executeFn(String functionName, String fnScript, Object[] input) {
        String script = "class FunctionScript {" +
                "    " + fnScript +
                "}";

        // Dynamic class loading and execution
        try {
            Class<?> scriptClass = Class.forName("FunctionScript");
            Object instance = scriptClass.getDeclaredConstructor().newInstance();
            java.lang.reflect.Method method = scriptClass.getMethod(functionName, getInputTypes(input));
            return method.invoke(instance, input);
        } catch (Exception e) {
            throw new RuntimeException("Error executing function: " + e.getMessage());
        }
    }

    private Class<?>[] getInputTypes(Object[] input) {
        Class<?>[] types = new Class<?>[input.length];
        for (int i = 0; i < input.length; i++) {
            types[i] = input[i].getClass();
        }
        return types;
    }

    private static class Result {
        public Result.TestCaseResult[] results;
        public double avgTime;
        public double avgMemory;

        public static class TestCaseResult {
            public int caseNo;
            public long time;
            public long memory;
            public boolean passed;
            public Object output;

            public TestCaseResult(int caseNo, long time, long memory, boolean passed, Object output) {
                this.caseNo = caseNo;
                this.time = time;
                this.memory = memory;
                this.passed = passed;
                this.output = output;
            }
        }

        public Result() {
            this.results = new Result.TestCaseResult[0];
            this.avgTime = 0;
            this.avgMemory = 0;
        }
    }
}
