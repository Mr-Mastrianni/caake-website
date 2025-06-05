# Connecting to Your Stripe Account

Follow these steps to connect the MCP server to your specific Stripe account:

## Step 1: Get Your Stripe API Keys

1. **Log into your Stripe Dashboard**
   - Go to https://dashboard.stripe.com/
   - Sign in with your Stripe account credentials

2. **Navigate to API Keys**
   - In the left sidebar, click on "Developers"
   - Click on "API keys"

3. **Copy Your Secret Key**
   - For testing: Copy the "Secret key" that starts with `sk_test_...`
   - For production: Copy the "Secret key" that starts with `sk_live_...`
   - **Important**: Never share or commit live keys to version control!

## Step 2: Update MCP Configuration

### Option A: Direct Configuration (Quick Setup)

Edit the `mcp_settings.json` file and replace the demo key:

```json
{
  "mcpServers": {
    "github.com/stripe/agent-toolkit": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_YOUR_ACTUAL_KEY_HERE"
      }
    }
  }
}
```

### Option B: Environment Variable (Recommended for Security)

1. **Create a `.env` file** in your project root:
```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
```

2. **Update `mcp_settings.json`** to use environment variable:
```json
{
  "mcpServers": {
    "github.com/stripe/agent-toolkit": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

3. **Add `.env` to `.gitignore`** to prevent committing secrets:
```
.env
```

## Step 3: Test the Connection

Run this command to test your connection:

```bash
npx -y @stripe/mcp --tools=all --api-key=sk_test_YOUR_ACTUAL_KEY_HERE
```

If successful, you should see the server start without errors.

## Step 4: Verify Account Access

Create a test script to verify you can access your Stripe data:

```javascript
// test-my-stripe-account.js
const { spawn } = require('child_process');

async function testStripeConnection() {
  console.log('Testing connection to your Stripe account...');
  
  // Replace with your actual key
  const apiKey = 'sk_test_YOUR_ACTUAL_KEY_HERE';
  
  const serverProcess = spawn('npx', ['-y', '@stripe/mcp', '--tools=all', `--api-key=${apiKey}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log('Server output:', data.toString());
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.log('Server ready:', data.toString());
  });
  
  // Give server time to start
  setTimeout(() => {
    console.log('Server should be running. Check for any error messages above.');
    serverProcess.kill();
  }, 3000);
}

testStripeConnection();
```

## Step 5: Available Operations with Your Account

Once connected, you can perform these operations on your actual Stripe account:

### Customer Operations
- **List your existing customers**: `stripe_list_customers`
- **Create new customers**: `stripe_create_customer`

### Product & Pricing
- **View your products**: `stripe_list_products`
- **Create new products**: `stripe_create_product`
- **Set up pricing**: `stripe_create_price`

### Financial Data
- **Check account balance**: `stripe_retrieve_balance`
- **View subscriptions**: `stripe_list_subscriptions`
- **Process refunds**: `stripe_create_refund`

### Payment Processing
- **Create payment links**: `stripe_create_payment_link`
- **Generate invoices**: `stripe_create_invoice`

## Security Best Practices

1. **Use Test Keys During Development**
   - Always start with `sk_test_...` keys
   - Test keys won't process real payments

2. **Environment Variables**
   - Store API keys in environment variables
   - Never commit keys to version control

3. **Key Rotation**
   - Regularly rotate your API keys
   - Immediately revoke compromised keys

4. **Permissions**
   - Use restricted API keys when possible
   - Only grant necessary permissions

## Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Verify you copied the complete key
   - Ensure no extra spaces or characters
   - Check if using test vs live key correctly

2. **"Permission Denied" Error**
   - Verify your Stripe account has necessary permissions
   - Check if your account is fully activated

3. **Connection Timeout**
   - Check your internet connection
   - Verify Stripe's service status

### Getting Help:

- Stripe Documentation: https://docs.stripe.com/
- Stripe Support: https://support.stripe.com/
- API Reference: https://docs.stripe.com/api

## Next Steps

After connecting to your account:

1. Test basic operations (list customers, check balance)
2. Create test products and prices
3. Generate payment links for testing
4. Integrate with your AI agent framework
5. Move to live keys when ready for production