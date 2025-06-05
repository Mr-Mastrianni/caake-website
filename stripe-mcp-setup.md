# Stripe Agent Toolkit MCP Server Setup

This document describes the setup and configuration of the Stripe Agent Toolkit MCP (Model Context Protocol) server.

## Installation

The Stripe MCP server has been successfully installed and configured with the following setup:

### Configuration File: `mcp_settings.json`

```json
{
  "mcpServers": {
    "github.com/stripe/agent-toolkit": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_stripe_secret_key_here"
      }
    }
  }
}
```

### Directory Structure

- `mcp-servers/` - Directory created for MCP server organization
- `mcp_settings.json` - MCP server configuration file
- `test-stripe-mcp.js` - Test script for server capabilities

## Available Tools

The Stripe MCP server provides access to the following Stripe API methods:

### Customer Management
- **Create a customer** - Create new Stripe customers
- **List all customers** - Retrieve customer lists with filtering options

### Product & Pricing
- **Create a product** - Add new products to your Stripe catalog
- **List all products** - Retrieve product listings
- **Create a price** - Set pricing for products
- **List all prices** - View all price configurations

### Payment Processing
- **Create a payment link** - Generate payment links for customers
- **Create a refund** - Process refunds for payments

### Invoicing
- **Create an invoice** - Generate invoices for customers
- **Create an invoice item** - Add line items to invoices
- **Finalize an invoice** - Complete and send invoices

### Subscriptions
- **List all subscriptions** - View subscription data
- **Update a subscription** - Modify existing subscriptions
- **Cancel a subscription** - End customer subscriptions

### Financial Operations
- **Retrieve balance** - Check account balance
- **List all disputes** - View payment disputes
- **Update a dispute** - Respond to disputes

### Promotions
- **Create a coupon** - Set up discount codes
- **List all coupons** - View available coupons

## Usage Instructions

### 1. Set Your Stripe API Key

Before using the MCP server, you need to set your actual Stripe secret key in the `mcp_settings.json` file:

```json
"env": {
  "STRIPE_SECRET_KEY": "sk_test_your_actual_stripe_secret_key_here"
}
```

### 2. Running the Server

The server can be started using:

```bash
npx -y @stripe/mcp --tools=all --api-key=YOUR_STRIPE_SECRET_KEY
```

### 3. Testing the Server

Use the provided test script to verify functionality:

```bash
node test-stripe-mcp.js
```

## Security Notes

- Always use test keys (`sk_test_...`) during development
- Never commit real API keys to version control
- Consider using environment variables for production deployments
- The server runs with all tools enabled (`--tools=all`) - restrict as needed for production

## Integration

This MCP server can be integrated with:
- OpenAI's Agent SDK
- LangChain
- CrewAI
- Vercel's AI SDK
- Any MCP-compatible client

## Dependencies

The following packages have been installed:
- `@modelcontextprotocol/sdk` - MCP SDK for client connections
- `@stripe/mcp` - Stripe MCP server package (installed via npx)

## Next Steps

1. Replace the demo API key with your actual Stripe test key
2. Test individual tools with your Stripe account
3. Integrate with your preferred AI agent framework
4. Configure tool restrictions based on your use case