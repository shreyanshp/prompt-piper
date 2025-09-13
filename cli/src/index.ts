#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync } from 'fs';
import { PromptCompressorV2 as PromptCompressor } from './compressor';
import { ASCII_ART } from './ascii-art';

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
    .version(packageInfo.version);

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
    .action(async (promptArg, options) => {
        try {
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

            const spinner = ora('Compressing prompt...').start();

            // Simulate processing time for UX
            await new Promise(resolve => setTimeout(resolve, 300));

            const result = PromptCompressor.analyze(prompt);
            spinner.succeed('Prompt compressed successfully!');

            // Output based on options
            if (options.quiet) {
                console.log(result.compressedPrompt);
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

program.parse();
