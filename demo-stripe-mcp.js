// Stripe MCP Server Demonstration
// This script demonstrates the capabilities of the Stripe Agent Toolkit MCP server

console.log('=== Stripe MCP Server Demonstration ===\n');

// Simulate the available tools that the Stripe MCP server provides
const availableTools = [
  {
    name: 'stripe_create_customer',
    description: 'Create a new customer in Stripe',
    parameters: {
      email: 'string',
      name: 'string (optional)',
      description: 'string (optional)'
    }
  },
  {
    name: 'stripe_list_customers',
    description: 'List customers with optional filtering',
    parameters: {
      limit: 'number (optional, default: 10)',
      starting_after: 'string (optional)'
    }
  },
  {
    name: 'stripe_create_product',
    description: 'Create a new product in your Stripe catalog',
    parameters: {
      name: 'string',
      description: 'string (optional)',
      type: 'string (service or good)'
    }
  },
  {
    name: 'stripe_create_price',
    description: 'Create a price for a product',
    parameters: {
      product: 'string (product ID)',
      unit_amount: 'number (in cents)',
      currency: 'string (e.g., "usd")'
    }
  },
  {
    name: 'stripe_create_payment_link',
    description: 'Create a payment link for easy checkout',
    parameters: {
      line_items: 'array of objects with price and quantity'
    }
  },
  {
    name: 'stripe_retrieve_balance',
    description: 'Get current account balance',
    parameters: {}
  },
  {
    name: 'stripe_list_subscriptions',
    description: 'List all subscriptions',
    parameters: {
      limit: 'number (optional)',
      status: 'string (optional: active, canceled, etc.)'
    }
  },
  {
    name: 'stripe_create_invoice',
    description: 'Create an invoice for a customer',
    parameters: {
      customer: 'string (customer ID)',
      auto_advance: 'boolean (optional)'
    }
  },
  {
    name: 'stripe_create_refund',
    description: 'Create a refund for a payment',
    parameters: {
      payment_intent: 'string (payment intent ID)',
      amount: 'number (optional, refunds full amount if not specified)'
    }
  },
  {
    name: 'stripe_create_coupon',
    description: 'Create a discount coupon',
    parameters: {
      percent_off: 'number (percentage discount)',
      duration: 'string (once, repeating, forever)'
    }
  }
];

console.log('Available Stripe MCP Tools:');
console.log('===========================\n');

availableTools.forEach((tool, index) => {
  console.log(`${index + 1}. ${tool.name}`);
  console.log(`   Description: ${tool.description}`);
  console.log(`   Parameters:`);
  Object.entries(tool.parameters).forEach(([param, type]) => {
    console.log(`     - ${param}: ${type}`);
  });
  console.log('');
});

console.log('Example Usage Scenarios:');
console.log('========================\n');

const examples = [
  {
    scenario: 'Create a new customer',
    tool: 'stripe_create_customer',
    example: {
      email: 'customer@example.com',
      name: 'John Doe',
      description: 'Premium customer'
    }
  },
  {
    scenario: 'Create a product and price',
    tool: 'stripe_create_product',
    example: {
      name: 'AI Consultation Service',
      description: 'Professional AI consulting and implementation',
      type: 'service'
    }
  },
  {
    scenario: 'Generate a payment link',
    tool: 'stripe_create_payment_link',
    example: {
      line_items: [
        {
          price: 'price_1234567890',
          quantity: 1
        }
      ]
    }
  }
];

examples.forEach((example, index) => {
  console.log(`${index + 1}. ${example.scenario}`);
  console.log(`   Tool: ${example.tool}`);
  console.log(`   Example parameters:`);
  console.log(`   ${JSON.stringify(example.example, null, 6)}`);
  console.log('');
});

console.log('Integration Notes:');
console.log('==================\n');
console.log('• The MCP server is configured in mcp_settings.json');
console.log('• Server name: "github.com/stripe/agent-toolkit"');
console.log('• All tools are enabled with --tools=all flag');
console.log('• Requires valid Stripe API key for actual operations');
console.log('• Compatible with OpenAI Agent SDK, LangChain, CrewAI, and Vercel AI SDK');
console.log('• Supports both test and live Stripe environments');

console.log('\nTo use with a real Stripe account:');
console.log('1. Replace sk_test_demo with your actual Stripe secret key');
console.log('2. Update the STRIPE_SECRET_KEY in mcp_settings.json');
console.log('3. Connect via MCP client to use the tools programmatically');