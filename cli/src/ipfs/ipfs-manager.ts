import { createThirdwebClient } from 'thirdweb';
import { upload, download } from 'thirdweb/storage';
import chalk from 'chalk';

export interface CompressionRuleSet {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    category: 'general' | 'programming' | 'domain-specific';
    language?: string; // For programming language specific rules
    rules: {
        redundantPhrases?: Array<{ pattern: string; replacement: string }>;
        commonPhrases?: Array<{ pattern: string; replacement: string }>;
        fillerWords?: Array<{ pattern: string; replacement: string }>;
        instructions?: Array<{ pattern: string; replacement: string }>;
        conjunctions?: Array<{ pattern: string; replacement: string }>;
        codingPhrases?: Array<{ pattern: string; replacement: string }>;
        codeBlockCompression?: {
            removeComments?: Array<{ pattern: string; type: string }>;
            whitespace?: Array<{ pattern: string; replacement: string }>;
            languages?: Record<string, any>;
        };
        customRules?: Array<{ pattern: string; replacement: string; description?: string }>;
    };
    metadata?: {
        compressionRatio?: number;
        testCases?: Array<{ input: string; expected: string }>;
        usage?: number;
        rating?: number;
        ipfsAddress?: string;
    };
}

export interface ThirdwebConfig {
    clientId: string;
}

export class IPFSManager {
    private client: any = null;
    private config: ThirdwebConfig;

    constructor(config: ThirdwebConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
        try {
            this.client = createThirdwebClient({
                clientId: this.config.clientId,
            });
            console.log(chalk.green(`✓ Connected to thirdweb Storage API`));
        } catch (error) {
            console.log(chalk.yellow('⚠ thirdweb client not available, using fallback mode'));
            console.log(chalk.gray('  Please provide a valid CLIENT_ID'));
            this.client = null;
        }
    }

    async storeRuleSet(ruleSet: CompressionRuleSet): Promise<string> {
        if (!this.client) {
            throw new Error('thirdweb client not connected. Please provide a valid CLIENT_ID.');
        }

        try {
            const ipfsUri = await upload({
                client: this.client,
                files: [
                    {
                        name: `${ruleSet.id}.json`,
                        data: JSON.stringify(ruleSet, null, 2),
                    },
                ],
            });
            console.log(chalk.green(`✓ Rule set stored to IPFS: ${ipfsUri}`));
            console.log(chalk.gray(`  Name: ${ruleSet.name}`));
            console.log(chalk.gray(`  Category: ${ruleSet.category}`));
            console.log(chalk.gray(`  Rules: ${this.countRules(ruleSet)}`));

            return ipfsUri;
        } catch (error) {
            throw new Error(`Failed to store rule set to IPFS: ${error}`);
        }
    }

    async loadRuleSet(ipfsUri: string): Promise<CompressionRuleSet> {
        if (!this.client) {
            throw new Error('thirdweb client not connected. Please provide a valid CLIENT_ID.');
        }

        try {
            const response = await download({
                client: this.client,
                uri: ipfsUri,
            });

            const text = await response.text();
            const ruleSet = JSON.parse(text) as CompressionRuleSet;

            // Validate rule set structure
            this.validateRuleSet(ruleSet);

            console.log(chalk.green(`✓ Rule set loaded from IPFS: ${ipfsUri}`));
            console.log(chalk.gray(`  Name: ${ruleSet.name}`));
            console.log(chalk.gray(`  Author: ${ruleSet.author}`));
            console.log(chalk.gray(`  Version: ${ruleSet.version}`));

            return ruleSet;
        } catch (error) {
            throw new Error(`Failed to load rule set from IPFS: ${error}`);
        }
    }

    async pinRuleSet(ipfsUri: string): Promise<void> {
        // thirdweb automatically pins uploaded content, so this is a no-op
        console.log(chalk.green(`✓ Rule set automatically pinned by thirdweb: ${ipfsUri}`));
    }

    async unpinRuleSet(ipfsUri: string): Promise<void> {
        // thirdweb manages pinning automatically, so this is a no-op
        console.log(chalk.yellow(`⚠ Unpinning not supported with thirdweb (content remains accessible)`));
    }

    async listPinnedRuleSets(): Promise<Array<{ cid: string; name?: string }>> {
        // thirdweb doesn't provide a direct way to list all pinned content
        // This would need to be managed separately (e.g., in a local database)
        console.log(chalk.yellow('⚠ Listing pinned rule sets not directly supported with thirdweb'));
        console.log(chalk.gray('  Consider maintaining a local registry of rule set URIs'));
        return [];
    }

    async searchRuleSets(query: string): Promise<Array<{ cid: string; ruleSet: CompressionRuleSet }>> {
        // This is a simplified search - in a real implementation, you'd use IPNS or a registry
        console.log(chalk.yellow('⚠ Search functionality requires a rule set registry'));
        console.log(chalk.gray('  For now, you can share CIDs directly'));
        return [];
    }

    private countRules(ruleSet: CompressionRuleSet): number {
        let count = 0;
        if (ruleSet.rules.redundantPhrases) count += ruleSet.rules.redundantPhrases.length;
        if (ruleSet.rules.commonPhrases) count += ruleSet.rules.commonPhrases.length;
        if (ruleSet.rules.fillerWords) count += ruleSet.rules.fillerWords.length;
        if (ruleSet.rules.instructions) count += ruleSet.rules.instructions.length;
        if (ruleSet.rules.conjunctions) count += ruleSet.rules.conjunctions.length;
        if (ruleSet.rules.codingPhrases) count += ruleSet.rules.codingPhrases.length;
        if (ruleSet.rules.customRules) count += ruleSet.rules.customRules.length;
        return count;
    }

    private validateRuleSet(ruleSet: CompressionRuleSet): void {
        const required = ['id', 'name', 'description', 'version', 'author', 'createdAt', 'rules'];
        for (const field of required) {
            if (!(field in ruleSet)) {
                throw new Error(`Invalid rule set: missing required field '${field}'`);
            }
        }

        if (!ruleSet.rules || typeof ruleSet.rules !== 'object') {
            throw new Error('Invalid rule set: rules must be an object');
        }
    }

    isConnected(): boolean {
        return this.client !== null;
    }

    getConfig(): ThirdwebConfig {
        return this.config;
    }
}

// Utility functions for creating rule sets
export class RuleSetBuilder {
    static createGeneralRuleSet(name: string, description: string, author: string): CompressionRuleSet {
        return {
            id: this.generateId(),
            name,
            description,
            version: '1.0.0',
            author,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['general', 'text-compression'],
            category: 'general',
            rules: {}
        };
    }

    static createProgrammingRuleSet(name: string, description: string, author: string, language: string): CompressionRuleSet {
        return {
            id: this.generateId(),
            name,
            description,
            version: '1.0.0',
            author,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['programming', language.toLowerCase(), 'code-compression'],
            category: 'programming',
            language,
            rules: {}
        };
    }

    static createDomainSpecificRuleSet(name: string, description: string, author: string, domain: string): CompressionRuleSet {
        return {
            id: this.generateId(),
            name,
            description,
            version: '1.0.0',
            author,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['domain-specific', domain.toLowerCase()],
            category: 'domain-specific',
            rules: {}
        };
    }

    private static generateId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
