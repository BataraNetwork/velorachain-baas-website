export interface CodeExample {
  language: string;
  code: string;
  label: string;
}

export interface EndpointInfo {
  method: string;
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

export function generateCodeExamples(endpoint: EndpointInfo, baseUrl: string): CodeExample[] {
  return [
    generateCurl(endpoint, baseUrl),
    generateJavaScript(endpoint, baseUrl),
    generatePython(endpoint, baseUrl),
    generateGo(endpoint, baseUrl),
    generateTypeScript(endpoint, baseUrl)
  ];
}

function generateCurl(endpoint: EndpointInfo, baseUrl: string): CodeExample {
  const { method, path, body, headers } = endpoint;
  const url = `${baseUrl}${path}`;
  
  let code = `curl -X ${method} "${url}"`;
  
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      code += ` \\\n  -H "${key}: ${value}"`;
    });
  }
  
  if (body) {
    code += ` \\\n  -H "Content-Type: application/json"`;
    code += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }
  
  return { language: "bash", code, label: "cURL" };
}

function generateJavaScript(endpoint: EndpointInfo, baseUrl: string): CodeExample {
  const { method, path, body, headers } = endpoint;
  const url = `${baseUrl}${path}`;
  
  let code = `const response = await fetch("${url}", {\n`;
  code += `  method: "${method}"`;
  
  if (body || headers) {
    code += `,\n  headers: {\n`;
    if (body) {
      code += `    "Content-Type": "application/json"`;
    }
    if (headers) {
      const headerEntries = Object.entries(headers);
      headerEntries.forEach(([key, value], idx) => {
        if (body || idx > 0) code += `,\n`;
        code += `    "${key}": "${value}"`;
      });
    }
    code += `\n  }`;
  }
  
  if (body) {
    code += `,\n  body: JSON.stringify(${JSON.stringify(body, null, 2)})`;
  }
  
  code += `\n});\n\nconst data = await response.json();\nconsole.log(data);`;
  
  return { language: "javascript", code, label: "JavaScript" };
}

function generatePython(endpoint: EndpointInfo, baseUrl: string): CodeExample {
  const { method, path, body, headers } = endpoint;
  const url = `${baseUrl}${path}`;
  
  let code = `import requests\n\n`;
  code += `url = "${url}"\n`;
  
  if (headers) {
    code += `headers = ${JSON.stringify(headers, null, 2).replace(/"/g, "'")}\n`;
  }
  
  if (body) {
    code += `data = ${JSON.stringify(body, null, 2).replace(/"/g, "'")}\n\n`;
    code += `response = requests.${method.toLowerCase()}(url`;
    if (headers) code += `, headers=headers`;
    code += `, json=data)\n`;
  } else {
    code += `\nresponse = requests.${method.toLowerCase()}(url`;
    if (headers) code += `, headers=headers`;
    code += `)\n`;
  }
  
  code += `\nprint(response.json())`;
  
  return { language: "python", code, label: "Python" };
}

function generateGo(endpoint: EndpointInfo, baseUrl: string): CodeExample {
  const { method, path, body } = endpoint;
  const url = `${baseUrl}${path}`;
  
  let code = `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"fmt"\n\t"net/http"\n)\n\n`;
  code += `func main() {\n`;
  code += `\turl := "${url}"\n`;
  
  if (body) {
    code += `\n\tdata := map[string]interface{}${JSON.stringify(body, null, 2).replace(/"([^"]+)":/g, '"$1":')}\n`;
    code += `\tjsonData, _ := json.Marshal(data)\n`;
    code += `\n\treq, _ := http.NewRequest("${method}", url, bytes.NewBuffer(jsonData))\n`;
    code += `\treq.Header.Set("Content-Type", "application/json")\n`;
  } else {
    code += `\n\treq, _ := http.NewRequest("${method}", url, nil)\n`;
  }
  
  code += `\n\tclient := &http.Client{}\n`;
  code += `\tresp, err := client.Do(req)\n`;
  code += `\tif err != nil {\n\t\tpanic(err)\n\t}\n`;
  code += `\tdefer resp.Body.Close()\n\n`;
  code += `\tvar result map[string]interface{}\n`;
  code += `\tjson.NewDecoder(resp.Body).Decode(&result)\n`;
  code += `\tfmt.Println(result)\n`;
  code += `}`;
  
  return { language: "go", code, label: "Go" };
}

function generateTypeScript(endpoint: EndpointInfo, baseUrl: string): CodeExample {
  const { method, path, body, headers } = endpoint;
  const url = `${baseUrl}${path}`;
  
  let code = `interface Response {\n  [key: string]: any;\n}\n\n`;
  code += `const response = await fetch("${url}", {\n`;
  code += `  method: "${method}"`;
  
  if (body || headers) {
    code += `,\n  headers: {\n`;
    if (body) {
      code += `    "Content-Type": "application/json"`;
    }
    if (headers) {
      const headerEntries = Object.entries(headers);
      headerEntries.forEach(([key, value], idx) => {
        if (body || idx > 0) code += `,\n`;
        code += `    "${key}": "${value}"`;
      });
    }
    code += `\n  }`;
  }
  
  if (body) {
    code += `,\n  body: JSON.stringify(${JSON.stringify(body, null, 2)})`;
  }
  
  code += `\n});\n\nconst data: Response = await response.json();\nconsole.log(data);`;
  
  return { language: "typescript", code, label: "TypeScript" };
}
