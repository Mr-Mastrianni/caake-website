// Interactive setup script for connecting to your Stripe account
const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Stripe Account Connection Setup');
console.log('==================================\n');

console.log('Follow these steps to connect to your Stripe account:\n');

console.log('STEP 1: Get Your Stripe API Key');
console.log('-------------------------------');
console.log('1. Open your browser and go to: https://dashboard.stripe.com/test/apikeys');
console.log('2. In the "Standard keys" section, find "Secret key"');
console.log('3. Click "Reveal test key token" if it\'s hidden');
console.log('4. Copy the key (it starts with "sk_test_")');
console.log('5. Come back here and paste it below\n');

rl.question('Paste your Stripe test secret key here: ', (apiKey) => {
  console.log('\n🔍 Validating your API key...');
  
  // Basic validation
  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ No API key provided. Please run this script again.');
    rl.close();
    return;
  }
  
  const trimmedKey = apiKey.trim();
  
  if (!trimmedKey.startsWith('sk_test_')) {
    console.log('⚠️  Warning: This doesn\'t look like a test key.');
    console.log('   Test keys start with "sk_test_"');
    console.log('   Live keys start with "sk_live_"');
    console.log('   For safety, we recommend using test keys first.\n');
    
    rl.question('Do you want to continue anyway? (y/N): ', (answer) => {
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('Setup cancelled. Please get your test key and try again.');
        rl.close();
        return;
      }
      continueSetup(trimmedKey);
    });
  } else {
    console.log('✅ API key format looks correct!');
    continueSetup(trimmedKey);
  }
});

function continueSetup(apiKey) {
  console.log('\nSTEP 2: Creating .env file');
  console.log('---------------------------');
  
  // Create .env file
  const envContent = `# Stripe API Configuration
STRIPE_SECRET_KEY=${apiKey}

# This file contains sensitive information and is ignored by git
# Never share or commit this file to version control
`;
  
  try {
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file with your API key');
  } catch (error) {
    console.log('❌ Failed to create .env file:', error.message);
    rl.close();
    return;
  }
  
  console.log('\nSTEP 3: Testing connection to your Stripe account');
  console.log('--------------------------------------------------');
  console.log('Starting Stripe MCP server with your API key...\n');
  
  const serverProcess = spawn('npx', ['-y', '@stripe/mcp', '--tools=all', `--api-key=${apiKey}`], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let connectionSuccessful = false;
  let hasError = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log('📤 Server:', output);
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (error) {
      console.log('📥 Status:', error);
      
      if (error.includes('Error') && (error.includes('Invalid') || error.includes('authentication'))) {
        hasError = true;
        console.log('\n❌ Authentication failed!');
        console.log('   Your API key might be incorrect or expired.');
        console.log('   Please check your Stripe dashboard and try again.');
      } else if (error.includes('listening') || error.includes('ready') || error.includes('MCP server')) {
        connectionSuccessful = true;
        console.log('\n✅ Connection successful!');
      }
    }
  });
  
  serverProcess.on('error', (error) => {
    console.log('❌ Failed to start server:', error.message);
    hasError = true;
  });
  
  // Test for 5 seconds
  setTimeout(() => {
    console.log('\n🛑 Stopping test server...');
    serverProcess.kill();
    
    setTimeout(() => {
      if (hasError) {
        console.log('\n❌ Setup failed. Please check your API key and try again.');
        console.log('   Make sure you copied the complete key from your Stripe dashboard.');
      } else if (connectionSuccessful) {
        console.log('\n🎉 SUCCESS! Your Stripe account is now connected!');
        console.log('\nWhat you can do now:');
        console.log('• List your customers: stripe_list_customers');
        console.log('• Check account balance: stripe_retrieve_balance');
        console.log('• Create products: stripe_create_product');
        console.log('• Generate payment links: stripe_create_payment_link');
        console.log('• And much more!\n');
        
        console.log('Your MCP server is configured in mcp_settings.json');
        console.log('You can now use it with AI agents and MCP clients.');
      } else {
        console.log('\n⚠️  Connection status unclear.');
        console.log('   If you didn\'t see any errors above, your setup is likely working.');
        console.log('   Try using the MCP server with an AI agent to test functionality.');
      }
      
      console.log('\n📋 Next steps:');
      console.log('1. Your API key is saved in .env (secure and git-ignored)');
      console.log('2. MCP server is configured in mcp_settings.json');
      console.log('3. Test with: node demo-stripe-mcp.js');
      console.log('4. Integrate with your preferred AI agent framework');
      
      rl.close();
    }, 1000);
  }, 5000);
  
  console.log('⏳ Testing connection (this will take a few seconds)...');
}