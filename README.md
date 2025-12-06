# VeloraChain BaaS Platform

VeloraChain is a comprehensive Blockchain-as-a-Service (BaaS) platform that provides enterprise-grade blockchain infrastructure and developer tools.

## Features

- **Multi-Chain Support**: Ethereum, Polygon, BNB Chain, and Solana
- **Smart Contract Deployment**: Deploy ERC20, ERC721, and custom contracts
- **Wallet Management**: Custodial and non-custodial wallet solutions
- **API-First Design**: RESTful APIs with comprehensive documentation
- **Official SDKs**: Python, Go, PHP, Ruby, and Java
- **Developer Tools**: Gas calculator, contract templates, and API explorer

## SDK Documentation

VeloraChain provides official SDKs for multiple programming languages:

### Available SDKs

- **Python**: `pip install velorachain` - [Documentation](sdk-examples/python-examples.md)
- **Go**: `go get github.com/velorachain/velorachain-sdk-go` - [Documentation](sdk-examples/go-examples.md)
- **PHP**: `composer require velorachain/sdk` - [Documentation](sdk-examples/php-examples.md)
- **Ruby**: `gem install velorachain-sdk` - [Documentation](sdk-examples/ruby-examples.md)
- **Java**: Maven/Gradle - [Documentation](sdk-examples/java-examples.md)

All SDKs are automatically generated from our OpenAPI specification and published to their respective package managers.

### SDK Features

- ✅ Type-safe API calls
- ✅ Comprehensive error handling
- ✅ Auto-generated from OpenAPI spec
- ✅ Full documentation and examples
- ✅ Regular updates via CI/CD

## Quick Start

### Using the Python SDK

```python
from velorachain import ApiClient, Configuration, DocsApi

configuration = Configuration(
    host="https://api.velorachain.com"
)

api_client = ApiClient(configuration)
docs_api = DocsApi(api_client)

doc = docs_api.get_doc("getting-started")
print(f"Title: {doc.title}")
```

### Using the Go SDK

```go
package main

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
    fmt.Printf("Title: %s\n", doc.Title)
}
```

## Development

### Project Structure

```
.
├── backend/              # Backend services (Encore.ts)
│   ├── contact/         # Contact form service
│   ├── docs/            # Documentation service
│   └── external_dbs/    # External database connections
├── frontend/            # Frontend application (React + Vite)
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   └── lib/            # Utilities and helpers
├── sdk-config/         # SDK generation configurations
├── sdk-examples/       # SDK documentation and examples
├── sdk-templates/      # Custom templates for SDK generation
└── .github/workflows/  # CI/CD pipelines
```

### SDK Generation

SDKs are automatically generated and published via GitHub Actions when:
- Backend code changes
- OpenAPI specification is updated
- Manual workflow dispatch

To generate SDKs locally:

```bash
./sdk-generator.sh
```

This will generate all SDKs in the `generated-sdks/` directory.

### CI/CD Pipeline

The SDK generation pipeline:
1. Generates OpenAPI specification from backend code
2. Generates SDKs for all languages using OpenAPI Generator
3. Runs tests for each SDK
4. Publishes to package managers (PyPI, npm, Maven Central, etc.)

## API Documentation

- **API Explorer**: https://velorachain.com/api-explorer
- **OpenAPI Spec**: https://velorachain.com/openapi.json
- **Documentation**: https://velorachain.com/docs

## Resources

- [Website](https://velorachain.com)
- [Documentation](https://velorachain.com/docs)
- [API Explorer](https://velorachain.com/api-explorer)
- [SDK Documentation](https://velorachain.com/sdks)
- [GitHub Organization](https://github.com/velorachain)

## Support

- **Email**: sdk@velorachain.com
- **Issues**: [GitHub Issues](https://github.com/velorachain/velorachain-sdk/issues)
- **Documentation**: [docs.velorachain.com](https://velorachain.com/docs)

## License

MIT License - see LICENSE file for details

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

### Reporting Issues

If you find a bug in any of our SDKs, please open an issue in the respective repository:
- Python: https://github.com/velorachain/velorachain-sdk-python/issues
- Go: https://github.com/velorachain/velorachain-sdk-go/issues
- PHP: https://github.com/velorachain/sdk/issues
- Ruby: https://github.com/velorachain/velorachain-sdk-ruby/issues
- Java: https://github.com/velorachain/velorachain-sdk-java/issues
