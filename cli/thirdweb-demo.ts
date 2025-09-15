#!/usr/bin/env ts-node

/**
 * thirdweb Storage API Demo for IPFS Rule Set Storage
 * This demonstrates how to store and load compression rules using thirdweb
 */

import chalk from 'chalk';
import { RuleSetRegistry } from './src/ipfs/rule-set-registry';
import { SpecializedRuleSets } from './src/ipfs/specialized-rules';

async function demonstrateThirdwebStorage() {
    console.log(chalk.cyan('🚀 thirdweb Storage API Demo'));
    console.log(chalk.gray('='.repeat(60)));
    console.log();

    // Initialize the registry
    const registry = RuleSetRegistry.getInstance();

    // Load specialized rule sets
    const specializedSets = SpecializedRuleSets.getAllSpecializedRuleSets();
    specializedSets.forEach(ruleSet => {
        registry.registerRuleSet(ruleSet);
    });

    console.log(chalk.yellow('📋 Available Rule Sets:'));
    console.log();

    const allRuleSets = registry.getAllRuleSets();
    allRuleSets.forEach((ruleSet, index) => {
        console.log(chalk.white(`${index + 1}.`), chalk.bold.cyan(ruleSet.name));
        console.log(chalk.gray(`   ID: ${ruleSet.id}`));
        console.log(chalk.gray(`   Category: ${ruleSet.category}`));
        console.log(chalk.gray(`   Author: ${ruleSet.author}`));
        if (ruleSet.language) {
            console.log(chalk.gray(`   Language: ${ruleSet.language}`));
        }
        console.log(chalk.gray(`   Description: ${ruleSet.description}`));
        console.log();
    });

    console.log(chalk.yellow('💾 thirdweb Storage API Usage:'));
    console.log();

    console.log(chalk.bold('1. Set up thirdweb:'));
    console.log(chalk.gray('   export THIRDWEB_CLIENT_ID="your_client_id_here"'));
    console.log();

    console.log(chalk.bold('2. Store a rule set:'));
    console.log(chalk.gray('   prompt-piper rules:store solidity-smart-contract-compression'));
    console.log(chalk.gray('   # Returns: ipfs://QmYourRuleSetHashHere'));
    console.log();

    console.log(chalk.bold('3. Load a rule set:'));
    console.log(chalk.gray('   prompt-piper rules:load ipfs://QmYourRuleSetHashHere'));
    console.log();

    console.log(chalk.yellow('🧪 Compression Examples:'));
    console.log();

    const examples = [
        {
            name: 'General Text',
            original: 'Could you please help me write a very detailed step by step guide for creating a web application?',
            compressed: 'Help write detailed stepwise guide for creating web application?',
            reduction: '35%'
        },
        {
            name: 'Solidity Smart Contract',
            original: 'Please write a smart contract that implements an ERC-20 token with minting, burning, and transfer functionality. Make sure the contract follows security best practices.',
            compressed: 'Write contract implementing ERC20 token with minting, burning, transfer. Ensure security.',
            reduction: '42%'
        },
        {
            name: 'Go Programming',
            original: 'Create a Go program that demonstrates how to use goroutines and channels for concurrent programming. Make sure the code follows Go best practices.',
            compressed: 'Create go program demonstrating goroutines and chans for concurrent programming. Ensure go best practices.',
            reduction: '28%'
        }
    ];

    examples.forEach(example => {
        console.log(chalk.bold.blue(`${example.name}:`));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.gray('Original:'), example.original);
        console.log(chalk.green('Compressed:'), example.compressed);
        console.log(chalk.cyan('Reduction:'), `${example.reduction} token savings`);
        console.log();
    });

    console.log(chalk.yellow('📖 Complete Command Examples:'));
    console.log();

    console.log(chalk.bold('Setup:'));
    console.log(chalk.gray('1. Get thirdweb CLIENT_ID from: https://thirdweb.com/dashboard'));
    console.log(chalk.gray('2. Set environment variable: export THIRDWEB_CLIENT_ID="your_id"'));
    console.log();

    console.log(chalk.bold('Rule Set Management:'));
    console.log(chalk.gray('• List rules: prompt-piper rules:list'));
    console.log(chalk.gray('• Store rules: prompt-piper rules:store <rule-id>'));
    console.log(chalk.gray('• Load rules: prompt-piper rules:load <ipfs-uri>'));
    console.log(chalk.gray('• Show details: prompt-piper rules:show <rule-id>'));
    console.log();

    console.log(chalk.bold('Compression with Rules:'));
    console.log(chalk.gray('• Language-specific: prompt-piper compress-v3 "prompt" --language solidity'));
    console.log(chalk.gray('• Custom rules: prompt-piper compress-v3 "prompt" --rules "rule1,rule2"'));
    console.log(chalk.gray('• Category filter: prompt-piper compress-v3 "prompt" --category programming'));
    console.log();

    console.log(chalk.yellow('🌐 thirdweb vs Local IPFS:'));
    console.log();

    console.log(chalk.bold.green('thirdweb Advantages:'));
    console.log(chalk.gray('✅ No local IPFS node required'));
    console.log(chalk.gray('✅ Automatic pinning and availability'));
    console.log(chalk.gray('✅ Reliable CDN access'));
    console.log(chalk.gray('✅ Simple API integration'));
    console.log(chalk.gray('✅ Built-in redundancy'));
    console.log();

    console.log(chalk.bold.yellow('Local IPFS Advantages:'));
    console.log(chalk.gray('✅ Full control over your node'));
    console.log(chalk.gray('✅ No external dependencies'));
    console.log(chalk.gray('✅ Direct peer-to-peer access'));
    console.log(chalk.gray('✅ Custom pinning policies'));
    console.log();

    console.log(chalk.yellow('🔧 Getting Started:'));
    console.log();
    console.log(chalk.gray('1. Visit: https://thirdweb.com/dashboard'));
    console.log(chalk.gray('2. Create a new project'));
    console.log(chalk.gray('3. Copy your CLIENT_ID'));
    console.log(chalk.gray('4. Set environment variable: export THIRDWEB_CLIENT_ID="your_id"'));
    console.log(chalk.gray('5. Start using: prompt-piper rules:list'));
    console.log();

    console.log(chalk.green('✅ Demo completed successfully!'));
    console.log();
    console.log(chalk.cyan('Key Benefits:'));
    console.log(chalk.gray('• No local IPFS setup required'));
    console.log(chalk.gray('• Reliable cloud-based storage'));
    console.log(chalk.gray('• Automatic pinning and availability'));
    console.log(chalk.gray('• Simple API integration'));
    console.log(chalk.gray('• Community rule sharing made easy'));
    console.log();
    console.log(chalk.bold('Ready to start using thirdweb Storage! 🚀'));
}

// Run the demo
if (require.main === module) {
    demonstrateThirdwebStorage();
}
