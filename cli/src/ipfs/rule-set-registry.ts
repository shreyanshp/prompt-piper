import { CompressionRuleSet } from './ipfs-manager';
import { generalRules } from '../compression-rules/general-rules';
import { codeRules } from '../compression-rules/code-rules';

export class RuleSetRegistry {
    private static instance: RuleSetRegistry;
    private ruleSets: Map<string, CompressionRuleSet> = new Map();
    private ipfsAddresses: Map<string, string> = new Map(); // Track IPFS addresses for rule sets

    private constructor() {
        this.loadBuiltInRuleSets();
    }

    static getInstance(): RuleSetRegistry {
        if (!RuleSetRegistry.instance) {
            RuleSetRegistry.instance = new RuleSetRegistry();
        }
        return RuleSetRegistry.instance;
    }

    private loadBuiltInRuleSets(): void {
        // Convert built-in general rules to IPFS format
        const generalRuleSet: CompressionRuleSet = {
            id: 'builtin-general-v1',
            name: 'General Text Compression Rules',
            description: 'Built-in rules for general text compression, removing redundant phrases and filler words',
            version: '1.0.0',
            author: 'Prompt Piper Team',
            createdAt: '2025-09-13T00:00:00.000Z',
            updatedAt: '2024-09-13T00:00:00.000Z',
            tags: ['builtin', 'general', 'text-compression'],
            category: 'general',
            rules: {
                redundantPhrases: this.convertRules(generalRules.redundantPhrases),
                commonPhrases: this.convertRules(generalRules.commonPhrases),
                fillerWords: this.convertRules(generalRules.fillerWords),
                instructions: this.convertRules(generalRules.instructions),
                conjunctions: this.convertRules(generalRules.conjunctions),
                customRules: this.convertRules(generalRules.whitespace)
            },
            metadata: {
                ipfsAddress: 'ipfs://Qmf3uX8Wy9cGDBiTka2a4mXDgWqdNuTSCv6zYf1Zi2jqzF/builtin-general-v1.json'
            }
        };

        // Convert built-in code rules to IPFS format
        const codeRuleSet: CompressionRuleSet = {
            id: 'builtin-code-v1',
            name: 'Programming Code Compression Rules',
            description: 'Built-in rules for compressing code blocks and programming-related text',
            version: '1.0.0',
            author: 'Prompt Piper Team',
            createdAt: '2025-09-13T00:00:00.000Z',
            updatedAt: '2025-09-13T00:00:00.000Z',
            tags: ['builtin', 'programming', 'code-compression'],
            category: 'programming',
            rules: {
                codingPhrases: this.convertRules(codeRules.codingPhrases),
                codeBlockCompression: {
                    removeComments: codeRules.codeBlockCompression.removeComments.map(rule => ({
                        pattern: rule.pattern.source,
                        type: rule.type
                    })),
                    whitespace: this.convertRules(codeRules.codeBlockCompression.whitespace),
                    languages: codeRules.codeBlockCompression.languages
                }
            },
            metadata: {
                ipfsAddress: 'ipfs://QmVZ8vJfmUeKp2dHjUWDyDspCBgT3Rw74LYw5Kkj77VKd4/builtin-code-v1.json'
            }
        };

        this.ruleSets.set('builtin-general', generalRuleSet);
        this.ruleSets.set('builtin-code', codeRuleSet);
    }

    private convertRules(rules: Array<{ pattern: RegExp; replacement: string }>): Array<{ pattern: string; replacement: string }> {
        return rules.map(rule => ({
            pattern: rule.pattern.source,
            replacement: rule.replacement
        }));
    }

    registerRuleSet(ruleSet: CompressionRuleSet): void {
        this.ruleSets.set(ruleSet.id, ruleSet);
    }

    getRuleSet(id: string): CompressionRuleSet | undefined {
        return this.ruleSets.get(id);
    }

    getAllRuleSets(): CompressionRuleSet[] {
        return Array.from(this.ruleSets.values());
    }

    getRuleSetsByCategory(category: 'general' | 'programming' | 'domain-specific'): CompressionRuleSet[] {
        return this.getAllRuleSets().filter(ruleSet => ruleSet.category === category);
    }

    getRuleSetsByLanguage(language: string): CompressionRuleSet[] {
        return this.getAllRuleSets().filter(ruleSet =>
            ruleSet.language?.toLowerCase() === language.toLowerCase()
        );
    }

    searchRuleSets(query: string): CompressionRuleSet[] {
        const lowerQuery = query.toLowerCase();
        return this.getAllRuleSets().filter(ruleSet =>
            ruleSet.name.toLowerCase().includes(lowerQuery) ||
            ruleSet.description.toLowerCase().includes(lowerQuery) ||
            ruleSet.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            ruleSet.author.toLowerCase().includes(lowerQuery)
        );
    }

    // IPFS address management
    setIPFSAddress(ruleSetId: string, ipfsAddress: string): void {
        this.ipfsAddresses.set(ruleSetId, ipfsAddress);
    }

    getIPFSAddress(ruleSetId: string): string | undefined {
        // First check the tracked addresses
        const trackedAddress = this.ipfsAddresses.get(ruleSetId);
        if (trackedAddress) {
            return trackedAddress;
        }

        // Then check the rule set metadata
        const ruleSet = this.ruleSets.get(ruleSetId);
        return ruleSet?.metadata?.ipfsAddress;
    }

    hasIPFSAddress(ruleSetId: string): boolean {
        return this.ipfsAddresses.has(ruleSetId);
    }

    removeIPFSAddress(ruleSetId: string): void {
        this.ipfsAddresses.delete(ruleSetId);
    }

    // Convert IPFS rule set back to the format expected by the compressor
    convertToCompressorFormat(ruleSet: CompressionRuleSet): {
        redundantPhrases: Array<{ pattern: RegExp; replacement: string }>;
        commonPhrases: Array<{ pattern: RegExp; replacement: string }>;
        fillerWords: Array<{ pattern: RegExp; replacement: string }>;
        instructions: Array<{ pattern: RegExp; replacement: string }>;
        conjunctions: Array<{ pattern: RegExp; replacement: string }>;
        codingPhrases: Array<{ pattern: RegExp; replacement: string }>;
    } {
        const convertRuleArray = (rules?: Array<{ pattern: string; replacement: string }>) => {
            if (!rules) return [];
            return rules.map(rule => ({
                pattern: new RegExp(rule.pattern, 'gi'),
                replacement: rule.replacement
            }));
        };

        return {
            redundantPhrases: convertRuleArray(ruleSet.rules.redundantPhrases),
            commonPhrases: convertRuleArray(ruleSet.rules.commonPhrases),
            fillerWords: convertRuleArray(ruleSet.rules.fillerWords),
            instructions: convertRuleArray(ruleSet.rules.instructions),
            conjunctions: convertRuleArray(ruleSet.rules.conjunctions),
            codingPhrases: convertRuleArray(ruleSet.rules.codingPhrases)
        };
    }

    // Merge multiple rule sets into one
    mergeRuleSets(ruleSetIds: string[]): CompressionRuleSet {
        const ruleSets = ruleSetIds.map(id => this.getRuleSet(id)).filter(Boolean) as CompressionRuleSet[];

        if (ruleSets.length === 0) {
            throw new Error('No valid rule sets found');
        }

        const merged: CompressionRuleSet = {
            id: `merged-${Date.now()}`,
            name: `Merged Rule Set (${ruleSets.length} sets)`,
            description: `Merged rule set containing rules from: ${ruleSets.map(rs => rs.name).join(', ')}`,
            version: '1.0.0',
            author: 'Prompt Piper Registry',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['merged', ...new Set(ruleSets.flatMap(rs => rs.tags))],
            category: ruleSets[0].category, // Use first rule set's category
            rules: {
                redundantPhrases: [],
                commonPhrases: [],
                fillerWords: [],
                instructions: [],
                conjunctions: [],
                codingPhrases: [],
                customRules: []
            }
        };

        // Merge all rules
        ruleSets.forEach(ruleSet => {
            if (ruleSet.rules.redundantPhrases) {
                merged.rules.redundantPhrases!.push(...ruleSet.rules.redundantPhrases);
            }
            if (ruleSet.rules.commonPhrases) {
                merged.rules.commonPhrases!.push(...ruleSet.rules.commonPhrases);
            }
            if (ruleSet.rules.fillerWords) {
                merged.rules.fillerWords!.push(...ruleSet.rules.fillerWords);
            }
            if (ruleSet.rules.instructions) {
                merged.rules.instructions!.push(...ruleSet.rules.instructions);
            }
            if (ruleSet.rules.conjunctions) {
                merged.rules.conjunctions!.push(...ruleSet.rules.conjunctions);
            }
            if (ruleSet.rules.codingPhrases) {
                merged.rules.codingPhrases!.push(...ruleSet.rules.codingPhrases);
            }
            if (ruleSet.rules.customRules) {
                merged.rules.customRules!.push(...ruleSet.rules.customRules);
            }
        });

        // Remove duplicates based on pattern
        const deduplicate = (rules: Array<{ pattern: string; replacement: string }>) => {
            const seen = new Set<string>();
            return rules.filter(rule => {
                if (seen.has(rule.pattern)) {
                    return false;
                }
                seen.add(rule.pattern);
                return true;
            });
        };

        if (merged.rules.redundantPhrases) {
            merged.rules.redundantPhrases = deduplicate(merged.rules.redundantPhrases);
        }
        if (merged.rules.commonPhrases) {
            merged.rules.commonPhrases = deduplicate(merged.rules.commonPhrases);
        }
        if (merged.rules.fillerWords) {
            merged.rules.fillerWords = deduplicate(merged.rules.fillerWords);
        }
        if (merged.rules.instructions) {
            merged.rules.instructions = deduplicate(merged.rules.instructions);
        }
        if (merged.rules.conjunctions) {
            merged.rules.conjunctions = deduplicate(merged.rules.conjunctions);
        }
        if (merged.rules.codingPhrases) {
            merged.rules.codingPhrases = deduplicate(merged.rules.codingPhrases);
        }
        if (merged.rules.customRules) {
            merged.rules.customRules = deduplicate(merged.rules.customRules);
        }

        return merged;
    }
}
