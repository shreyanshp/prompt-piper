#!/usr/bin/env node

import * as readline from 'readline';
import chalk from 'chalk';
import { PromptCompressorV3 as PromptCompressor } from './compressor';
import { ASCII_ART } from './ascii-art';
import { simpleExamples, codeExamples } from './compression-rules/example-prompts';
import { execSync } from 'child_process';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('\nprompt-piper> ')
});

const EXAMPLES = [
    ...simpleExamples,
    ...codeExamples
];

// Parse command line arguments
const args = process.argv.slice(2);
const isDryMode = args.includes('--dry');
const isClaudeMode = args.includes('--claude');

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
    if (isDryMode) {
        console.log(chalk.yellow('Running in DRY MODE - compression only, no execution'));
    } else if (isClaudeMode) {
        console.log(chalk.green('Running in CLAUDE MODE - prompts will be executed with real Claude CLI'));
    } else {
        console.log(chalk.blue('Running in DEMO MODE - prompts will use local AI responses'));
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
    console.log(chalk.white('H)'), chalk.gray('Help'));
    console.log(chalk.white('C)'), chalk.gray('Clear Screen'));
    console.log(chalk.white('Q)'), chalk.gray('Quit'));
    console.log();
    console.log(chalk.gray('─'.repeat(60)));
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
        console.log(chalk.gray('Compressed prompt:', compressedPrompt));
        console.log();

        let realClaudeWorked = false;

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
            realClaudeWorked = true;

        } catch (error: any) {
            console.log();
            console.log(chalk.yellow('Claude session failed, falling back to demo mode...'));
        }

        if (realClaudeWorked) {
            console.log();
            console.log(chalk.cyan('─'.repeat(60)));
            return;
        }
    } else {
        console.log(chalk.yellow('[>] Executing with local AI...'));
        console.log(chalk.gray('Compressed prompt:', compressedPrompt));
        console.log();
        console.log(chalk.cyan('[Local AI Response]:'));
        console.log();
    }

    // Generate and stream local AI response
    if (!isClaudeMode) {
        console.log();
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for effect

        const response = LocalAIResponder.generateResponse(compressedPrompt);
        await LocalAIResponder.streamResponse(response);
        
        console.log();
        console.log(chalk.green('✓ Local AI response completed'));
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
    console.log(chalk.gray('• Track your savings with option 5'));
    console.log(chalk.gray('• For custom prompts: type your text, then press Enter'));
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
                console.log();
                console.log(chalk.yellow(`[*] Compressing: ${example.title}`));
                const result = PromptCompressor.analyze(example.prompt);
                showCompressionResult(result);
                totalCompressed++;
                totalSaved += result.savedTokens;
                totalSavedCost += result.savedCost;

                // Show extra message for code examples
                if (exampleIndex >= 3) {
                    console.log();
                    console.log(chalk.magenta('[!] Note: This example includes code compression!'));
                    console.log(chalk.magenta('    Comments removed, whitespace optimized, structure preserved.'));
                }

                // Execute with Claude only if not in dry mode
                if (!isDryMode) {
                    await executeWithClaude(result.compressedPrompt);
                }
            }
            break;

        case '7':
            const customPrompt = await getCustomPrompt(rl);
            if (customPrompt.trim()) {
                const customResult = PromptCompressor.analyze(customPrompt);
                showCompressionResult(customResult);
                totalCompressed++;
                totalSaved += customResult.savedTokens;
                totalSavedCost += customResult.savedCost;

                // Execute with Claude only if not in dry mode
                if (!isDryMode) {
                    await executeWithClaude(customResult.compressedPrompt);
                }
            } else {
                console.log(chalk.red('[!] No prompt entered'));
            }
            break;

        case '8':
            showStats();
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
            console.log(chalk.red('[!] Invalid option. Please choose 1-8, H, C, or Q.'));
    }
}

// Main interactive loop
export async function startInteractive() {
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
