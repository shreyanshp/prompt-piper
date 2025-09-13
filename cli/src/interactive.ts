#!/usr/bin/env node

import * as readline from 'readline';
import chalk from 'chalk';
import { ASCII_ART } from './ascii-art';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('\nprompt-piper> ')
});

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
