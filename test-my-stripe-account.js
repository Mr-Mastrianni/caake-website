// Test script to verify connection to your Stripe account
// Replace the API key below with your actual Stripe test key

const apiKey = 'sk_test_YOUR_ACTUAL_KEY_HERE'; // Replace this with your key

console.log('🔧 Testing Stripe Account Connection');
console.log('=====================================\n');

if (apiKey === 'sk_test_YOUR_ACTUAL_KEY_HERE') {
  console.log('❌ Please update the apiKey variable with your actual Stripe test key');
  console.log('   1. Go to https://dashboard.stripe.com/test/apikeys');
  console.log('   2. Copy your "Secret key" (starts with sk_test_)');
  console.log('   3. Replace the apiKey value in this file');
  console.log('   4. Run this script again\n');
  process.exit(1);
}

console.log('✅ API Key format looks correct');
console.log(`   Key starts with: ${apiKey.substring(0, 12)}...`);

// Test the MCP server with your key
const { spawn } = require('child_process');

console.log('\n🚀 Starting Stripe MCP server with your API key...');

const serverProcess = spawn('npx', ['-y', '@stripe/mcp', '--tools=all', `--api-key=${apiKey}`], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverStarted = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📤 Server output:', output.trim());
  
  if (output.includes('MCP server') || output.includes('listening')) {
    serverStarted = true;
    console.log('✅ Server appears to be running successfully!');
  }
});

serverProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('📥 Server status:', error.trim());
  
  if (error.includes('Error') && error.includes('Invalid')) {
    console.log('❌ API Key appears to be invalid');
    console.log('   Please check your Stripe dashboard for the correct key');
  } else if (error.includes('listening') || error.includes('ready')) {
    serverStarted = true;
    console.log('✅ Server is ready to accept connections!');
  }
});

serverProcess.on('error', (error) => {
  console.log('❌ Failed to start server:', error.message);
});

// Give the server time to start and show status
setTimeout(() => {
  if (serverStarted) {
    console.log('\n🎉 SUCCESS! Your Stripe MCP server is working correctly.');
    console.log('   You can now use it with AI agents and MCP clients.');
    console.log('\n📋 Next steps:');
    console.log('   1. Update mcp_settings.json with your API key');
    console.log('   2. Connect via MCP client to use Stripe tools');
    console.log('   3. Test with simple operations like listing customers');
  } else {
    console.log('\n⚠️  Server status unclear. Check the output above for any errors.');
    console.log('   If you see connection errors, verify your API key is correct.');
  }
  
  console.log('\n🛑 Stopping test server...');
  serverProcess.kill();
  
  setTimeout(() => {
    console.log('✅ Test completed.');
    process.exit(0);
  }, 1000);
}, 5000);

console.log('\n⏳ Waiting for server to start (this may take a few seconds)...');
console.log('   The server will automatically stop after the test.\n');