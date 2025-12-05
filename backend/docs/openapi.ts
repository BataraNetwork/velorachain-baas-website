import { api } from "encore.dev/api";

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact?: {
      name: string;
      email: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
}

export const getOpenAPISpec = api(
  { method: "GET", path: "/api/openapi.json", expose: true },
  async (): Promise<OpenAPISpec> => {
    return {
      openapi: "3.0.0",
      info: {
        title: "VeloraChain BaaS API",
        version: "1.0.0",
        description: "Blockchain-as-a-Service API for deploying smart contracts, managing tokens, and Web3 interactions",
        contact: {
          name: "VeloraChain Support",
          email: "support@velorachain.com",
          url: "https://velorachain.com"
        }
      },
      servers: [
        {
          url: "https://velorachain-baas-website-d342rt482vjl989h0j10.api.lp.dev",
          description: "Production API"
        },
        {
          url: "http://localhost:4000",
          description: "Local development"
        }
      ],
      paths: {
        "/contact": {
          post: {
            tags: ["Contact"],
            summary: "Submit contact form",
            description: "Submit a contact form message to the VeloraChain team",
            operationId: "submitContact",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ContactRequest"
                  },
                  examples: {
                    basic: {
                      summary: "Basic contact form",
                      value: {
                        name: "John Doe",
                        email: "john@example.com",
                        message: "I'm interested in your BaaS platform"
                      }
                    },
                    detailed: {
                      summary: "Detailed contact form",
                      value: {
                        name: "Jane Smith",
                        email: "jane@company.com",
                        message: "We need enterprise blockchain solutions",
                        company: "Tech Corp",
                        phone: "+1-555-0123"
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ContactResponse"
                    },
                    examples: {
                      success: {
                        summary: "Success response",
                        value: {
                          success: true,
                          id: "550e8400-e29b-41d4-a716-446655440000",
                          message: "Thank you for your message. We'll get back to you soon!"
                        }
                      },
                      error: {
                        summary: "Validation error",
                        value: {
                          success: false,
                          message: "Please provide a valid email address"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/newsletter/subscribe": {
          post: {
            tags: ["Newsletter"],
            summary: "Subscribe to newsletter",
            description: "Subscribe to the VeloraChain newsletter for updates and announcements",
            operationId: "subscribe",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/SubscribeRequest"
                  },
                  examples: {
                    example: {
                      summary: "Newsletter subscription",
                      value: {
                        email: "user@example.com"
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Successful response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SubscribeResponse"
                    },
                    examples: {
                      success: {
                        summary: "Success response",
                        value: {
                          success: true,
                          message: "Successfully subscribed to our newsletter!"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/api/openapi.json": {
          get: {
            tags: ["Documentation"],
            summary: "Get OpenAPI specification",
            description: "Returns the OpenAPI 3.0 specification for the VeloraChain API",
            operationId: "getOpenAPISpec",
            responses: {
              "200": {
                description: "OpenAPI specification",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/OpenAPISpec"
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          ContactRequest: {
            type: "object",
            required: ["name", "email", "message"],
            properties: {
              name: {
                type: "string",
                description: "Full name of the contact",
                example: "John Doe"
              },
              email: {
                type: "string",
                format: "email",
                description: "Email address",
                example: "john@example.com"
              },
              message: {
                type: "string",
                description: "Contact message",
                example: "I'm interested in your BaaS platform"
              },
              company: {
                type: "string",
                description: "Company name (optional)",
                example: "Tech Corp"
              },
              phone: {
                type: "string",
                description: "Phone number (optional)",
                example: "+1-555-0123"
              }
            }
          },
          ContactResponse: {
            type: "object",
            required: ["success", "message"],
            properties: {
              success: {
                type: "boolean",
                description: "Whether the operation succeeded"
              },
              id: {
                type: "string",
                format: "uuid",
                description: "ID of the created contact entry"
              },
              message: {
                type: "string",
                description: "Response message"
              }
            }
          },
          SubscribeRequest: {
            type: "object",
            required: ["email"],
            properties: {
              email: {
                type: "string",
                format: "email",
                description: "Email address to subscribe",
                example: "user@example.com"
              }
            }
          },
          SubscribeResponse: {
            type: "object",
            required: ["success", "message"],
            properties: {
              success: {
                type: "boolean",
                description: "Whether the subscription succeeded"
              },
              message: {
                type: "string",
                description: "Response message"
              }
            }
          },
          OpenAPISpec: {
            type: "object",
            description: "OpenAPI 3.0 specification object"
          }
        }
      }
    };
  }
);
