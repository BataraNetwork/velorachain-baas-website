# VeloraChain Ruby SDK

The official Ruby SDK for VeloraChain BaaS platform.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'velorachain-sdk'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install velorachain-sdk
```

## Quick Start

```ruby
require 'velorachain'

VeloraChain.configure do |config|
  config.host = 'velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev'
end

api_client = VeloraChain::ApiClient.new
```

## Examples

### Get Documentation

```ruby
require 'velorachain'

docs_api = VeloraChain::DocsApi.new

begin
  doc = docs_api.get_doc('getting-started')
  puts "Title: #{doc.title}"
  puts "Content: #{doc.content}"
rescue VeloraChain::ApiError => e
  puts "Error: #{e.message}"
end
```

### List All Documentation

```ruby
docs_api = VeloraChain::DocsApi.new

begin
  docs = docs_api.list_docs
  docs.each do |doc|
    puts "- #{doc.title} (#{doc.slug})"
  end
rescue VeloraChain::ApiError => e
  puts "Error: #{e.message}"
end
```

### Submit Contact Form

```ruby
contact_api = VeloraChain::ContactApi.new

request = VeloraChain::SubmitContactRequest.new(
  name: 'John Doe',
  email: 'john@example.com',
  message: "I'm interested in your BaaS platform"
)

begin
  response = contact_api.submit_contact(request)
  puts "Contact submitted: #{response.id}"
rescue VeloraChain::ApiError => e
  puts "Error: #{e.message}"
end
```

### Subscribe to Newsletter

```ruby
contact_api = VeloraChain::ContactApi.new

request = VeloraChain::SubscribeRequest.new(
  email: 'user@example.com'
)

begin
  response = contact_api.subscribe(request)
  puts "Subscribed successfully!"
rescue VeloraChain::ApiError => e
  puts "Error: #{e.message}"
end
```

## Error Handling

```ruby
begin
  doc = docs_api.get_doc('non-existent')
rescue VeloraChain::ApiError => e
  puts "HTTP Status Code: #{e.code}"
  puts "Message: #{e.message}"
  puts "Response Headers: #{e.response_headers}"
  puts "Response Body: #{e.response_body}"
end
```

## Configuration

### Custom Timeout

```ruby
VeloraChain.configure do |config|
  config.host = 'api.velorachain.com'
  config.timeout = 30
end
```

### Using API Keys (if applicable)

```ruby
VeloraChain.configure do |config|
  config.host = 'api.velorachain.com'
  config.api_key['Authorization'] = 'YOUR_API_KEY'
  config.api_key_prefix['Authorization'] = 'Bearer'
end
```

### Debug Mode

```ruby
VeloraChain.configure do |config|
  config.debugging = true
  config.logger = Logger.new(STDOUT)
  config.logger.level = Logger::DEBUG
end
```

## Advanced Usage

### Custom User Agent

```ruby
VeloraChain.configure do |config|
  config.user_agent = 'MyApp/1.0'
end
```

### SSL Configuration

```ruby
VeloraChain.configure do |config|
  config.verify_ssl = true
  config.ssl_ca_cert = '/path/to/ca_cert.pem'
end
```

### Custom Headers

```ruby
api_client = VeloraChain::ApiClient.new
api_client.default_headers['X-Custom-Header'] = 'CustomValue'

docs_api = VeloraChain::DocsApi.new(api_client)
```

## Support

- Documentation: https://docs.velorachain.com
- GitHub Issues: https://github.com/velorachain/velorachain-sdk-ruby/issues
- Email: sdk@velorachain.com
