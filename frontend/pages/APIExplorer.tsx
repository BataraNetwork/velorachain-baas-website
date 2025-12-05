import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Play, Copy, Check, Code, Book } from "lucide-react";
import backend from "~backend/client";
import { generateCodeExamples, type CodeExample } from "@/lib/codeGenerator";

interface EndpointDetails {
  method: string;
  path: string;
  tag: string;
  summary: string;
  description: string;
  requestBody?: any;
  responses: any;
  examples?: any;
}

export default function APIExplorer() {
  const [spec, setSpec] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<EndpointDetails[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDetails | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["Contact"]));
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadSpec();
  }, []);

  const loadSpec = async () => {
    try {
      const data = await backend.docs.getOpenAPISpec();
      setSpec(data);
      
      const endpointList: EndpointDetails[] = [];
      Object.entries(data.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, details]: [string, any]) => {
          endpointList.push({
            method: method.toUpperCase(),
            path,
            tag: details.tags?.[0] || "Other",
            summary: details.summary || "",
            description: details.description || "",
            requestBody: details.requestBody,
            responses: details.responses,
            examples: details.requestBody?.content?.["application/json"]?.examples
          });
        });
      });
      
      setEndpoints(endpointList);
      if (endpointList.length > 0) {
        setSelectedEndpoint(endpointList[0]);
        if (endpointList[0].examples) {
          const firstExample = Object.values(endpointList[0].examples)[0] as any;
          setRequestBody(JSON.stringify(firstExample.value, null, 2));
        }
      }
    } catch (error) {
      console.error("Failed to load API spec:", error);
    }
  };

  const toggleSection = (tag: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(tag)) {
      newExpanded.delete(tag);
    } else {
      newExpanded.add(tag);
    }
    setExpandedSections(newExpanded);
  };

  const selectEndpoint = (endpoint: EndpointDetails) => {
    setSelectedEndpoint(endpoint);
    setResponse(null);
    setActiveTab("overview");
    
    if (endpoint.examples) {
      const firstExample = Object.values(endpoint.examples)[0] as any;
      setRequestBody(JSON.stringify(firstExample.value, null, 2));
    } else {
      setRequestBody("");
    }
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    try {
      const body = requestBody ? JSON.parse(requestBody) : undefined;
      const url = `${spec.servers[0].url}${selectedEndpoint.path}`;
      
      const res = await fetch(url, {
        method: selectedEndpoint.method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await res.json();
      setResponse({ status: res.status, data });
      setActiveTab("response");
    } catch (error: any) {
      setResponse({ status: 500, error: error.message });
      setActiveTab("response");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string, language: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500",
      POST: "bg-green-500",
      PUT: "bg-yellow-500",
      DELETE: "bg-red-500",
      PATCH: "bg-purple-500"
    };
    return colors[method] || "bg-gray-500";
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.tag]) acc[endpoint.tag] = [];
    acc[endpoint.tag].push(endpoint);
    return acc;
  }, {} as Record<string, EndpointDetails[]>);

  const codeExamples: CodeExample[] = selectedEndpoint
    ? generateCodeExamples(
        {
          method: selectedEndpoint.method,
          path: selectedEndpoint.path,
          body: requestBody ? JSON.parse(requestBody) : undefined
        },
        spec?.servers[0]?.url || ""
      )
    : [];

  if (!spec) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{spec.info.title}</h1>
              <p className="text-sm text-muted-foreground">Version {spec.info.version}</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">{spec.info.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 sticky top-4">
              <h2 className="font-semibold mb-4 text-foreground">Endpoints</h2>
              <div className="space-y-2">
                {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
                  <div key={tag}>
                    <button
                      onClick={() => toggleSection(tag)}
                      className="flex items-center gap-2 w-full text-left py-2 hover:text-primary transition-colors"
                    >
                      {expandedSections.has(tag) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-medium">{tag}</span>
                      <Badge variant="secondary" className="ml-auto">{tagEndpoints.length}</Badge>
                    </button>
                    {expandedSections.has(tag) && (
                      <div className="ml-6 space-y-1 mt-1">
                        {tagEndpoints.map((endpoint, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectEndpoint(endpoint)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              selectedEndpoint === endpoint
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge className={`${getMethodColor(endpoint.method)} text-white text-xs px-1.5 py-0`}>
                                {endpoint.method}
                              </Badge>
                              <span className="truncate text-xs">{endpoint.path}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-9">
            {selectedEndpoint && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getMethodColor(selectedEndpoint.method)} text-white`}>
                          {selectedEndpoint.method}
                        </Badge>
                        <code className="text-lg font-mono bg-muted px-3 py-1 rounded">
                          {selectedEndpoint.path}
                        </code>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedEndpoint.summary}</h2>
                      <p className="text-muted-foreground mt-2">{selectedEndpoint.description}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="try">Try it</TabsTrigger>
                      <TabsTrigger value="code">Code Examples</TabsTrigger>
                      <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 mt-4">
                      {selectedEndpoint.requestBody && (
                        <div>
                          <h3 className="font-semibold mb-2 text-foreground">Request Body</h3>
                          <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                              <code>{JSON.stringify(
                                selectedEndpoint.requestBody.content["application/json"].schema,
                                null,
                                2
                              )}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {selectedEndpoint.examples && (
                        <div>
                          <h3 className="font-semibold mb-2 text-foreground">Examples</h3>
                          <div className="space-y-2">
                            {Object.entries(selectedEndpoint.examples).map(([key, example]: [string, any]) => (
                              <div key={key} className="bg-muted p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">{example.summary}</p>
                                <pre className="text-xs overflow-x-auto">
                                  <code>{JSON.stringify(example.value, null, 2)}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold mb-2 text-foreground">Responses</h3>
                        <div className="space-y-2">
                          {Object.entries(selectedEndpoint.responses).map(([status, response]: [string, any]) => (
                            <div key={status} className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={status === "200" ? "default" : "secondary"}>
                                  {status}
                                </Badge>
                                <span className="text-sm">{response.description}</span>
                              </div>
                              {response.content?.["application/json"]?.examples && (
                                <pre className="text-xs overflow-x-auto mt-2">
                                  <code>{JSON.stringify(
                                    Object.values(response.content["application/json"].examples)[0],
                                    null,
                                    2
                                  )}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="try" className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Request URL
                        </label>
                        <Input
                          value={`${spec.servers[0].url}${selectedEndpoint.path}`}
                          readOnly
                          className="font-mono text-sm"
                        />
                      </div>

                      {selectedEndpoint.requestBody && (
                        <div>
                          <label className="block text-sm font-medium mb-2 text-foreground">
                            Request Body (JSON)
                          </label>
                          <Textarea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            className="font-mono text-sm min-h-[200px]"
                            placeholder="Enter JSON request body..."
                          />
                        </div>
                      )}

                      <Button
                        onClick={executeRequest}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Sending Request...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="code" className="space-y-4 mt-4">
                      {codeExamples.map((example) => (
                        <div key={example.language}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{example.label}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyCode(example.code, example.language)}
                            >
                              {copiedCode === example.language ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="response" className="mt-4">
                      {response ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={response.status === 200 ? "default" : "destructive"}>
                              Status: {response.status}
                            </Badge>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                              <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Send a request to see the response here</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
