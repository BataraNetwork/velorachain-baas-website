# VeloraChain Java SDK

The official Java SDK for VeloraChain BaaS platform.

## Installation

### Maven

Add this dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>com.velorachain</groupId>
    <artifactId>velorachain-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Gradle

Add this dependency to your `build.gradle`:

```gradle
implementation 'com.velorachain:velorachain-sdk:1.0.0'
```

## Quick Start

```java
import com.velorachain.sdk.ApiClient;
import com.velorachain.sdk.Configuration;

public class QuickStart {
    public static void main(String[] args) {
        ApiClient client = Configuration.getDefaultApiClient();
        client.setBasePath("https://velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev");
    }
}
```

## Examples

### Get Documentation

```java
import com.velorachain.sdk.ApiClient;
import com.velorachain.sdk.ApiException;
import com.velorachain.sdk.Configuration;
import com.velorachain.sdk.api.DocsApi;
import com.velorachain.sdk.model.Doc;

public class GetDocExample {
    public static void main(String[] args) {
        ApiClient client = Configuration.getDefaultApiClient();
        client.setBasePath("https://api.velorachain.com");
        
        DocsApi docsApi = new DocsApi(client);
        
        try {
            Doc doc = docsApi.getDoc("getting-started");
            System.out.println("Title: " + doc.getTitle());
            System.out.println("Content: " + doc.getContent());
        } catch (ApiException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

### List All Documentation

```java
import com.velorachain.sdk.api.DocsApi;
import com.velorachain.sdk.model.Doc;
import java.util.List;

DocsApi docsApi = new DocsApi(client);

try {
    List<Doc> docs = docsApi.listDocs();
    for (Doc doc : docs) {
        System.out.println("- " + doc.getTitle() + " (" + doc.getSlug() + ")");
    }
} catch (ApiException e) {
    System.err.println("Error: " + e.getMessage());
}
```

### Submit Contact Form

```java
import com.velorachain.sdk.api.ContactApi;
import com.velorachain.sdk.model.SubmitContactRequest;
import com.velorachain.sdk.model.ContactResponse;

ContactApi contactApi = new ContactApi(client);

SubmitContactRequest request = new SubmitContactRequest()
    .name("John Doe")
    .email("john@example.com")
    .message("I'm interested in your BaaS platform");

try {
    ContactResponse response = contactApi.submitContact(request);
    System.out.println("Contact submitted: " + response.getId());
} catch (ApiException e) {
    System.err.println("Error: " + e.getMessage());
}
```

### Subscribe to Newsletter

```java
import com.velorachain.sdk.api.ContactApi;
import com.velorachain.sdk.model.SubscribeRequest;

ContactApi contactApi = new ContactApi(client);

SubscribeRequest request = new SubscribeRequest()
    .email("user@example.com");

try {
    contactApi.subscribe(request);
    System.out.println("Subscribed successfully!");
} catch (ApiException e) {
    System.err.println("Error: " + e.getMessage());
}
```

## Error Handling

```java
import com.velorachain.sdk.ApiException;

try {
    Doc doc = docsApi.getDoc("non-existent");
} catch (ApiException e) {
    System.err.println("HTTP Status Code: " + e.getCode());
    System.err.println("Message: " + e.getMessage());
    System.err.println("Response Body: " + e.getResponseBody());
    System.err.println("Response Headers: " + e.getResponseHeaders());
}
```

## Configuration

### Custom Timeout

```java
import okhttp3.OkHttpClient;
import java.util.concurrent.TimeUnit;

OkHttpClient httpClient = new OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .build();

ApiClient client = Configuration.getDefaultApiClient();
client.setHttpClient(httpClient);
```

### Using API Keys (if applicable)

```java
ApiClient client = Configuration.getDefaultApiClient();
client.setBasePath("https://api.velorachain.com");
client.setApiKey("YOUR_API_KEY");
client.setApiKeyPrefix("Bearer");
```

### Debug Mode

```java
import java.util.logging.Level;
import java.util.logging.Logger;

ApiClient client = Configuration.getDefaultApiClient();
client.setDebugging(true);
```

## Advanced Usage

### Custom Headers

```java
import java.util.HashMap;
import java.util.Map;

ApiClient client = Configuration.getDefaultApiClient();

Map<String, String> headers = new HashMap<>();
headers.put("X-Custom-Header", "CustomValue");

DocsApi docsApi = new DocsApi(client);
```

### Async Requests

```java
import com.velorachain.sdk.ApiCallback;
import com.velorachain.sdk.ApiException;
import java.util.List;
import java.util.Map;

docsApi.listDocsAsync(new ApiCallback<List<Doc>>() {
    @Override
    public void onFailure(ApiException e, int statusCode, Map<String, List<String>> responseHeaders) {
        System.err.println("Error: " + e.getMessage());
    }

    @Override
    public void onSuccess(List<Doc> result, int statusCode, Map<String, List<String>> responseHeaders) {
        for (Doc doc : result) {
            System.out.println("- " + doc.getTitle());
        }
    }

    @Override
    public void onUploadProgress(long bytesWritten, long contentLength, boolean done) {
    }

    @Override
    public void onDownloadProgress(long bytesRead, long contentLength, boolean done) {
    }
});
```

### Custom Base Path

```java
ApiClient client = Configuration.getDefaultApiClient();
client.setBasePath("https://custom.api.velorachain.com");
```

## Support

- Documentation: https://docs.velorachain.com
- GitHub Issues: https://github.com/velorachain/velorachain-sdk-java/issues
- Email: sdk@velorachain.com
