const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const { spawn } = require('child_process');

async function testStripeMCP() {
  console.log('Starting Stripe MCP server test...');
  
  try {
    // Spawn the MCP server process
    const serverProcess = spawn('npx', ['-y', '@stripe/mcp', '--tools=all', '--api-key=sk_test_demo'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Create transport and client
    const transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin
    });
    
    const client = new Client({
      name: "stripe-mcp-test",
      version: "1.0.0"
    }, {
      capabilities: {
        tools: {}
      }
    });
    
    // Connect to the server
    await client.connect(transport);
    console.log('Connected to Stripe MCP server');
    
    // List available tools
    const toolsResult = await client.listTools();
    console.log('Available tools:');
    toolsResult.tools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });
    
    // Test a simple tool - list customers (this should work even with demo key)
    if (toolsResult.tools.some(tool => tool.name === 'stripe_list_customers')) {
      console.log('\nTesting stripe_list_customers tool...');
      try {
        const result = await client.callTool({
          name: 'stripe_list_customers',
          arguments: { limit: 5 }
        });
        console.log('Tool result:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.log('Tool call failed (expected with demo key):', error.message);
      }
    }
    
    // Clean up
    await client.close();
    serverProcess.kill();
    console.log('Test completed');
    
  } catch (error) {
    console.error('Error testing MCP server:', error);
  }
}

// Run the test
testStripeMCP().catch(console.error);