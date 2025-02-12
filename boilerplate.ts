type Lang = "js" | "py" | "cpp" | "java";
type ParamType = "int" | "float" | "string" | "array" | "bool";

export function generateBoilerplate(
    functionName: string,
    paramTypes: ParamType[]
): { userBoilerplate: Record<Lang, string>, executionBoilerplate: Record<Lang, string> } {

    // Convert generic parameter types to language-specific syntax
    const jsParams = paramTypes.map((_, i) => `arg${i}`).join(", ");
    const pyParams = paramTypes.map((_, i) => `arg${i}`).join(", ");
    const cppParams = paramTypes.map((type, i) => `${convertType("cpp", type)} arg${i}`).join(", ");
    const javaParams = paramTypes.map((type, i) => `${convertType("java", type)} arg${i}`).join(", ");

    // Generate parameters JSON string
    const parametersJson = JSON.stringify(paramTypes.map((type, i) => ({ name: `arg${i}`, type })));

    // User-defined boilerplate code (for editing)
    const userBoilerplate = {
        js: `function ${functionName}(${jsParams}) {\n    // Write your code here\n}`,

        py: `def ${functionName}(${pyParams}):\n    # Write your code here\n    pass`,

        cpp: `${convertType("cpp", "return")} ${functionName}(${cppParams}) {\n    // Write your code here\n    return 0;\n}`,

        java: `public class Solution {\n    public static ${convertType("java", "return")} ${functionName}(${javaParams}) {\n        // Write your code here\n        return 0;\n    }\n}`
    };

    // Execution boilerplates (handling input/output)
    const executionBoilerplate = {
        js: `const readline = require("readline");

{{usercode}}
function parseValue(value, expectedType) {
  if (expectedType === "int" || expectedType === "integer") return parseInt(value);
  if (expectedType === "float") return parseFloat(value);
  if (expectedType === "bool") return value.toLowerCase() === "true";
  if (expectedType === "string") return value;
  if (expectedType === "array") {
    value = value.trim();
    // If value is in JSON format (e.g., "[1,2,3]"), try parsing it
    if (value.startsWith("[")) {
      try {
        return JSON.parse(value);
      } catch (e) {
        // Fallback: split by comma if JSON parsing fails
        return value.split(",").map(item => item.trim());
      }
    } else {
      return value.split(",").map(item => item.trim());
    }
  }
  return value;
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let inputLines = [];
rl.on("line", (line) => inputLines.push(line));
rl.on("close", function() {
  let t = parseInt(inputLines[0]); // Number of test cases
  let parameters = JSON.parse('${parametersJson}'); // e.g. '[{"name":"arg0","type":"integer"},{"name":"arg1","type":"integer"}]'
  
  for (let i = 1; i <= t; i++) {
    // Assume each test case is provided as space-separated values
    let values = inputLines[i].split(" ");
    let args = parameters.map((param, idx) => parseValue(values[idx], param.type));
    console.log(${functionName}(...args));
  }
});
`,

        py: `import sys

{{usercode}}
def parse_value(value, expected_type):
    if expected_type == "int": return int(value)
    if expected_type == "float": return float(value)
    if expected_type == "bool": return value.lower() == "true"
    if expected_type == "string": return value
    return value

if __name__ == "__main__":
    t = int(sys.stdin.readline().strip())
    parameters = ${parametersJson}

    for _ in range(t):
        values = sys.stdin.readline().strip().split()
        args = [parse_value(values[i], parameters[i]["type"]) for i in range(len(values))]
        print(${functionName}(*args))`,

        cpp: `#include <iostream>
#include <vector>
#include <sstream>
#include <string>

using namespace std;

{{usercode}}

vector<string> splitString(const string &str) {
    vector<string> result;
    stringstream ss(str);
    string word;
    while (ss >> word) result.push_back(word);
    return result;
}

template <typename T>
T parseValue(const string &value) {
    if constexpr (is_same_v<T, int>) return stoi(value);
    if constexpr (is_same_v<T, double>) return stod(value);
    if constexpr (is_same_v<T, bool>) return value == "true";
    if constexpr (is_same_v<T, string>) return value;
    return T{};
}

int main() {
    int t;
    cin >> t;
    cin.ignore();

    while (t--) {
        string line;
        getline(cin, line);
        vector<string> values = splitString(line);

        cout << ${functionName}(${jsParams}) << endl;
    }
    return 0;
}`,

        java: `import java.util.*;

{{usercode}}
public class Main {
    public static Object parseValue(String value, String type) {
        switch (type) {
            case "int": return Integer.parseInt(value);
            case "float": return Double.parseDouble(value);
            case "bool": return Boolean.parseBoolean(value);
            case "string": return value;
            default: return null;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int t = Integer.parseInt(sc.nextLine());
        List<Map<String, String>> parameters = ${parametersJson};

        while (t-- > 0) {
            String[] values = sc.nextLine().split(" ");
            Object[] argsArray = new Object[parameters.size()];

            for (int i = 0; i < parameters.size(); i++) {
                argsArray[i] = parseValue(values[i], parameters.get(i).get("type"));
            }

            System.out.println(Solution.${functionName}(argsArray));
        }
        sc.close();
    }
}`
    };

    return { userBoilerplate, executionBoilerplate };
}

// Convert generic parameter types to language-specific types
function convertType(lang: Lang, type: ParamType | "return"): string {
    const typeMap: Record<Lang, Record<ParamType | "return", string>> = {
        js: { int: "number", float: "number", string: "string", array: "Array<any>", bool: "boolean", return: "" },
        py: { int: "", float: "", string: "", array: "", bool: "", return: "" },
        cpp: { int: "int", float: "double", string: "string", array: "vector<int>", bool: "bool", return: "int" },
        java: { int: "int", float: "double", string: "String", array: "int[]", bool: "boolean", return: "int" }
    };

    return typeMap[lang][type] || "";
}
