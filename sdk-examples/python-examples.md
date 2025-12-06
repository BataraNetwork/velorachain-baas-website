# VeloraChain Python SDK

The official Python SDK for VeloraChain BaaS platform.

## Installation

```bash
pip install velorachain
```

## Quick Start

```python
from velorachain import ApiClient, Configuration, DocsApi, ContactApi

configuration = Configuration(
    host="https://velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev"
)

api_client = ApiClient(configuration)
```

## Examples

### Get Documentation

```python
from velorachain import DocsApi

docs_api = DocsApi(api_client)

try:
    doc = docs_api.get_doc(slug="getting-started")
    print(f"Title: {doc.title}")
    print(f"Content: {doc.content}")
except Exception as e:
    print(f"Error: {e}")
```

### List All Documentation

```python
from velorachain import DocsApi

docs_api = DocsApi(api_client)

try:
    docs = docs_api.list_docs()
    for doc in docs:
        print(f"- {doc.title} ({doc.slug})")
except Exception as e:
    print(f"Error: {e}")
```

### Submit Contact Form

```python
from velorachain import ContactApi
from velorachain.models import SubmitContactRequest

contact_api = ContactApi(api_client)

request = SubmitContactRequest(
    name="John Doe",
    email="john@example.com",
    message="I'm interested in your BaaS platform"
)

try:
    response = contact_api.submit_contact(request)
    print(f"Contact submitted: {response.id}")
except Exception as e:
    print(f"Error: {e}")
```

### Subscribe to Newsletter

```python
from velorachain import ContactApi
from velorachain.models import SubscribeRequest

contact_api = ContactApi(api_client)

request = SubscribeRequest(
    email="user@example.com"
)

try:
    response = contact_api.subscribe(request)
    print(f"Subscribed successfully!")
except Exception as e:
    print(f"Error: {e}")
```

## Error Handling

```python
from velorachain.exceptions import ApiException

try:
    doc = docs_api.get_doc(slug="non-existent")
except ApiException as e:
    print(f"Status code: {e.status}")
    print(f"Reason: {e.reason}")
    print(f"Body: {e.body}")
```

## Configuration

### Custom Timeout

```python
configuration = Configuration(
    host="https://api.velorachain.com"
)
configuration.timeout = 30

api_client = ApiClient(configuration)
```

### Using API Keys (if applicable)

```python
configuration = Configuration(
    host="https://api.velorachain.com",
    api_key={'Authorization': 'Bearer YOUR_API_KEY'}
)

api_client = ApiClient(configuration)
```

## Advanced Usage

### Async Support

```python
import asyncio
from velorachain import AsyncApiClient, Configuration, DocsApi

async def get_docs():
    configuration = Configuration(
        host="https://api.velorachain.com"
    )
    
    async with AsyncApiClient(configuration) as api_client:
        docs_api = DocsApi(api_client)
        docs = await docs_api.list_docs()
        return docs

docs = asyncio.run(get_docs())
```

## Support

- Documentation: https://docs.velorachain.com
- GitHub Issues: https://github.com/velorachain/velorachain-sdk-python/issues
- Email: sdk@velorachain.com
