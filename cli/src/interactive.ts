#!/usr/bin/env node

import * as readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import fetch from 'node-fetch';
import { PromptCompressorV3 as PromptCompressor } from './compressor';
import { ASCII_ART } from './ascii-art';
import { simpleExamples, codeExamples } from './compression-rules/example-prompts';
import { execSync } from 'child_process';
import { runClaudeNonInteractive } from './claude-launcher';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('\nprompt-piper> ')
});

// OpenRouter API integration
class OpenRouterAPI {
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    }

    hasApiKey(): boolean {
        return !!this.apiKey;
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
    }

    hasApiKey(): boolean {
        return !!this.apiKey;
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

const EXAMPLES = [
    ...simpleExamples,
    ...codeExamples
];

// Parse command line arguments and environment
const args = process.argv.slice(2);
const isClaudeMode = args.includes('--claude');

// Global API instances
const openRouterApi = new OpenRouterAPI();
const bitcoincomApi = new BitcoinComAPI();

// Global state for API mode - will be initialized in startInteractive
let apiMode = false;
let bypassMode = false;
let currentApi: string | undefined;

function clearScreen() {
    console.clear();
    console.log('\x1Bc'); // Clear screen and scrollback
}

function showWelcome() {
    clearScreen();
    console.log(chalk.cyan(ASCII_ART.banner));
    console.log();
    console.log(chalk.gray('═'.repeat(80)));
    console.log();
    console.log(chalk.bold.white('Welcome to PROMPT PIPER Interactive Mode'));
    console.log(chalk.gray('Compress your AI prompts in real-time and save on API costs'));
    
    if (apiMode && currentApi && currentApi !== 'claude') {
        let apiName: string;
        if (currentApi === 'openrouter') {
            apiName = 'OpenRouter';
        } else if (currentApi === 'bitcoincom') {
            apiName = 'Bitcoin.com AI';
        } else {
            apiName = 'Unknown API';
        }
        console.log(chalk.green(`Running in API MODE - compressed prompts will be sent to ${apiName}`));
    } else if (isClaudeMode || currentApi === 'claude') {
        console.log(chalk.green('Running in CLAUDE MODE - compressed prompts will be forwarded to Claude CLI'));
    } else {
        console.log(chalk.yellow('Running in COMPRESSION MODE - shows compression results only'));
        console.log(chalk.gray('Use --openrouter, --bitcoincom, or --claude flag to forward compressed prompts'));
    }
    
    console.log();
    console.log(chalk.gray('═'.repeat(80)));
}

function showMenu() {
    console.log();
    console.log(chalk.bold.yellow('MAIN MENU'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log();
    console.log(chalk.bold.cyan('Simple Examples:'));
    console.log(chalk.white('1)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[0].title));
    console.log(chalk.white('2)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[1].title));
    console.log(chalk.white('3)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[2].title));
    console.log();
    console.log(chalk.bold.cyan('Code Examples (Dramatic Results):'));
    console.log(chalk.white('4)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[3].title));
    console.log(chalk.white('5)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[4].title));
    console.log(chalk.white('6)'), chalk.bold('Example:'), chalk.gray(EXAMPLES[5].title));
    console.log();
    console.log(chalk.white('7)'), chalk.bold('Enter Custom Prompt'));
    console.log(chalk.white('8)'), chalk.bold('View Compression Stats'));
    console.log();
    console.log(chalk.white('A)'), chalk.bold('Toggle API Mode'),
        apiMode ? chalk.green('(ON)') : chalk.gray('(OFF)'));
    console.log(chalk.white('B)'), chalk.bold('Toggle Bypass Mode'),
        bypassMode ? chalk.green('(ON)') : chalk.gray('(OFF)'),
        chalk.gray('(requires API mode)'));
    console.log(chalk.white('S)'), chalk.bold('Switch API Service'),
        currentApi ? chalk.cyan(`(${currentApi})`) : chalk.gray('(none)'));
    console.log();
    console.log(chalk.white('H)'), chalk.gray('Help'));
    console.log(chalk.white('C)'), chalk.gray('Clear Screen'));
    console.log(chalk.white('Q)'), chalk.gray('Quit'));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));

    if (apiMode && currentApi !== 'claude') {
        let apiName: string;
        if (currentApi === 'openrouter') {
            apiName = 'OpenRouter';
        } else if (currentApi === 'bitcoincom') {
            apiName = 'Bitcoin.com AI';
        } else {
            apiName = 'Unknown API';
        }
        console.log(chalk.cyan(`[API Mode Active: ${apiName}]`),
            bypassMode ? chalk.yellow('Bypass ON - sending original prompts') : chalk.green('Compressing before sending'));
    } else if (currentApi === 'claude') {
        console.log(chalk.cyan('[Claude Mode Active]'), chalk.green('Compressing then launching interactive Claude'));
    }
}

function showCompressionResult(result: any) {
    console.log();
    console.log(chalk.bold.blue('>>> COMPRESSION RESULTS'));
    console.log(chalk.gray('═'.repeat(60)));

    // Original prompt box
    console.log();
    console.log(chalk.bold('[<] ORIGINAL PROMPT'));
    console.log(chalk.gray('┌' + '─'.repeat(58) + '┐'));
    const originalLines = result.originalPrompt.match(/.{1,56}/g) || [result.originalPrompt];
    originalLines.forEach((line: string) => {
        console.log(chalk.gray('│'), chalk.white(line.padEnd(56)), chalk.gray('│'));
    });
    console.log(chalk.gray('└' + '─'.repeat(58) + '┘'));

    // Arrow
    console.log();
    console.log(' '.repeat(25) + chalk.cyan('▼ ▼ ▼'));
    console.log();

    // Compressed prompt box
    console.log(chalk.bold('[>] COMPRESSED PROMPT'));
    console.log(chalk.gray('┌' + '─'.repeat(58) + '┐'));
    const compressedLines = result.compressedPrompt.match(/.{1,56}/g) || [result.compressedPrompt];
    compressedLines.forEach((line: string) => {
        console.log(chalk.gray('│'), chalk.green(line.padEnd(56)), chalk.gray('│'));
    });
    console.log(chalk.gray('└' + '─'.repeat(58) + '┘'));

    // Stats
    console.log();
    console.log(chalk.bold('[#] COMPRESSION STATS'));
    console.log(chalk.gray('─'.repeat(40)));

    const percentage = Math.round((result.compressedTokens / result.originalTokens) * 100);
    const barWidth = 30;
    const filledBars = Math.round((percentage / 100) * barWidth);
    const emptyBars = barWidth - filledBars;

    console.log(chalk.gray('Tokens:'),
        chalk.white(result.originalTokens),
        chalk.cyan('→'),
        chalk.green(result.compressedTokens),
        chalk.red(`(-${result.savedTokens})`));

    console.log(chalk.gray('Visual:'),
        chalk.red('█'.repeat(barWidth)),
        chalk.gray('(before)'));
    console.log(chalk.gray('       '),
        chalk.green('█'.repeat(filledBars)) + chalk.gray('░'.repeat(emptyBars)),
        chalk.gray('(after)'));

    console.log(chalk.gray('Reduction:'), chalk.bold.red(`${result.compressionRatio.toFixed(1)}%`));
    console.log(chalk.gray('Cost saved:'), chalk.bold.green(`$${result.savedCost.toFixed(4)} per request`));

    if (result.savedTokens > 0) {
        console.log();
        console.log(chalk.yellow('[*] At 1,000 requests/day:'), chalk.bold.green(`$${(result.savedCost * 1000).toFixed(2)} saved`));
        console.log(chalk.yellow('[*] At 10,000 requests/day:'), chalk.bold.green(`$${(result.savedCost * 10000).toFixed(2)} saved`));
    }

    // Show API response if available
    if (result.apiResponse) {
        const apiName = currentApi === 'openrouter' ? 'OpenRouter' : 'Bitcoin.com AI';
        console.log();
        console.log(chalk.bold(`[🤖] ${apiName} RESPONSE`));
        console.log(chalk.gray('═'.repeat(60)));
        console.log();
        console.log(chalk.cyan(result.apiResponse));
        console.log();
        console.log(chalk.gray('═'.repeat(60)));
    }
}

let totalCompressed = 0;
let totalSaved = 0;
let totalSavedCost = 0;

function showStats() {
    console.log();
    console.log(chalk.bold.blue('>>> SESSION STATISTICS'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log();

    // Display stats with ASCII art on the right
    const asciiArt = [
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠄',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⡀⠀⠀⠀⠀⠀⠀⣀⣴⠟⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣷⣀⣀⣤⣶⡾⠟⠁⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣏⠉⠉⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⢀⣀⣄⠀⠺⣿⣿⣿⣿⡦⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⢀⣤⣤⣶⣾⣿⡿⢿⣿⣿⠀⠀⠉⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠈⠛⠉⠉⢻⣿⣆⠈⢿⣿⣦⣠⣾⣿⣿⡟⠿⣶⣦⡀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠻⣿⣧⣤⣿⣿⣿⣿⣿⣿⡇⠀⠘⣿⣿⣆⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠘⢿⣿⠿⠛⢹⣿⣿⣿⡇⠀⠀⣿⣿⣿⡆⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣇⠀⠀⢻⣿⣿⣿⡄⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣦⠀⠈⣿⣿⣿⣿⣄⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⡷⠀⠘⣿⡿⠛⠁⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠿⠟⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀'
    ];

    // Stats content
    const stats = [
        `${chalk.gray('Prompts compressed:')} ${chalk.white(totalCompressed)}`,
        `${chalk.gray('Total tokens saved:')} ${chalk.green(totalSaved)}`,
        `${chalk.gray('Total cost saved:')} ${chalk.green(`$${totalSavedCost.toFixed(4)}`)}`,
        '',
        totalSaved > 0 ? chalk.yellow('💡 Keep compressing to save more!') : chalk.gray('Start compressing to see savings!')
    ];

    // Display stats and ASCII art side by side
    for (let i = 0; i < Math.max(stats.length, asciiArt.length); i++) {
        const statLine = i < stats.length ? stats[i] : '';
        const artLine = i < asciiArt.length ? asciiArt[i] : '';

        // Strip ANSI color codes to get actual length for padding
        const stripAnsi = (str: string) => str.replace(/\x1B\[[0-9;]*m/g, '');
        const statLength = stripAnsi(statLine).length;

        // Pad stat line to 40 characters
        const padding = Math.max(0, 40 - statLength);
        const paddedStat = statLine + ' '.repeat(padding);

        // Combine stat and art on same line
        console.log(paddedStat + chalk.cyan(artLine));
    }

    console.log();
    console.log(chalk.gray('─'.repeat(60)));
}

async function executeWithClaude(compressedPrompt: string): Promise<void> {
    console.log();
    console.log(chalk.cyan('─'.repeat(60)));

    if (isClaudeMode) {
        console.log(chalk.yellow('[>] Launching Claude with compressed prompt...'));
        console.log();

        try {
            console.log(chalk.cyan('Starting interactive Claude session...'));
            console.log(chalk.gray('(Press Ctrl+C to return to Prompt Piper)'));
            console.log();

            // Launch Claude interactively with the compressed prompt
            // Escape backticks and other special characters for shell
            const escapedPrompt = compressedPrompt
                .replace(/\\/g, '\\\\')  // Escape backslashes first
                .replace(/"/g, '\\"')    // Escape double quotes
                .replace(/`/g, '\\`')    // Escape backticks
                .replace(/\$/g, '\\$');  // Escape dollar signs

            execSync(`echo "${escapedPrompt}" | claude`, {
                stdio: 'inherit', // This allows full interactive mode
                encoding: 'utf8'
            });

            console.log();
            console.log(chalk.green('✓ Claude session completed'));

        } catch (error: any) {
            console.log();
            console.log(chalk.red('✗ Failed to launch Claude CLI'));
            console.log(chalk.gray('Make sure Claude CLI is installed and available in PATH'));
            console.log();
            console.log(chalk.yellow('You can copy the compressed prompt below:'));
            console.log(chalk.cyan('─'.repeat(60)));
            console.log(chalk.white(compressedPrompt));
            console.log(chalk.cyan('─'.repeat(60)));
        }
    } else {
        console.log(chalk.yellow('[>] Compressed prompt ready for use:'));
        console.log();
        console.log(chalk.cyan('Copy this compressed prompt to your AI tool:'));
        console.log(chalk.cyan('─'.repeat(60)));
        console.log(chalk.white(compressedPrompt));
        console.log(chalk.cyan('─'.repeat(60)));
        console.log();
        console.log(chalk.gray('Tip: Use --claude flag to forward directly to Claude CLI'));
    }

    console.log();
    console.log(chalk.cyan('─'.repeat(60)));
}

function showHelp() {
    console.log();
    console.log(chalk.bold.blue('>>> HELP'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log();
    console.log(chalk.bold('About Prompt Piper:'));
    console.log(chalk.gray('Prompt Piper compresses verbose AI prompts by removing redundant'));
    console.log(chalk.gray('phrases and filler words while preserving meaning and intent.'));
    console.log();
    console.log(chalk.bold('How it works:'));
    console.log(chalk.gray('• Removes phrases like "Could you please", "I would like"'));
    console.log(chalk.gray('• Compresses verbose patterns ("step by step" → "stepwise")'));
    console.log(chalk.gray('• Eliminates filler words (very, really, quite, actually)'));
    console.log(chalk.gray('• Maintains the core request and all important details'));
    console.log();
    console.log(chalk.bold('Tips:'));
    console.log(chalk.gray('• Longer, more verbose prompts see better compression'));
    console.log(chalk.gray('• Test compressed prompts to ensure quality'));
    console.log(chalk.gray('• Track your savings with option 8'));
    console.log(chalk.gray('• For custom prompts: type your text, then press Enter'));
    console.log();
    console.log(chalk.bold('API Mode:'));
    console.log(chalk.gray('• Press A to toggle API mode'));
    console.log(chalk.gray('• Press S to switch between OpenRouter and Bitcoin.com AI'));
    console.log(chalk.gray('• Press B to toggle bypass mode (skips compression)'));
    console.log(chalk.gray('• API mode sends prompts to external services and shows responses'));
    console.log(chalk.gray('• Requires OPENROUTER_API_KEY or BITCOINCOM_API_KEY environment variable'));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));
}

async function getCustomPrompt(mainRl: readline.Interface): Promise<string> {
    return new Promise((resolve) => {
        console.log();
        console.log(chalk.bold.yellow('Enter your prompt:'));
        console.log(chalk.gray('─'.repeat(60)));

        const originalPrompt = mainRl.getPrompt();

        // Remove all existing listeners temporarily
        const existingListeners = mainRl.listeners('line') as Array<(...args: any[]) => void>;
        mainRl.removeAllListeners('line');

        mainRl.setPrompt(chalk.cyan('> '));

        const collectLine = (line: string) => {
            // Single line input - submit immediately
            mainRl.removeListener('line', collectLine);

            // Restore original listeners
            existingListeners.forEach(listener => {
                mainRl.on('line', listener);
            });

            mainRl.setPrompt(originalPrompt);
            resolve(line);
        };

        mainRl.on('line', collectLine);
        mainRl.prompt();
    });
}

async function processPrompt(prompt: string, title: string) {
    if (apiMode && currentApi !== 'claude' && !((currentApi === 'openrouter' && openRouterApi.hasApiKey()) || 
                     (currentApi === 'bitcoincom' && bitcoincomApi.hasApiKey()))) {
        const apiName = currentApi === 'openrouter' ? 'OpenRouter' : 'Bitcoin.com AI';
        const envVar = currentApi === 'openrouter' ? 'OPENROUTER_API_KEY' : 'BITCOINCOM_API_KEY';
        console.log(chalk.red(`[!] ${apiName} API key required. Set ${envVar} environment variable.`));
        return;
    }

    let result;

    if (apiMode && currentApi !== 'claude') {
        let apiName: string;
        let spinnerText: string;
        
        if (currentApi === 'openrouter') {
            apiName = 'OpenRouter';
            spinnerText = bypassMode ? `Sending original prompt to ${apiName}...` : `Compressing and sending to ${apiName}...`;
        } else if (currentApi === 'bitcoincom') {
            apiName = 'Bitcoin.com AI';
            spinnerText = bypassMode ? `Sending original prompt to ${apiName}...` : `Compressing and sending to ${apiName}...`;
        } else {
            apiName = 'Unknown API';
            spinnerText = 'Processing...';
        }
        
        const spinner = ora(spinnerText).start();

        try {
            let promptToSend = prompt;
            let apiResponse: string;

            // Apply compression
            if (!bypassMode) {
                const ruleBasedResult = PromptCompressor.analyze(prompt);
                promptToSend = ruleBasedResult.compressedPrompt;
            }

            // Use API instances for OpenRouter/Bitcoin.com
            const apiInstance = currentApi === 'openrouter' ? openRouterApi : bitcoincomApi;
            apiResponse = await apiInstance.executePrompt(promptToSend, !bypassMode);

            // Create result object showing what was sent vs original
            const originalTokens = PromptCompressor.getTokenCount(prompt);
            const sentTokens = PromptCompressor.getTokenCount(promptToSend);
            const savedTokens = originalTokens - sentTokens;
            const compressionRatio = savedTokens > 0 ? (savedTokens / originalTokens) * 100 : 0;
            const savedCost = (savedTokens / 1000) * 0.003;

            result = {
                originalPrompt: prompt,
                compressedPrompt: promptToSend,
                originalTokens,
                compressedTokens: sentTokens,
                savedTokens,
                compressionRatio,
                savedCost,
                apiResponse
            };

            const successText = bypassMode ? `Original prompt sent to ${apiName}!` : `Compressed prompt sent to ${apiName}!`;
            spinner.succeed(successText);
        } catch (error: any) {
            spinner.fail('API request failed');
            console.error(chalk.red('[!] API Error:'), error.message);
            return;
        }
    } else {
        // Local compression only
        console.log();
        console.log(chalk.yellow(`[*] Compressing: ${title}`));
        result = PromptCompressor.analyze(prompt);
    }

    showCompressionResult(result);
    totalCompressed++;
    totalSaved += result.savedTokens;
    totalSavedCost += result.savedCost;

    // Show compressed prompt or execute with Claude
    if (currentApi === 'claude' || isClaudeMode) {
        await executeWithClaude(result.compressedPrompt);
    } else if (title.includes('Example') && !apiMode) {
        await executeWithClaude(result.compressedPrompt);
    }
}

async function handleUserChoice(choice: string, rl: readline.Interface) {
    const input = choice.trim().toUpperCase();

    switch (input) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            const exampleIndex = parseInt(input) - 1;
            if (exampleIndex < EXAMPLES.length) {
                const example = EXAMPLES[exampleIndex];
                await processPrompt(example.prompt, example.title);
                
                // Show extra message for code examples
                if (exampleIndex >= 3) {
                    console.log();
                    console.log(chalk.magenta('[!] Note: This example includes code compression!'));
                    console.log(chalk.magenta('    Comments removed, whitespace optimized, structure preserved.'));
                }
            }
            break;

        case '7':
            const customPrompt = await getCustomPrompt(rl);
            if (customPrompt.trim()) {
                await processPrompt(customPrompt, 'Custom Prompt');
            } else {
                console.log(chalk.red('[!] No prompt entered'));
            }
            break;

        case '8':
            showStats();
            break;

        case 'A':
            // Only enable API mode if we have at least one API key configured
            const hasOpenRouterKey = openRouterApi.hasApiKey();
            const hasBitcoinComKey = bitcoincomApi.hasApiKey();
            
            if (!hasOpenRouterKey && !hasBitcoinComKey) {
                console.log(chalk.red('[!] No API keys configured. Set OPENROUTER_API_KEY or BITCOINCOM_API_KEY environment variable.'));
            } else {
                apiMode = !apiMode;
                if (apiMode && !currentApi) {
                    // Set default API if none selected
                    currentApi = hasOpenRouterKey ? 'openrouter' : 'bitcoincom';
                }
                if (!apiMode) bypassMode = false; // Turn off bypass when API mode is off
                console.log(chalk.cyan(`[*] API Mode ${apiMode ? 'enabled' : 'disabled'}`));
                showMenu();
            }
            break;

        case 'B':
            if (!apiMode) {
                console.log(chalk.red('[!] Bypass mode requires API mode to be enabled first'));
            } else {
                bypassMode = !bypassMode;
                console.log(chalk.cyan(`[*] Bypass Mode ${bypassMode ? 'enabled' : 'disabled'}`));
                showMenu();
            }
            break;

        case 'S':
            if (!apiMode) {
                console.log(chalk.red('[!] API switching requires API mode to be enabled first'));
            } else {
                const hasOpenRouterKey = openRouterApi.hasApiKey();
                const hasBitcoinComKey = bitcoincomApi.hasApiKey();
                
                if (currentApi === 'openrouter' && hasBitcoinComKey) {
                    currentApi = 'bitcoincom';
                    console.log(chalk.cyan('[*] Switched to Bitcoin.com AI'));
                } else if (currentApi === 'bitcoincom' && hasOpenRouterKey) {
                    currentApi = 'openrouter';
                    console.log(chalk.cyan('[*] Switched to OpenRouter'));
                } else {
                    console.log(chalk.yellow('[!] No other API services available with configured keys'));
                }
                showMenu();
            }
            break;

        case 'H':
            showHelp();
            break;

        case 'C':
            showWelcome();
            showMenu();
            break;

        case 'Q':
            console.log();
            console.log(chalk.cyan('Thank you for using Prompt Piper!'));
            if (totalCompressed > 0) {
                console.log(chalk.gray(`You saved ${totalSaved} tokens ($${totalSavedCost.toFixed(4)}) this session.`));
            }
            console.log();
            process.exit(0);
            break;

        default:
            console.log(chalk.red('[!] Invalid option. Please choose 1-8, A, B, S, H, C, or Q.'));
    }
}

// Main interactive loop
export async function startInteractive() {
    // Initialize API mode from command line arguments or environment variables
    const interactiveApi = process.env.INTERACTIVE_API;
    const hasOpenRouterArg = args.includes('--openrouter');
    const hasBitcoinComArg = args.includes('--bitcoincom');
    const hasClaudeArg = args.includes('--claude');
    
    if (hasOpenRouterArg || interactiveApi === 'openrouter') {
        apiMode = true;
        currentApi = 'openrouter';
    } else if (hasBitcoinComArg || interactiveApi === 'bitcoincom') {
        apiMode = true;
        currentApi = 'bitcoincom';
    } else if (hasClaudeArg || interactiveApi === 'claude') {
        apiMode = true;
        currentApi = 'claude';
    }
    
    showWelcome();
    showMenu();

    rl.prompt();

    rl.on('line', async (line) => {
        await handleUserChoice(line, rl);
        console.log(); // Add spacing
        rl.prompt();
    });

    rl.on('close', () => {
        console.log();
        console.log(chalk.cyan('Goodbye!'));
        process.exit(0);
    });
}

// Run if called directly
if (require.main === module) {
    startInteractive();
}
