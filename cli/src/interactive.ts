#!/usr/bin/env node

import * as readline from 'readline';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { PromptCompressorV2 as PromptCompressor } from './compressor';
import { ASCII_ART } from './ascii-art';
import {
    simpleExamples,
    codeExamples
} from './compression-rules/example-prompts';

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

let totalCompressed = 0;
let totalSaved = 0;
let totalSavedCost = 0;

function showStats() {
    console.log();
    console.log(chalk.bold.blue('>>> STATISTICS'));
    console.log(chalk.gray('═'.repeat(40)));
    console.log();

    // Display stats with ASCII art on the right
    const asciiArt = ['Stats'];


    console.log();
    console.log(chalk.gray('─'.repeat(60)));
}

async function handleUserChoice(choice: string, rl: readline.Interface) {
    const input = choice.trim().toUpperCase();

    switch (input) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '8':
            showStats();
            break;
        case 'C':
            showWelcome();
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
