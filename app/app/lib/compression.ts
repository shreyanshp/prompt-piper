import { Tiktoken } from "js-tiktoken/lite";
import { o200k_base } from "./tiktoken-utils";

export class PromptCompressor {
    private static tokenizer: Tiktoken = new Tiktoken(o200k_base);

    // Compression rules
    private static readonly GENERAL_RULES = [
        // Redundant phrases
        { pattern: /\b(please|kindly)\s+(help\s+me\s+to|assist\s+me\s+(with|in))/gi, replacement: '' },
        { pattern: /\bi\s+would\s+(really\s+)?(appreciate\s+it\s+if\s+you\s+could|like\s+it\s+if\s+you\s+could|be\s+grateful\s+if\s+you\s+could)/gi, replacement: '' },
        { pattern: /\b(please\s+)?(make\s+sure\s+(to\s+)?|ensure\s+that\s+you\s+)/gi, replacement: '' },
        { pattern: /\bit\s+is\s+(very\s+)?(important\s+that|crucial\s+that|essential\s+that)/gi, replacement: '' },

        // Filler words and phrases
        { pattern: /\b(basically|essentially|fundamentally|generally|typically|usually|normally|certainly|definitely|absolutely|obviously|clearly|simply|just)\s+/gi, replacement: '' },
        { pattern: /\b(in\s+order\s+to|so\s+as\s+to)\b/gi, replacement: 'to' },
        { pattern: /\b(due\s+to\s+the\s+fact\s+that|owing\s+to\s+the\s+fact\s+that)\b/gi, replacement: 'because' },
        { pattern: /\b(in\s+the\s+event\s+that)\b/gi, replacement: 'if' },
        { pattern: /\b(at\s+this\s+point\s+in\s+time)\b/gi, replacement: 'now' },

        // Redundant adjectives and adverbs
        { pattern: /\b(comprehensive\s+and\s+detailed|detailed\s+and\s+comprehensive)\b/gi, replacement: 'detailed' },
        { pattern: /\b(various\s+different|different\s+various)\b/gi, replacement: 'various' },
        { pattern: /\b(important\s+and\s+significant|significant\s+and\s+important)\b/gi, replacement: 'important' },

        // Common instruction phrases
        { pattern: /\b(could\s+you\s+please|would\s+you\s+please|can\s+you\s+please)\b/gi, replacement: '' },
        { pattern: /\b(i\s+need\s+you\s+to|i\s+want\s+you\s+to|i\s+would\s+like\s+you\s+to)\b/gi, replacement: '' },
        { pattern: /\bincluding\s+but\s+not\s+limited\s+to\b/gi, replacement: 'including' },

        // Conjunction simplification
        { pattern: /\b(and\s+also|as\s+well\s+as|in\s+addition\s+to)\b/gi, replacement: 'and' },

        // Multiple spaces and line breaks
        { pattern: /\s{2,}/g, replacement: ' ' },
        { pattern: /\n{3,}/g, replacement: '\n\n' }
    ];

    private static readonly CODE_RULES = [
        // Remove single-line comments
        { pattern: /\/\/.*$/gm, replacement: '' },
        { pattern: /#.*$/gm, replacement: '' },
        
        // Remove multi-line comments but preserve code structure
        { pattern: /\/\*[\s\S]*?\*\//g, replacement: '' },
        
        // Remove empty lines in code blocks
        { pattern: /\n\s*\n/g, replacement: '\n' }
    ];

    static getTokenCount(text: string): number {
        return this.tokenizer.encode(text).length;
    }

    async compress(prompt: string): Promise<string> {
        let compressed = prompt;

        // Apply general compression rules
        for (const rule of PromptCompressor.GENERAL_RULES) {
            compressed = compressed.replace(rule.pattern, rule.replacement);
        }

        // Handle code blocks separately
        compressed = this.compressCodeBlocks(compressed);

        // Final cleanup
        compressed = compressed
            .replace(/\s{2,}/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return compressed;
    }

    private compressCodeBlocks(text: string): string {
        // Find code blocks (marked with triple backticks)
        const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
        
        return text.replace(codeBlockPattern, (match, language, code) => {
            let compressedCode = code;
            
            // Apply code-specific compression rules
            for (const rule of PromptCompressor.CODE_RULES) {
                compressedCode = compressedCode.replace(rule.pattern, rule.replacement);
            }

            // Language-specific compression
            if (language) {
                compressedCode = this.compressLanguageSpecific(compressedCode, language.toLowerCase());
            }

            // Clean up extra whitespace while preserving structure
            compressedCode = compressedCode
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => line.length > 0)
                .join('\n');

            return language ? `\`\`\`${language}\n${compressedCode}\`\`\`` : `\`\`\`\n${compressedCode}\`\`\``;
        });
    }

    private compressLanguageSpecific(code: string, language: string): string {
        switch (language) {
            case 'python':
                return code
                    .replace(/"""[\s\S]*?"""/g, '') // Remove docstrings
                    .replace(/'''[\s\S]*?'''/g, '') // Remove docstrings
                    .replace(/^\s*#.*$/gm, ''); // Remove comments

            case 'javascript':
            case 'typescript':
            case 'js':
            case 'ts':
                return code
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
                    .replace(/\/\/.*$/gm, ''); // Remove line comments

            case 'css':
                return code
                    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                    .replace(/\s*{\s*/g, '{')
                    .replace(/;\s*/g, ';')
                    .replace(/:\s*/g, ':');

            case 'go':
                return code
                    .replace(/\/\/.*$/gm, '') // Remove line comments
                    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments

            case 'rust':
                return code
                    .replace(/\/\/.*$/gm, '') // Remove line comments
                    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments

            case 'solidity':
                return code
                    .replace(/\/\/.*$/gm, '') // Remove line comments
                    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments

            default:
                return code;
        }
    }

    // Get compression statistics
    getCompressionStats(original: string, compressed: string) {
        const originalTokens = PromptCompressor.getTokenCount(original);
        const compressedTokens = PromptCompressor.getTokenCount(compressed);
        const savedTokens = originalTokens - compressedTokens;
        const compressionRatio = (savedTokens / originalTokens) * 100;

        return {
            originalTokens,
            compressedTokens,
            savedTokens,
            compressionRatio
        };
    }
}