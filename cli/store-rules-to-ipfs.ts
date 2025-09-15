#!/usr/bin/env ts-node

import chalk from 'chalk';
import dotenv from 'dotenv';
import { IPFSStorageService } from './src/ipfs/storage-service';
import type { CompressionRuleSet } from './src/types';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

async function main() {
    console.log(chalk.cyan.bold('🚀 Storing Rule Sets to IPFS with Thirdweb'));
    console.log(chalk.gray('='.repeat(60)));
    console.log();

    try {
        const storageService = new IPFSStorageService();

        // Store individual rule sets
        const rulesToStore = [
            'general-text-compression',
            'solidity-smart-contract-compression',
            'python-code-compression',
            'technical-documentation-compression',
            'code-review-compression'
        ];

        console.log(chalk.yellow('📤 Storing Individual Rule Sets:'));
        console.log();

        for (const ruleId of rulesToStore) {
            await storageService.storeRuleSet(ruleId);
            console.log();
        }

        // Create and store a custom rule set
        console.log(chalk.yellow('📝 Creating & Storing Custom Rule Set:'));
        const customRuleSet: CompressionRuleSet = {
            id: 'prompt-piper-demo-rules',
            name: 'Prompt Piper Demo Rules',
            description: 'Demo rule set with fresh IPFS hash',
            category: 'general',
            author: 'Prompt Piper',
            version: '1.0.0',
            rules: {
                customRules: [
                    {
                        pattern: 'please help me',
                        replacement: 'help',
                        description: 'Simplify help requests'
                    },
                    {
                        pattern: 'could you please',
                        replacement: 'please',
                        description: 'Remove redundant politeness'
                    },
                    {
                        pattern: 'I would like to',
                        replacement: 'I want to',
                        description: 'Direct request'
                    }
                ]
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['demo', 'custom']
        };

        await storageService.storeCustomRuleSet(customRuleSet);
        console.log();

        // Store all rule sets and create manifest
        console.log(chalk.yellow('📦 Creating Complete Manifest:'));
        const manifest = await storageService.storeAllRuleSets();

        // Display all stored hashes
        console.log();
        storageService.displayStoredHashes();

        console.log();
        console.log(chalk.green.bold('✅ All rule sets successfully stored to IPFS!'));
        console.log();
        console.log(chalk.cyan('🔗 You can now use these IPFS URIs to load rule sets:'));
        console.log(chalk.gray('   prompt-piper rules:load <ipfs-uri>'));
        console.log();
        console.log(chalk.yellow('💡 Example:'));
        const firstHash = storageService.getStoredHashes().values().next().value;
        if (firstHash) {
            console.log(chalk.gray(`   prompt-piper rules:load ${firstHash.ipfsUri}`));
        }

    } catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
        if (error instanceof Error && error.message.includes('THIRDWEB_CLIENT_ID')) {
            console.log();
            console.log(chalk.yellow('To get started:'));
            console.log(chalk.gray('1. Visit https://thirdweb.com/dashboard'));
            console.log(chalk.gray('2. Create a new project'));
            console.log(chalk.gray('3. Copy your CLIENT_ID'));
            console.log(chalk.gray('4. Run: export THIRDWEB_CLIENT_ID="your_client_id"'));
        }
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}