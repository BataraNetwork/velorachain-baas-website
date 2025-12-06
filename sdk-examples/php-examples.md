# VeloraChain PHP SDK

The official PHP SDK for VeloraChain BaaS platform.

## Installation

```bash
composer require velorachain/sdk
```

## Quick Start

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');

use VeloraChain\SDK\Configuration;
use VeloraChain\SDK\ApiClient;

$config = Configuration::getDefaultConfiguration()
    ->setHost('https://velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev');

$apiClient = new ApiClient($config);
```

## Examples

### Get Documentation

```php
<?php
use VeloraChain\SDK\Api\DocsApi;

$docsApi = new DocsApi($apiClient);

try {
    $doc = $docsApi->getDoc('getting-started');
    echo "Title: " . $doc->getTitle() . "\n";
    echo "Content: " . $doc->getContent() . "\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
```

### List All Documentation

```php
<?php
use VeloraChain\SDK\Api\DocsApi;

$docsApi = new DocsApi($apiClient);

try {
    $docs = $docsApi->listDocs();
    foreach ($docs as $doc) {
        echo "- " . $doc->getTitle() . " (" . $doc->getSlug() . ")\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
```

### Submit Contact Form

```php
<?php
use VeloraChain\SDK\Api\ContactApi;
use VeloraChain\SDK\Model\SubmitContactRequest;

$contactApi = new ContactApi($apiClient);

$request = new SubmitContactRequest([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'message' => "I'm interested in your BaaS platform"
]);

try {
    $response = $contactApi->submitContact($request);
    echo "Contact submitted: " . $response->getId() . "\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
```

### Subscribe to Newsletter

```php
<?php
use VeloraChain\SDK\Api\ContactApi;
use VeloraChain\SDK\Model\SubscribeRequest;

$contactApi = new ContactApi($apiClient);

$request = new SubscribeRequest([
    'email' => 'user@example.com'
]);

try {
    $response = $contactApi->subscribe($request);
    echo "Subscribed successfully!\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}
```

## Error Handling

```php
<?php
use VeloraChain\SDK\ApiException;

try {
    $doc = $docsApi->getDoc('non-existent');
} catch (ApiException $e) {
    echo "HTTP Status Code: " . $e->getCode() . "\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "Response Body: " . $e->getResponseBody() . "\n";
}
```

## Configuration

### Custom Timeout

```php
<?php
$config = Configuration::getDefaultConfiguration()
    ->setHost('https://api.velorachain.com');

$apiClient = new ApiClient($config);
$apiClient->getConfig()->setCurlTimeout(30);
```

### Using API Keys (if applicable)

```php
<?php
$config = Configuration::getDefaultConfiguration()
    ->setHost('https://api.velorachain.com')
    ->setApiKey('Authorization', 'YOUR_API_KEY')
    ->setApiKeyPrefix('Authorization', 'Bearer');

$apiClient = new ApiClient($config);
```

### Debug Mode

```php
<?php
$config = Configuration::getDefaultConfiguration()
    ->setHost('https://api.velorachain.com')
    ->setDebug(true)
    ->setDebugFile('debug.log');

$apiClient = new ApiClient($config);
```

## Advanced Usage

### Custom User Agent

```php
<?php
$config = Configuration::getDefaultConfiguration()
    ->setUserAgent('MyApp/1.0');

$apiClient = new ApiClient($config);
```

### SSL Verification

```php
<?php
$config = Configuration::getDefaultConfiguration()
    ->setSSLVerification(true);

$apiClient = new ApiClient($config);
```

## Support

- Documentation: https://docs.velorachain.com
- GitHub Issues: https://github.com/velorachain/sdk/issues
- Email: sdk@velorachain.com
