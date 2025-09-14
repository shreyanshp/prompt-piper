#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Prompt Piper App...\n');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
    console.log('✅ .env.local already exists');
    console.log('📝 Please make sure it contains your API keys:\n');
    console.log('   ANTHROPIC_API_KEY=your_anthropic_api_key_here');
    console.log('   OPENAI_API_KEY=your_openai_api_key_here\n');
    return;
}

// Create .env.local template
const envTemplate = `# API Keys for AI Testing in Demo-3
# Get your API keys from:
# - Anthropic: https://console.anthropic.com/
# - OpenAI: https://platform.openai.com/api-keys

# Anthropic API Key (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API Key (for ChatGPT)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: OpenRouter API Key (alternative to direct API keys)
OPENROUTER_API_KEY=your_openrouter_api_key_here
`;

try {
    fs.writeFileSync(envLocalPath, envTemplate);
    console.log('✅ Created .env.local file');
    console.log('📝 Please edit .env.local and add your actual API keys:\n');
    console.log('   ANTHROPIC_API_KEY=your_anthropic_api_key_here');
    console.log('   OPENAI_API_KEY=your_openai_api_key_here\n');
    console.log('🔗 Get your API keys from:');
    console.log('   - Anthropic: https://console.anthropic.com/');
    console.log('   - OpenAI: https://platform.openai.com/api-keys\n');
    console.log('🚀 After adding your keys, restart the development server!');
} catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
    console.log('\n📝 Please manually create .env.local with the following content:\n');
    console.log(envTemplate);
}
