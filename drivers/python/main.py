import json
import time
import sys
import resource

driver = "Python v3.9"
timestamp = time.time()

def lambda_handler(event, context):
    try:
        code = event['code']
        scl_object = event['sclObject']
        test_cases = event['testCases']

        # Run the test cases and get the results
        results, avg_time, avg_memory = run_test_cases(code, scl_object, test_cases)

        failed_case = next((result for result in results if not result['passed']), None)
        status = "FAILED" if failed_case else "PASSED"
        failed_case_no = failed_case['caseNo'] if failed_case else -1

        return {
            "STATUS": status,
            "failedCaseNo": failed_case_no,
            "avgTime": avg_time,
            "avgMemory": avg_memory,
            "results": results,
            "driver": driver,
            "timestamp": timestamp
        }

    except Exception as e:
        return {
            "STATUS": "ERROR",
            "message": str(e),
            "driver": driver,
            "timestamp": timestamp
        }

def run_test_cases(code, scl_object, test_cases):
    results = []
    total_time = 0
    total_memory = 0

    for idx, test_case in enumerate(test_cases):
        time_taken, memory_used, passed, output, is_sample, input_data, expected, error, console_output = execute_fn(code, scl_object, test_case)

        results.append({
            "caseNo": idx + 1,
            "time": time_taken,
            "memory": memory_used,
            "passed": passed,
            "output": output,
            "isSample": is_sample,
            "input": input_data,
            "expected": expected,
            "error": error,
            "_id": test_case['_id'],
            "consoleOutput": console_output
        })

        total_time += time_taken
        total_memory += memory_used

    avg_time = total_time / len(test_cases)
    avg_memory = total_memory / len(test_cases)

    return results, avg_time, avg_memory

def execute_fn(code, scl_object, test_case):
    input_data = test_case['input']
    expected_output = test_case['output']
    is_sample = test_case['isSample']
    
    start_time = time.time()
    initial_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

    # Prepare the input
    actual_input = prepare_input(input_data, scl_object)

    # Try to execute the function from code
    error = None
    result = None
    console_output = []

    try:
        # Capture stdout (console.log equivalent)
        sys.stdout = open('console_output.txt', 'w')

        # Execute the provided Python code (ensure it's safe!)
        exec(code, globals())
        result = execute(*actual_input)

        sys.stdout = sys.__stdout__  # Restore stdout
        with open('console_output.txt', 'r') as file:
            console_output = file.read()

    except Exception as e:
        error = str(e)

    # End time and memory usage
    end_time = time.time()
    final_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss

    time_taken = end_time - start_time
    memory_used = (final_memory - initial_memory) / (1024)  # Memory usage in MB

    passed = json.dumps(result) == expected_output

    return time_taken, memory_used, passed, json.dumps(result), is_sample, input_data, expected_output, error, console_output

def prepare_input(input_data, scl_object):
    actual_input = []

    for idx, arg in enumerate(input_data):
        # Based on type from sclObject, convert input correctly
        arg_type = scl_object[idx]['type']
        if arg_type == "string" or arg_type == "character":
            new_input = arg
        elif arg_type == "integer":
            new_input = int(arg)
        elif arg_type in ["float", "double", "long"]:
            new_input = float(arg)
        elif arg_type == "boolean":
            new_input = arg.lower() == "true"
        elif arg_type == "array":
            array_type = scl_object[idx].get('arrayProps', {}).get('type', 'string')
            if array_type == "integer":
                new_input = list(map(int, json.loads(arg)))
            else:
                new_input = json.loads(arg)
        actual_input.append(new_input)

    return actual_input
    
event = {
    "code": """
def execute(nums, target):
    map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in map:
            return [map[complement], i]
        map[num] = i
    return None
    """,
    "sclObject": [
        {"name": "nums", "type": "array", "arrayProps": {"type": "integer", "size": 5}},
        {"name": "target", "type": "integer"},
        {"name": "nums", "type": "return"}
    ],
    "testCases": [
        {
            "input": ["[2,7,11,15]", "9"],
            "output": "[0,1]",
            "difficulty": "easy",
            "isSample": True,
            "_id": {"$oid": "66b9a75a46d47620c5c61f3f"}
        },
        {
            "input": ["[3,2,4]", "6"],
            "output": "[1,2]",
            "difficulty": "easy",
            "isSample": True,
            "_id": {"$oid": "66b9a75a46d47620c5c61f40"}
        },
        {
            "input": ["[3,3]", "6"],
            "output": "[0,1]",
            "difficulty": "easy",
            "isSample": True,
            "_id": {"$oid": "66b9a75a46d47620c5c61f41"}
        }
    ]
}

# Local test call
if __name__ == "__main__":
    response = lambda_handler(event, None)
    print(json.dumps(response, indent=2))
