import time
import os
import resource

def lambda_handler(event, context):
    try:
        functionName = event['functionName']
        functionArgs = event['functionArgs']
        functionBody = event['functionBody']
        testCases = event['testCases']
        
        fnScript = createFunctionScript(
            functionName,
            functionArgs,
            functionBody
        )
        
        results, avgTime, avgMemory = runTestCases(
            functionName,
            fnScript,
            testCases
        )
        
        failedCase = next((result for result in results if not result['passed']), None)
        status = "FAILED" if failedCase else "PASSED"
        failedCaseNo = failedCase['caseNo'] if failedCase else -1
        
        return {
            'STATUS': status,
            'failedCaseNo': failedCaseNo,
            'avgTime': avgTime,
            'avgMemory': avgMemory,
            'results': results
        }
    
    except Exception as e:
        print(f"Error executing function: {e}")
        return {
            'STATUS': 'ERROR',
            'message': str(e)
        }

def createFunctionScript(functionName, functionArgs, functionBody):
    args = ', '.join(arg['name'] for arg in functionArgs)
    
    fn = f'''
def {functionName}({args}):
    {functionBody}
    '''
    
    return fn

def runTestCases(functionName, fnScript, testCases):
    results = []
    totalTime = 0
    totalMemory = 0
    
    for index, testCase in enumerate(testCases):
        time, memory, passed, output = executeFn(functionName, fnScript, testCase)
        
        results.append({
            'caseNo': index + 1,
            'time': time,
            'memory': memory,
            'passed': passed,
            'output': output
        })
        
        totalTime += time
        totalMemory += memory
    
    avgTime = totalTime / len(testCases)
    avgMemory = totalMemory / len(testCases)
    
    return results, avgTime, avgMemory

def executeFn(functionName, fnScript, testCase):
    input_data = testCase['input']
    expected_output = testCase['output']
    
    start = time.time()
    
    # Measure memory usage using resource module
    initial_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024 ** 2
    
    exec(fnScript)
    result = eval(f"{functionName}({', '.join(map(repr, input_data))})")
    
    end = time.time()
    
    final_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024 ** 2
    memory_used = final_memory - initial_memory
    
    time_taken = (end - start) * 1000
    passed = result == expected_output
    
    return time_taken, memory_used, passed, result
