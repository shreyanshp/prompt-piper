#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync } from 'fs';
import { PromptCompressorV3 as PromptCompressor, CompressionResult } from './compressor';
import { ASCII_ART } from './ascii-art';
import { startInteractive } from './interactive';
import fetch from 'node-fetch';

interface ApiCompressionResult extends CompressionResult {
    apiResponse?: string;
}

// Load environment variables from config file
try {
    const configPath = require('path').join(__dirname, '../../config.env');
    const configContent = readFileSync(configPath, 'utf-8');
    configContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (error) {
    // Config file not found, use environment variables
}

const packageInfo = require('../package.json');

// OpenRouter API integration
class OpenRouterAPI {
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('OpenRouter API key required. Set OPENROUTER_API_KEY environment variable or provide --key option.');
        }
    }

    async executePrompt(prompt: string, isCompressed: boolean = false): Promise<string> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/prompt-piper/cli',
                'X-Title': 'Prompt Piper CLI'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: isCompressed ? 790 : 960,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || prompt;
    }
}

// Bitcoin.com AI API integration
class BitcoinComAPI {
    private apiKey: string;
    private baseURL = 'https://ai.bitcoin.com/api/v1';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.BITCOINCOM_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('Bitcoin.com AI API key required. Set BITCOINCOM_API_KEY environment variable or provide --key option.');
        }
    }

    async executePrompt(prompt: string, isCompressed: boolean = false): Promise<string> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'chatgpt-4o-latest',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: isCompressed ? 790 : 960,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Bitcoin.com AI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || prompt;
    }
}

// Show banner once per session
let bannerShown = false;
const showBanner = (force = false) => {
    if (!bannerShown) {
        console.log(chalk.cyan(ASCII_ART.banner));
        console.log();
        bannerShown = true;
    }
};

program
    .name('prompt-piper')
    .description('|> Compress AI prompts to reduce token usage and save costs')
    .version(packageInfo.version)
    .option('--openrouter', 'Use OpenRouter API to execute compressed prompts')
    .option('--bitcoincom', 'Use Bitcoin.com AI API to execute compressed prompts')
    .option('--key <apikey>', 'API key for the selected service');

// Main compress command
program
    .command('compress')
    .alias('c')
    .description('Compress a prompt to reduce token usage')
    .argument('[prompt]', 'The prompt to compress (if not provided, reads from stdin)')
    .option('-f, --file <path>', 'Read prompt from file')
    .option('-o, --output <path>', 'Save compressed prompt to file')
    .option('-q, --quiet', 'Only output the compressed prompt')
    .option('-s, --stats', 'Show detailed compression statistics')
    .option('--bypass', 'Skip compression when using API (for demonstration purposes)')
    .action(async (promptArg, options) => {
        try {
            // Check for conflicting API options
            const programOptions = program.opts();
            if (programOptions.openrouter && programOptions.bitcoincom) {
                console.error(chalk.red('[!] Cannot use both --openrouter and --bitcoincom at the same time'));
                process.exit(1);
            }

            // Validate --bypass flag
            if (options.bypass && !programOptions.openrouter && !programOptions.bitcoincom) {
                console.error(chalk.red('[!] --bypass flag can only be used with --openrouter or --bitcoincom'));
                process.exit(1);
            }

            let prompt = '';

            // Get prompt from various sources
            if (options.file) {
                prompt = readFileSync(options.file, 'utf-8');
            } else if (promptArg) {
                prompt = promptArg;
            } else {
                // Read from stdin
                const chunks: Buffer[] = [];
                for await (const chunk of process.stdin) {
                    chunks.push(chunk);
                }
                prompt = Buffer.concat(chunks).toString('utf-8');
            }

            if (!prompt.trim()) {
                console.error(chalk.red('[!] No prompt provided'));
                process.exit(1);
            }

            if (!options.quiet) {
                showBanner();
            }

            let result: ApiCompressionResult;
            
            if (programOptions.openrouter || programOptions.bitcoincom) {
                const apiName = programOptions.openrouter ? 'OpenRouter' : 'Bitcoin.com AI';
                const spinnerText = options.bypass ? `Sending original prompt to ${apiName}...` : `Compressing and sending to ${apiName}...`;
                const spinner = ora(spinnerText).start();
                
                try {
                    const apiInstance = programOptions.openrouter 
                        ? new OpenRouterAPI(programOptions.key)
                        : new BitcoinComAPI(programOptions.key);
                    
                    let promptToSend = prompt;
                    
                    if (!options.bypass) {
                        // Apply rule-based compression first
                        const ruleBasedResult = PromptCompressor.analyze(prompt);
                        promptToSend = ruleBasedResult.compressedPrompt;
                    }
                    
                    const apiResponse = await apiInstance.executePrompt(promptToSend, !options.bypass);
                    
                    // Create result object showing what was sent vs original
                    const originalTokens = Math.ceil(prompt.length / 4);
                    const sentTokens = Math.ceil(promptToSend.length / 4);
                    const savedTokens = originalTokens - sentTokens;
                    const compressionRatio = savedTokens > 0 ? (savedTokens / originalTokens) * 100 : 0;
                    const savedCost = (savedTokens / 1000) * 0.003;
                    
                    const baseResult = PromptCompressor.analyze(prompt);
                    result = {
                        ...baseResult,
                        compressedPrompt: promptToSend,
                        compressedTokens: sentTokens,
                        savedTokens,
                        compressionRatio,
                        savedCost,
                        apiResponse
                    };
                    
                    const successText = options.bypass ? `Original prompt sent to ${apiName}!` : `Compressed prompt sent to ${apiName}!`;
                    spinner.succeed(successText);
                } catch (error: any) {
                    spinner.fail('API request failed');
                    console.error(chalk.red('[!] API Error:'), error.message);
                    process.exit(1);
                }
            } else {
                const spinner = ora('Compressing prompt...').start();
                // Simulate processing time for UX
                await new Promise(resolve => setTimeout(resolve, 300));
                result = PromptCompressor.analyze(prompt);
                spinner.succeed('Prompt compressed successfully!');
            }

            // Output based on options
            if (options.quiet) {
                if (result.apiResponse) {
                    // In quiet mode with API, show only the API response
                    console.log(result.apiResponse);
                } else {
                    // In quiet mode without API, show the compressed prompt
                    console.log(result.compressedPrompt);
                }
            } else {
                console.log('\n' + chalk.bold.blue('>>> PROMPT PIPER RESULTS'));
                console.log(chalk.gray('='.repeat(50)));

                console.log(chalk.bold('\n[>] Compressed Prompt:'));
                console.log(chalk.green(result.compressedPrompt));

                if (options.stats) {
                    console.log('\n' + chalk.bold('[#] Compression Stats:'));
                    console.log(`${chalk.gray('Original tokens:')} ${chalk.white(result.originalTokens)}`);
                    console.log(`${chalk.gray('Compressed tokens:')} ${chalk.green(result.compressedTokens)}`);
                    console.log(`${chalk.gray('Tokens saved:')} ${chalk.red(result.savedTokens)}`);
                    console.log(`${chalk.gray('Compression ratio:')} ${chalk.blue(result.compressionRatio.toFixed(1) + '%')}`);
                    console.log(`${chalk.gray('Cost savings:')} ${chalk.green('$' + result.savedCost.toFixed(4) + ' per request')}`);
                } else {
                    // Show compact stats
                    console.log(`\n${chalk.gray('Stats:')} ${result.originalTokens} → ${chalk.green(result.compressedTokens)} tokens (${chalk.red('-' + result.savedTokens)} | ${chalk.blue(result.compressionRatio.toFixed(1) + '%')})`);
                }

                // Show API response if available
                if (result.apiResponse) {
                    const apiName = programOptions.openrouter ? 'OpenRouter' : 'Bitcoin.com AI';
                    console.log('\n' + chalk.bold(`[🤖] ${apiName} Response:`));
                    console.log(chalk.gray('─'.repeat(50)));
                    console.log(chalk.cyan(result.apiResponse));
                    console.log(chalk.gray('─'.repeat(50)));
                }
            }

            // Save to file if requested
            if (options.output) {
                writeFileSync(options.output, result.compressedPrompt);
                if (!options.quiet) {
                    console.log(`\n${chalk.green('[+]')} Compressed prompt saved to: ${options.output}`);
                }
            }

        } catch (error: any) {
            console.error(chalk.red('[!] Error:'), error.message);
            process.exit(1);
        }
    });

// Analyze command for detailed stats
program
    .command('analyze')
    .alias('a')
    .description('Analyze a prompt without compressing it')
    .argument('[prompt]', 'The prompt to analyze')
    .option('-f, --file <path>', 'Read prompt from file')
    .action(async (promptArg, options) => {
        try {
            let prompt = '';

            if (options.file) {
                prompt = readFileSync(options.file, 'utf-8');
            } else if (promptArg) {
                prompt = promptArg;
            } else {
                console.error(chalk.red('[!] No prompt provided'));
                process.exit(1);
            }

            showBanner();

            const spinner = ora('Analyzing prompt...').start();
            await new Promise(resolve => setTimeout(resolve, 200));

            const result = PromptCompressor.analyze(prompt);
            spinner.succeed('Analysis complete!');

            console.log('\n' + chalk.bold.blue('>>> PROMPT ANALYSIS'));
            console.log(chalk.gray('='.repeat(50)));

            console.log(`${chalk.bold('[#] Current Stats:')}`);
            console.log(`${chalk.gray('Current tokens:')} ${chalk.white(result.originalTokens)}`);
            console.log(`${chalk.gray('Estimated cost:')} ${chalk.white('$' + (result.originalTokens / 1000 * 0.003).toFixed(4) + ' per request')}`);

            console.log(`\n${chalk.bold('[*] Potential Savings:')}`);
            console.log(`${chalk.gray('After compression:')} ${chalk.green(result.compressedTokens + ' tokens')}`);
            console.log(`${chalk.gray('Tokens saved:')} ${chalk.red(result.savedTokens)}`);
            console.log(`${chalk.gray('Compression ratio:')} ${chalk.blue(result.compressionRatio.toFixed(1) + '%')}`);
            console.log(`${chalk.gray('Cost savings:')} ${chalk.green('$' + result.savedCost.toFixed(4) + ' per request')}`);

            if (result.savedTokens > 0) {
                console.log(`\n${chalk.green('[$] Run')} ${chalk.bold('prompt-piper compress')} ${chalk.green('to apply compression!')}`);
            } else {
                console.log(`\n${chalk.yellow('[i] This prompt is already quite efficient!')}`);
            }

        } catch (error: any) {
            console.error(chalk.red('[!] Error:'), error.message);
            process.exit(1);
        }
    });

// Interactive mode command
program
    .command('interactive')
    .alias('i')
    .description('Start interactive mode with menu-driven interface')
    .option('--openrouter', 'Use OpenRouter API in interactive mode')
    .option('--bitcoincom', 'Use Bitcoin.com AI API in interactive mode')
    .option('--key <apikey>', 'API key for the selected service')
    .action((options) => {
        // Check for conflicting API options
        if (options.openrouter && options.bitcoincom) {
            console.error(chalk.red('[!] Cannot use both --openrouter and --bitcoincom at the same time'));
            process.exit(1);
        }
        
        // Set global API configuration for interactive mode
        if (options.openrouter) {
            process.env.INTERACTIVE_API = 'openrouter';
            if (options.key) process.env.OPENROUTER_API_KEY = options.key;
        } else if (options.bitcoincom) {
            process.env.INTERACTIVE_API = 'bitcoincom';
            if (options.key) process.env.BITCOINCOM_API_KEY = options.key;
        }
        
        startInteractive();
    });

program.parse();
