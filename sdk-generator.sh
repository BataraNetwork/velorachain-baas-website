#!/bin/bash
set -e

echo "Generating SDKs from OpenAPI specification..."

OPENAPI_SPEC="openapi.json"
OUTPUT_DIR="generated-sdks"

mkdir -p "$OUTPUT_DIR"

if [ ! -f "$OPENAPI_SPEC" ]; then
  echo "Error: OpenAPI specification file not found: $OPENAPI_SPEC"
  exit 1
fi

generate_sdk() {
  local lang=$1
  local config=$2
  local output_path="$OUTPUT_DIR/$lang"
  
  echo "Generating $lang SDK..."
  
  docker run --rm \
    -v "${PWD}:/local" \
    openapitools/openapi-generator-cli generate \
    -i "/local/$OPENAPI_SPEC" \
    -g "$lang" \
    -o "/local/$output_path" \
    -c "/local/sdk-config/${config}" \
    --git-repo-id "velorachain-sdk-${lang}" \
    --git-user-id "velorachain"
  
  echo "✓ $lang SDK generated successfully"
}

generate_sdk "python" "python-config.json"
generate_sdk "go" "go-config.json"
generate_sdk "php" "php-config.json"
generate_sdk "ruby" "ruby-config.json"
generate_sdk "java" "java-config.json"

echo "All SDKs generated successfully in $OUTPUT_DIR/"
