import { RuleSetRegistry } from './ipfs/rule-set-registry';
import { CompressionRuleSet } from './ipfs/ipfs-manager';

export interface CompressionResult {
    originalPrompt: string;
    compressedPrompt: string;
    originalTokens: number;
    compressedTokens: number;
    compressionRatio: number;
    savedTokens: number;
    savedCost: number;
    ruleSetsUsed: string[];
}

export interface CompressionOptions {
    ruleSetIds?: string[];
    language?: string;
    category?: 'general' | 'programming' | 'domain-specific';
    customRules?: Array<{ pattern: RegExp; replacement: string }>;
}

export class PromptCompressorV3 {
    private static readonly TOKEN_COST_PER_1K = 0.003; // Claude-3 pricing
    private static registry: RuleSetRegistry = RuleSetRegistry.getInstance();

    static compress(prompt: string, options: CompressionOptions = {}): string {
        let compressed = prompt;
        const ruleSetsUsed: string[] = [];

        // Step 1: Extract and preserve code blocks
        const codeBlocks: { placeholder: string; content: string }[] = [];
        let codeBlockIndex = 0;

        // Extract triple-backtick code blocks
        compressed = compressed.replace(/```[\s\S]*?```/g, (match) => {
            const placeholder = `__CODE_BLOCK_${codeBlockIndex++}__`;
            codeBlocks.push({ placeholder, content: this.compressCodeBlock(match, options) });
            return placeholder;
        });

        // Extract inline code
        compressed = compressed.replace(/`[^`]+`/g, (match) => {
            const placeholder = `__INLINE_CODE_${codeBlockIndex++}__`;
            codeBlocks.push({ placeholder, content: match });
            return placeholder;
        });

        // Step 2: Determine which rule sets to use
        const activeRuleSets = this.getActiveRuleSets(options);
        ruleSetsUsed.push(...activeRuleSets.map(rs => rs.id));

        // Step 3: Apply rules from selected rule sets
        const allRules = this.compileRules(activeRuleSets, options);
        compressed = this.applyRules(compressed, allRules);

        // Step 4: Normalize whitespace
        compressed = compressed.replace(/[ \t]+/g, ' ');
        compressed = compressed.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines
        compressed = compressed.trim();

        // Step 5: Restore code blocks
        codeBlocks.forEach(({ placeholder, content }) => {
            compressed = compressed.replace(placeholder, content);
        });

        return compressed;
    }

    private static getActiveRuleSets(options: CompressionOptions): CompressionRuleSet[] {
        const ruleSets: CompressionRuleSet[] = [];

        // If specific rule set IDs are provided, use those
        if (options.ruleSetIds && options.ruleSetIds.length > 0) {
            for (const id of options.ruleSetIds) {
                const ruleSet = this.registry.getRuleSet(id);
                if (ruleSet) {
                    ruleSets.push(ruleSet);
                }
            }
        } else {
            // Otherwise, use built-in rules and filter by category/language
            const allRuleSets = this.registry.getAllRuleSets();

            for (const ruleSet of allRuleSets) {
                let shouldInclude = false;

                // Filter by category
                if (options.category && ruleSet.category === options.category) {
                    shouldInclude = true;
                }

                // Filter by language
                if (options.language && ruleSet.language?.toLowerCase() === options.language.toLowerCase()) {
                    shouldInclude = true;
                }

                // Include built-in rules by default
                if (ruleSet.tags.includes('builtin')) {
                    shouldInclude = true;
                }

                if (shouldInclude) {
                    ruleSets.push(ruleSet);
                }
            }
        }

        return ruleSets;
    }

    private static compileRules(ruleSets: CompressionRuleSet[], options: CompressionOptions): Array<{ pattern: RegExp; replacement: string }> {
        const allRules: Array<{ pattern: RegExp; replacement: string }> = [];

        // Add custom rules first (highest priority)
        if (options.customRules) {
            allRules.push(...options.customRules);
        }

        // Compile rules from rule sets
        for (const ruleSet of ruleSets) {
            const compiledRules = this.registry.convertToCompressorFormat(ruleSet);

            // Add rules in order of priority
            if (compiledRules.redundantPhrases) allRules.push(...compiledRules.redundantPhrases);
            if (compiledRules.commonPhrases) allRules.push(...compiledRules.commonPhrases);
            if (compiledRules.fillerWords) allRules.push(...compiledRules.fillerWords);
            if (compiledRules.instructions) allRules.push(...compiledRules.instructions);
            if (compiledRules.conjunctions) allRules.push(...compiledRules.conjunctions);
            if (compiledRules.codingPhrases) allRules.push(...compiledRules.codingPhrases);
        }

        return allRules;
    }

    private static applyRules(text: string, rules: Array<{ pattern: RegExp; replacement: string }>): string {
        let result = text;
        rules.forEach(rule => {
            result = result.replace(rule.pattern, rule.replacement);
        });
        return result;
    }

    private static compressCodeBlock(codeBlock: string, options: CompressionOptions): string {
        const match = codeBlock.match(/```(\w+)?\s*([\s\S]*?)```/);
        if (!match) return codeBlock;

        const [, language, code] = match;
        let compressedCode = code;

        // Apply code compression rules from active rule sets
        const activeRuleSets = this.getActiveRuleSets(options);
        for (const ruleSet of activeRuleSets) {
            if (ruleSet.rules.codeBlockCompression?.removeComments) {
                ruleSet.rules.codeBlockCompression.removeComments.forEach(rule => {
                    if (this.shouldApplyCommentRule(language, rule.type)) {
                        const regex = new RegExp(rule.pattern, 'g');
                        compressedCode = compressedCode.replace(regex, '');
                    }
                });
            }
        }

        // Minify based on language
        compressedCode = this.minifyCode(compressedCode, language);

        compressedCode = compressedCode.trim();

        return language ? `\`\`\`${language}\n${compressedCode}\n\`\`\`` : `\`\`\`\n${compressedCode}\n\`\`\``;
    }

    private static shouldApplyCommentRule(language: string | undefined, ruleType: string): boolean {
        if (!language) return true;

        const ruleMap: Record<string, string[]> = {
            'single-line-js': ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx', 'java', 'c', 'cpp'],
            'multi-line-js': ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx', 'java', 'c', 'cpp', 'css'],
            'python-shell': ['python', 'py', 'bash', 'sh', 'yaml', 'yml'],
            'html': ['html', 'xml'],
        };

        return ruleMap[ruleType]?.includes(language.toLowerCase()) || false;
    }

    private static minifyCode(code: string, language?: string): string {
        const lang = language?.toLowerCase() || '';
        const isPython = ['python', 'py', 'python3'].includes(lang);
        const isYaml = ['yaml', 'yml'].includes(lang);
        const isCss = ['css', 'scss', 'sass', 'less'].includes(lang);
        const isSolidity = ['solidity', 'sol'].includes(lang);
        const isGo = ['go', 'golang'].includes(lang);
        const isRust = ['rust'].includes(lang);

        // For Python and YAML, preserve structure (indentation matters)
        if (isPython || isYaml) {
            const lines = code.split('\n').filter(line => line.trim() !== '');
            return lines.map(line => {
                const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
                const content = line.trim();
                const indentLevel = Math.floor(leadingSpaces.length / 4);
                return ' '.repeat(indentLevel) + content;
            }).join('\n');
        }

        // Special handling for CSS - very aggressive minification
        if (isCss) {
            return this.minifyCSS(code);
        }

        // Special handling for Solidity - aggressive but preserve some structure
        if (isSolidity) {
            return this.minifySolidity(code);
        }

        // Special handling for Go - preserve some structure
        if (isGo) {
            return this.minifyGo(code);
        }

        // Special handling for Rust - preserve some structure
        if (isRust) {
            return this.minifyRust(code);
        }

        // For other languages, aggressive minification
        let minified = code;

        // Preserve strings while minifying
        const stringPlaceholders: string[] = [];
        let stringIndex = 0;

        // Replace strings with placeholders
        minified = minified.replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
            const placeholder = `__STR_${stringIndex++}__`;
            stringPlaceholders.push(match);
            return placeholder;
        });

        // Remove all newlines and excessive spaces
        minified = minified.replace(/\s*\n\s*/g, ' ');
        minified = minified.replace(/\s+/g, ' ');

        // Remove spaces around operators (safe for most languages)
        minified = minified.replace(/\s*([=+\-*/<>!&|,;:{}()\[\]])\s*/g, '$1');

        // Restore some necessary spaces
        minified = minified.replace(/(\w)(if|else|for|while|function|class|def|return|import|from|export|const|let|var)(\w)/g, '$1 $2 $3');
        minified = minified.replace(/(if|else|for|while|function|class|def|return|import|from|export|const|let|var)(\w)/g, '$1 $2');
        minified = minified.replace(/(\w)(if|else|for|while|function|class|def|return|import|from|export|const|let|var)/g, '$1 $2');

        // Restore strings
        stringPlaceholders.forEach((str, idx) => {
            minified = minified.replace(`__STR_${idx}__`, str);
        });

        return minified.trim();
    }

    private static minifyCSS(css: string): string {
        let minified = css;

        // Preserve strings and URLs
        const strings: string[] = [];
        let stringIndex = 0;
        minified = minified.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
            const placeholder = `__CSS_STR_${stringIndex++}__`;
            strings.push(match);
            return placeholder;
        });

        // Remove all comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

        // Remove all newlines and excessive whitespace
        minified = minified.replace(/\s+/g, ' ');

        // Remove spaces around CSS-specific characters
        minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1');

        // Remove trailing semicolons before }
        minified = minified.replace(/;}/g, '}');

        // Remove spaces around parentheses and brackets
        minified = minified.replace(/\s*([()[\]])\s*/g, '$1');

        // Restore strings
        strings.forEach((str, idx) => {
            minified = minified.replace(`__CSS_STR_${idx}__`, str);
        });

        return minified.trim();
    }

    private static minifySolidity(sol: string): string {
        let minified = sol;

        // Preserve strings
        const strings: string[] = [];
        let stringIndex = 0;
        minified = minified.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
            const placeholder = `__SOL_STR_${stringIndex++}__`;
            strings.push(match);
            return placeholder;
        });

        // Remove single-line comments but preserve SPDX and pragma
        minified = minified.replace(/\/\/(?!.*SPDX|.*pragma).*$/gm, '');

        // Remove multi-line comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

        // Compress whitespace but preserve some structure for readability
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/\s*([{}();,=<>!&|+\-*/])\s*/g, '$1');

        // Keep minimal spacing around keywords for readability
        minified = minified.replace(/(contract|function|modifier|event|struct|mapping|pragma|import)([a-zA-Z])/g, '$1 $2');
        minified = minified.replace(/([a-zA-Z])(contract|function|modifier|event|struct|mapping|pragma|import)/g, '$1 $2');

        // Restore strings
        strings.forEach((str, idx) => {
            minified = minified.replace(`__SOL_STR_${idx}__`, str);
        });

        return minified.trim();
    }

    private static minifyGo(go: string): string {
        let minified = go;

        // Preserve strings
        const strings: string[] = [];
        let stringIndex = 0;
        minified = minified.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
            const placeholder = `__GO_STR_${stringIndex++}__`;
            strings.push(match);
            return placeholder;
        });

        // Remove single-line comments
        minified = minified.replace(/\/\/.*$/gm, '');

        // Remove multi-line comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

        // Compress whitespace but preserve some structure
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/\s*([{}();,=<>!&|+\-*/])\s*/g, '$1');

        // Keep minimal spacing around Go keywords
        minified = minified.replace(/(package|import|func|type|var|const|if|else|for|range|go|chan|select|defer|return)([a-zA-Z])/g, '$1 $2');
        minified = minified.replace(/([a-zA-Z])(package|import|func|type|var|const|if|else|for|range|go|chan|select|defer|return)/g, '$1 $2');

        // Restore strings
        strings.forEach((str, idx) => {
            minified = minified.replace(`__GO_STR_${idx}__`, str);
        });

        return minified.trim();
    }

    private static minifyRust(rust: string): string {
        let minified = rust;

        // Preserve strings
        const strings: string[] = [];
        let stringIndex = 0;
        minified = minified.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
            const placeholder = `__RUST_STR_${stringIndex++}__`;
            strings.push(match);
            return placeholder;
        });

        // Remove single-line comments
        minified = minified.replace(/\/\/.*$/gm, '');

        // Remove multi-line comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

        // Compress whitespace but preserve some structure
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/\s*([{}();,=<>!&|+\-*/])\s*/g, '$1');

        // Keep minimal spacing around Rust keywords
        minified = minified.replace(/(fn|struct|enum|trait|impl|mod|use|pub|let|mut|const|static|if|else|for|while|loop|match|return)([a-zA-Z])/g, '$1 $2');
        minified = minified.replace(/([a-zA-Z])(fn|struct|enum|trait|impl|mod|use|pub|let|mut|const|static|if|else|for|while|loop|match|return)/g, '$1 $2');

        // Restore strings
        strings.forEach((str, idx) => {
            minified = minified.replace(`__RUST_STR_${idx}__`, str);
        });

        return minified.trim();
    }

    static getTokenCount(text: string): number {
        // More accurate token estimation
        // Average English: ~4 chars/token
        // Code: ~3 chars/token (more symbols)
        const codeBlockCount = (text.match(/```[\s\S]*?```/g) || []).length;
        const hasCode = codeBlockCount > 0 || text.includes('function') || text.includes('class') || text.includes('import');

        const charsPerToken = hasCode ? 3.5 : 4;
        return Math.ceil(text.length / charsPerToken);
    }

    static analyze(originalPrompt: string, options: CompressionOptions = {}): CompressionResult {
        const compressedPrompt = this.compress(originalPrompt, options);
        const originalTokens = this.getTokenCount(originalPrompt);
        const compressedTokens = this.getTokenCount(compressedPrompt);
        const savedTokens = originalTokens - compressedTokens;
        const compressionRatio = savedTokens > 0 ? ((savedTokens / originalTokens) * 100) : 0;
        const savedCost = (savedTokens / 100) * this.TOKEN_COST_PER_1K;

        // Get rule sets used
        const activeRuleSets = this.getActiveRuleSets(options);
        const ruleSetsUsed = activeRuleSets.map(rs => rs.id);

        return {
            originalPrompt,
            compressedPrompt,
            originalTokens,
            compressedTokens,
            compressionRatio,
            savedTokens,
            savedCost,
            ruleSetsUsed
        };
    }

    // Utility methods for rule set management
    static getRegistry(): RuleSetRegistry {
        return this.registry;
    }

    static getAvailableRuleSets(): CompressionRuleSet[] {
        return this.registry.getAllRuleSets();
    }

    static getRuleSetsByCategory(category: 'general' | 'programming' | 'domain-specific'): CompressionRuleSet[] {
        return this.registry.getRuleSetsByCategory(category);
    }

    static getRuleSetsByLanguage(language: string): CompressionRuleSet[] {
        return this.registry.getRuleSetsByLanguage(language);
    }
}
