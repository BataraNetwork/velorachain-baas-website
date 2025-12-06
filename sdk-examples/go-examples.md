# VeloraChain Go SDK

The official Go SDK for VeloraChain BaaS platform.

## Installation

```bash
go get github.com/velorachain/velorachain-sdk-go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    
    velorachain "github.com/velorachain/velorachain-sdk-go"
)

func main() {
    cfg := velorachain.NewConfiguration()
    cfg.Host = "velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev"
    
    client := velorachain.NewAPIClient(cfg)
    ctx := context.Background()
}
```

## Examples

### Get Documentation

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    velorachain "github.com/velorachain/velorachain-sdk-go"
)

func main() {
    cfg := velorachain.NewConfiguration()
    cfg.Host = "api.velorachain.com"
    
    client := velorachain.NewAPIClient(cfg)
    ctx := context.Background()
    
    doc, resp, err := client.DocsApi.GetDoc(ctx, "getting-started").Execute()
    if err != nil {
        log.Fatalf("Error: %v", err)
    }
    defer resp.Body.Close()
    
    fmt.Printf("Title: %s\n", doc.Title)
    fmt.Printf("Content: %s\n", doc.Content)
}
```

### List All Documentation

```go
docs, resp, err := client.DocsApi.ListDocs(ctx).Execute()
if err != nil {
    log.Fatalf("Error: %v", err)
}
defer resp.Body.Close()

for _, doc := range docs {
    fmt.Printf("- %s (%s)\n", doc.Title, doc.Slug)
}
```

### Submit Contact Form

```go
import velorachain "github.com/velorachain/velorachain-sdk-go"

req := velorachain.SubmitContactRequest{
    Name:    "John Doe",
    Email:   "john@example.com",
    Message: "I'm interested in your BaaS platform",
}

response, resp, err := client.ContactApi.SubmitContact(ctx).
    SubmitContactRequest(req).
    Execute()
if err != nil {
    log.Fatalf("Error: %v", err)
}
defer resp.Body.Close()

fmt.Printf("Contact submitted: %s\n", response.Id)
```

### Subscribe to Newsletter

```go
req := velorachain.SubscribeRequest{
    Email: "user@example.com",
}

response, resp, err := client.ContactApi.Subscribe(ctx).
    SubscribeRequest(req).
    Execute()
if err != nil {
    log.Fatalf("Error: %v", err)
}
defer resp.Body.Close()

fmt.Println("Subscribed successfully!")
```

## Error Handling

```go
doc, resp, err := client.DocsApi.GetDoc(ctx, "non-existent").Execute()
if err != nil {
    if apiErr, ok := err.(velorachain.GenericOpenAPIError); ok {
        fmt.Printf("API Error: %s\n", apiErr.Error())
        fmt.Printf("Body: %s\n", apiErr.Body())
    } else {
        fmt.Printf("Error: %v\n", err)
    }
    return
}
defer resp.Body.Close()
```

## Configuration

### Custom HTTP Client

```go
import (
    "net/http"
    "time"
)

cfg := velorachain.NewConfiguration()
cfg.Host = "api.velorachain.com"
cfg.HTTPClient = &http.Client{
    Timeout: 30 * time.Second,
}

client := velorachain.NewAPIClient(cfg)
```

### Using API Keys (if applicable)

```go
ctx := context.WithValue(
    context.Background(),
    velorachain.ContextAPIKeys,
    map[string]velorachain.APIKey{
        "Authorization": {
            Key:    "YOUR_API_KEY",
            Prefix: "Bearer",
        },
    },
)

doc, resp, err := client.DocsApi.GetDoc(ctx, "getting-started").Execute()
```

## Advanced Usage

### Context with Timeout

```go
import "time"

ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

docs, resp, err := client.DocsApi.ListDocs(ctx).Execute()
```

### Custom User Agent

```go
cfg := velorachain.NewConfiguration()
cfg.UserAgent = "MyApp/1.0"

client := velorachain.NewAPIClient(cfg)
```

## Support

- Documentation: https://docs.velorachain.com
- GitHub Issues: https://github.com/velorachain/velorachain-sdk-go/issues
- Email: sdk@velorachain.com
