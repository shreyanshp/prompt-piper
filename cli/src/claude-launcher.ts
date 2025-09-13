#!/usr/bin/env node

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Launcher for Claude CLI that avoids TTY/raw mode issues
 * This launcher ensures Claude runs in a non-interactive mode
 */

export async function runClaudeNonInteractive(prompt: string): Promise<{ success: boolean; output: string }> {
    return new Promise(async (resolve) => {
        const tempDir = os.tmpdir();
        const promptFile = path.join(tempDir, `claude-prompt-${Date.now()}.txt`);
        
        try {
            // Write prompt to temp file
            fs.writeFileSync(promptFile, prompt, 'utf8');
            
            // Environment variables to disable interactive features
            const env = {
                ...process.env,
                FORCE_COLOR: '0',
                NO_COLOR: '1',
                TERM: 'dumb',
                CI: 'true',
                // Disable any TTY-related features
                CLAUDE_NO_INTERACTIVE: '1'
            };
            
            // Try different approaches to run Claude
            const approaches = [
                // Approach 1: Direct pipe
                () => new Promise<string>((res, rej) => {
                    const proc = spawn('sh', ['-c', `cat "${promptFile}" | claude`], {
                        env,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    
                    let output = '';
                    let error = '';
                    
                    proc.stdout.on('data', (data) => { output += data.toString(); });
                    proc.stderr.on('data', (data) => { error += data.toString(); });
                    
                    proc.on('close', (code) => {
                        if (code === 0 || output.length > 0) {
                            res(output);
                        } else {
                            rej(new Error(error || `Process exited with code ${code}`));
                        }
                    });
                }),
                
                // Approach 2: Using echo
                () => new Promise<string>((res, rej) => {
                    const escapedPrompt = prompt
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/`/g, '\\`')
                        .replace(/\$/g, '\\$')
                        .replace(/!/g, '\\!');
                    
                    const proc = spawn('sh', ['-c', `echo "${escapedPrompt}" | claude`], {
                        env,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    
                    let output = '';
                    let error = '';
                    
                    proc.stdout.on('data', (data) => { output += data.toString(); });
                    proc.stderr.on('data', (data) => { error += data.toString(); });
                    
                    proc.on('close', (code) => {
                        if (code === 0 || output.length > 0) {
                            res(output);
                        } else {
                            rej(new Error(error || `Process exited with code ${code}`));
                        }
                    });
                }),
                
                // Approach 3: Using printf
                () => new Promise<string>((res, rej) => {
                    const escapedPrompt = prompt
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/`/g, '\\`')
                        .replace(/\$/g, '\\$')
                        .replace(/%/g, '%%');
                    
                    const proc = spawn('sh', ['-c', `printf "%s" "${escapedPrompt}" | claude`], {
                        env,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    
                    let output = '';
                    let error = '';
                    
                    proc.stdout.on('data', (data) => { output += data.toString(); });
                    proc.stderr.on('data', (data) => { error += data.toString(); });
                    
                    proc.on('close', (code) => {
                        if (code === 0 || output.length > 0) {
                            res(output);
                        } else {
                            rej(new Error(error || `Process exited with code ${code}`));
                        }
                    });
                })
            ];
            
            // Try each approach until one works
            for (const approach of approaches) {
                try {
                    const output = await approach();
                    if (output && output.trim().length > 0) {
                        resolve({ success: true, output });
                        return;
                    }
                } catch (error) {
                    // Continue to next approach
                    continue;
                }
            }
            
            // If all approaches fail, return demo response
            resolve({
                success: false,
                output: ''
            });
            
        } finally {
            // Clean up temp file
            try {
                fs.unlinkSync(promptFile);
            } catch {}
        }
    });
}

// Export for use in other modules
export default runClaudeNonInteractive;
