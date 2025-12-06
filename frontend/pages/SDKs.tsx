import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import SectionContainer from '@/components/ui/SectionContainer'
import { Download, Code2, BookOpen, Github, ExternalLink, Copy, Check } from 'lucide-react'

const sdks = [
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: 'bg-blue-500',
    package: 'velorachain',
    installCmd: 'pip install velorachain',
    repository: 'https://github.com/velorachain/velorachain-sdk-python',
    packageManager: 'PyPI',
    packageUrl: 'https://pypi.org/project/velorachain/',
    quickStart: `from velorachain import ApiClient, Configuration, DocsApi

configuration = Configuration(
    host="https://api.velorachain.com"
)

api_client = ApiClient(configuration)
docs_api = DocsApi(api_client)

doc = docs_api.get_doc("getting-started")
print(f"Title: {doc.title}")`,
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🔷',
    color: 'bg-cyan-500',
    package: 'github.com/velorachain/velorachain-sdk-go',
    installCmd: 'go get github.com/velorachain/velorachain-sdk-go',
    repository: 'https://github.com/velorachain/velorachain-sdk-go',
    packageManager: 'Go Modules',
    packageUrl: 'https://pkg.go.dev/github.com/velorachain/velorachain-sdk-go',
    quickStart: `package main

import (
    "context"
    "fmt"
    velorachain "github.com/velorachain/velorachain-sdk-go"
)

func main() {
    cfg := velorachain.NewConfiguration()
    cfg.Host = "api.velorachain.com"
    
    client := velorachain.NewAPIClient(cfg)
    ctx := context.Background()
    
    doc, _, _ := client.DocsApi.GetDoc(ctx, "getting-started").Execute()
    fmt.Printf("Title: %s\\n", doc.Title)
}`,
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    color: 'bg-purple-500',
    package: 'velorachain/sdk',
    installCmd: 'composer require velorachain/sdk',
    repository: 'https://github.com/velorachain/sdk',
    packageManager: 'Packagist',
    packageUrl: 'https://packagist.org/packages/velorachain/sdk',
    quickStart: `<?php
require_once(__DIR__ . '/vendor/autoload.php');

use VeloraChain\\SDK\\Configuration;
use VeloraChain\\SDK\\ApiClient;
use VeloraChain\\SDK\\Api\\DocsApi;

$config = Configuration::getDefaultConfiguration()
    ->setHost('https://api.velorachain.com');

$apiClient = new ApiClient($config);
$docsApi = new DocsApi($apiClient);

$doc = $docsApi->getDoc('getting-started');
echo "Title: " . $doc->getTitle();`,
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    color: 'bg-red-500',
    package: 'velorachain-sdk',
    installCmd: 'gem install velorachain-sdk',
    repository: 'https://github.com/velorachain/velorachain-sdk-ruby',
    packageManager: 'RubyGems',
    packageUrl: 'https://rubygems.org/gems/velorachain-sdk',
    quickStart: `require 'velorachain'

VeloraChain.configure do |config|
  config.host = 'api.velorachain.com'
end

docs_api = VeloraChain::DocsApi.new
doc = docs_api.get_doc('getting-started')
puts "Title: #{doc.title}"`,
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    color: 'bg-orange-500',
    package: 'com.velorachain:velorachain-sdk',
    installCmd: 'implementation \'com.velorachain:velorachain-sdk:1.0.0\'',
    repository: 'https://github.com/velorachain/velorachain-sdk-java',
    packageManager: 'Maven Central',
    packageUrl: 'https://search.maven.org/artifact/com.velorachain/velorachain-sdk',
    quickStart: `import com.velorachain.sdk.ApiClient;
import com.velorachain.sdk.Configuration;
import com.velorachain.sdk.api.DocsApi;

ApiClient client = Configuration.getDefaultApiClient();
client.setBasePath("https://api.velorachain.com");

DocsApi docsApi = new DocsApi(client);
Doc doc = docsApi.getDoc("getting-started");
System.out.println("Title: " + doc.getTitle());`,
  },
]

const features = [
  { icon: Code2, title: 'Type-Safe', description: 'Full type definitions for all API endpoints' },
  { icon: BookOpen, title: 'Well Documented', description: 'Comprehensive guides and API reference' },
  { icon: Download, title: 'Easy Installation', description: 'Available on all major package managers' },
  { icon: Github, title: 'Open Source', description: 'MIT licensed and community-driven' },
]

export default function SDKs() {
  const [selectedSDK, setSelectedSDK] = useState('python')
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const currentSDK = sdks.find(sdk => sdk.id === selectedSDK)!

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedStates(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SectionContainer className="py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">Developer Tools</Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Official SDKs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate VeloraChain into your application using our official SDKs. Available in multiple languages with full type safety and comprehensive documentation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="w-10 h-10 mb-3 text-primary" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <div className="grid lg:grid-cols-5 gap-4 mb-8">
            {sdks.map((sdk) => (
              <button
                key={sdk.id}
                onClick={() => setSelectedSDK(sdk.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSDK === sdk.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-4xl mb-2">{sdk.icon}</div>
                <div className="font-semibold">{sdk.name}</div>
              </button>
            ))}
          </div>

          <Tabs defaultValue="install" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="install">Installation</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="install" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Install via {currentSDK.packageManager}</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{currentSDK.installCmd}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(currentSDK.installCmd, 'install')}
                  >
                    {copiedStates['install'] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Package Name</h4>
                  <code className="text-sm text-muted-foreground">{currentSDK.package}</code>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Latest Version</h4>
                  <Badge variant="secondary">1.0.0</Badge>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <a href={currentSDK.packageUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on {currentSDK.packageManager}
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={currentSDK.repository} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Repository
                  </a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="quickstart" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Start Example</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{currentSDK.quickStart}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(currentSDK.quickStart, 'quickstart')}
                  >
                    {copiedStates['quickstart'] ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  All SDKs are automatically generated from our OpenAPI specification, ensuring consistent behavior across languages.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Code Examples</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive examples for common use cases including error handling, async operations, and advanced configurations.
                </p>
                <Button asChild>
                  <a
                    href={`/sdk-examples/${currentSDK.id}-examples.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Full Examples
                  </a>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Get Documentation</h4>
                  <p className="text-sm text-muted-foreground">Retrieve documentation by slug</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Submit Contact</h4>
                  <p className="text-sm text-muted-foreground">Submit contact form data</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Error Handling</h4>
                  <p className="text-sm text-muted-foreground">Proper exception handling patterns</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Configuration</h4>
                  <p className="text-sm text-muted-foreground">Timeouts, auth, and custom headers</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Resources</h3>
                <div className="space-y-3">
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">API Reference</h4>
                        <p className="text-sm text-muted-foreground">Complete API endpoint documentation</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/docs">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">OpenAPI Specification</h4>
                        <p className="text-sm text-muted-foreground">Download the OpenAPI spec file</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/openapi.json" download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">API Explorer</h4>
                        <p className="text-sm text-muted-foreground">Interactive API testing interface</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="/api-explorer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">GitHub Organization</h4>
                        <p className="text-sm text-muted-foreground">View all SDK repositories</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="https://github.com/velorachain" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📦 Auto-Generated SDKs</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Our SDKs are automatically generated and published whenever the API changes, ensuring they're always up-to-date.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-muted-foreground mb-6">
            Our team is here to help you integrate VeloraChain into your application.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href="/contact">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs">View Documentation</a>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
