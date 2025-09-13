import chalk from 'chalk';
import { IPFSManager, CompressionRuleSet } from './ipfs-manager';
import { RuleSetRegistry } from './rule-set-registry';

export class IPFSCommands {
    private ipfsManager: IPFSManager;
    private registry: RuleSetRegistry;

    constructor(clientId?: string) {
        if (!clientId) {
            console.log(chalk.yellow('⚠ No CLIENT_ID provided. IPFS functionality will be limited.'));
            console.log(chalk.gray('  Set THIRDWEB_CLIENT_ID environment variable or pass clientId to constructor'));
        }
        this.ipfsManager = new IPFSManager({ clientId: clientId || 'demo-client-id' });
        this.registry = RuleSetRegistry.getInstance();
    }

    async initialize(): Promise<void> {
        await this.ipfsManager.connect();
    }

    async storeRuleSet(ruleSetId: string): Promise<string> {
        const ruleSet = this.registry.getRuleSet(ruleSetId);
        if (!ruleSet) {
            throw new Error(`Rule set '${ruleSetId}' not found`);
        }

        const ipfsAddress = await this.ipfsManager.storeRuleSet(ruleSet);

        // Track the IPFS address in the registry
        this.registry.setIPFSAddress(ruleSetId, ipfsAddress);

        return ipfsAddress;
    }

    async loadRuleSet(cid: string): Promise<CompressionRuleSet> {
        const ruleSet = await this.ipfsManager.loadRuleSet(cid);
        this.registry.registerRuleSet(ruleSet);

        // Track the IPFS address for the loaded rule set
        this.registry.setIPFSAddress(ruleSet.id, cid);

        return ruleSet;
    }

    async pinRuleSet(cid: string): Promise<void> {
        await this.ipfsManager.pinRuleSet(cid);
    }

    async unpinRuleSet(cid: string): Promise<void> {
        await this.ipfsManager.unpinRuleSet(cid);
    }

    async listPinnedRuleSets(): Promise<void> {
        const pinned = await this.ipfsManager.listPinnedRuleSets();

        console.log();
        console.log(chalk.bold.blue('>>> PINNED RULE SETS'));
        console.log(chalk.gray('═'.repeat(60)));

        if (pinned.length === 0) {
            console.log(chalk.yellow('No pinned rule sets found'));
            return;
        }

        pinned.forEach((pin, index) => {
            console.log();
            console.log(chalk.white(`${index + 1}.`), chalk.bold.cyan(pin.cid));
            if (pin.name) {
                console.log(chalk.gray(`   Name: ${pin.name}`));
            }
        });
    }

    async listAvailableRuleSets(): Promise<void> {
        const allRuleSets = this.registry.getAllRuleSets();

        console.log();
        console.log(chalk.bold.blue('>>> AVAILABLE RULE SETS'));
        console.log(chalk.gray('═'.repeat(60)));

        if (allRuleSets.length === 0) {
            console.log(chalk.yellow('No rule sets available'));
            return;
        }

        // Group by category
        const categories = {
            general: allRuleSets.filter(rs => rs.category === 'general'),
            programming: allRuleSets.filter(rs => rs.category === 'programming'),
            'domain-specific': allRuleSets.filter(rs => rs.category === 'domain-specific')
        };

        Object.entries(categories).forEach(([category, ruleSets]) => {
            if (ruleSets.length === 0) return;

            console.log();
            console.log(chalk.bold.yellow(category.toUpperCase()));
            console.log(chalk.gray('─'.repeat(40)));

            ruleSets.forEach((ruleSet, index) => {
                console.log();
                console.log(chalk.white(`${index + 1}.`), chalk.bold.cyan(ruleSet.name));
                console.log(chalk.gray(`   ID: ${ruleSet.id}`));
                console.log(chalk.gray(`   Author: ${ruleSet.author}`));
                console.log(chalk.gray(`   Version: ${ruleSet.version}`));
                console.log(chalk.gray(`   Description: ${ruleSet.description}`));
                if (ruleSet.language) {
                    console.log(chalk.gray(`   Language: ${ruleSet.language}`));
                }
                console.log(chalk.gray(`   Tags: ${ruleSet.tags.join(', ')}`));
                if (ruleSet.metadata?.compressionRatio) {
                    console.log(chalk.gray(`   Compression: ${(ruleSet.metadata.compressionRatio * 100).toFixed(1)}%`));
                }

                // Show IPFS address if available
                const ipfsAddress = this.registry.getIPFSAddress(ruleSet.id) || ruleSet.metadata?.ipfsAddress;
                if (ipfsAddress) {
                    console.log(chalk.green(`   📤 IPFS: ${ipfsAddress}`));
                } else {
                    console.log(chalk.gray(`   📤 IPFS: Not stored`));
                }
            });
        });
    }

    async searchRuleSets(query: string): Promise<void> {
        const results = this.registry.searchRuleSets(query);

        console.log();
        console.log(chalk.bold.blue(`>>> SEARCH RESULTS FOR "${query}"`));
        console.log(chalk.gray('═'.repeat(60)));

        if (results.length === 0) {
            console.log(chalk.yellow('No rule sets found matching your query'));
            return;
        }

        results.forEach((ruleSet, index) => {
            console.log();
            console.log(chalk.white(`${index + 1}.`), chalk.bold.cyan(ruleSet.name));
            console.log(chalk.gray(`   ID: ${ruleSet.id}`));
            console.log(chalk.gray(`   Category: ${ruleSet.category}`));
            console.log(chalk.gray(`   Author: ${ruleSet.author}`));
            console.log(chalk.gray(`   Description: ${ruleSet.description}`));
            if (ruleSet.language) {
                console.log(chalk.gray(`   Language: ${ruleSet.language}`));
            }

            // Show IPFS address if available
            const ipfsAddress = this.registry.getIPFSAddress(ruleSet.id) || ruleSet.metadata?.ipfsAddress;
            if (ipfsAddress) {
                console.log(chalk.green(`   📤 IPFS: ${ipfsAddress}`));
            } else {
                console.log(chalk.gray(`   📤 IPFS: Not stored`));
            }
        });
    }

    async createCustomRuleSet(name: string, description: string, author: string, category: 'general' | 'programming' | 'domain-specific', language?: string): Promise<CompressionRuleSet> {
        let ruleSet: CompressionRuleSet;

        if (category === 'programming' && language) {
            ruleSet = {
                id: `custom-${Date.now()}`,
                name,
                description,
                version: '1.0.0',
                author,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['custom', category, language.toLowerCase()],
                category,
                language,
                rules: {}
            };
        } else {
            ruleSet = {
                id: `custom-${Date.now()}`,
                name,
                description,
                version: '1.0.0',
                author,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: ['custom', category],
                category,
                rules: {}
            };
        }

        this.registry.registerRuleSet(ruleSet);
        console.log(chalk.green(`✓ Custom rule set created: ${ruleSet.id}`));
        return ruleSet;
    }

    async mergeRuleSets(ruleSetIds: string[]): Promise<CompressionRuleSet> {
        const merged = this.registry.mergeRuleSets(ruleSetIds);
        this.registry.registerRuleSet(merged);
        console.log(chalk.green(`✓ Merged rule set created: ${merged.id}`));
        return merged;
    }

    async exportRuleSet(ruleSetId: string, filename: string): Promise<void> {
        const ruleSet = this.registry.getRuleSet(ruleSetId);
        if (!ruleSet) {
            throw new Error(`Rule set '${ruleSetId}' not found`);
        }

        const fs = require('fs');
        const path = require('path');

        const exportData = {
            ...ruleSet,
            exportedAt: new Date().toISOString(),
            exportedBy: 'Prompt Piper CLI'
        };

        const filePath = path.resolve(filename);
        fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));

        console.log(chalk.green(`✓ Rule set exported to: ${filePath}`));
    }

    async importRuleSet(filename: string): Promise<CompressionRuleSet> {
        const fs = require('fs');
        const path = require('path');

        const filePath = path.resolve(filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const ruleSet = JSON.parse(fileContent) as CompressionRuleSet;

        // Validate and clean up the imported rule set
        ruleSet.id = `imported-${Date.now()}`;
        ruleSet.updatedAt = new Date().toISOString();

        this.registry.registerRuleSet(ruleSet);
        console.log(chalk.green(`✓ Rule set imported: ${ruleSet.id}`));
        return ruleSet;
    }

    async showRuleSetDetails(ruleSetId: string): Promise<void> {
        const ruleSet = this.registry.getRuleSet(ruleSetId);
        if (!ruleSet) {
            throw new Error(`Rule set '${ruleSetId}' not found`);
        }

        console.log();
        console.log(chalk.bold.blue('>>> RULE SET DETAILS'));
        console.log(chalk.gray('═'.repeat(60)));
        console.log();
        console.log(chalk.bold.cyan(ruleSet.name));
        console.log(chalk.gray(`ID: ${ruleSet.id}`));
        console.log(chalk.gray(`Author: ${ruleSet.author}`));
        console.log(chalk.gray(`Version: ${ruleSet.version}`));
        console.log(chalk.gray(`Category: ${ruleSet.category}`));
        if (ruleSet.language) {
            console.log(chalk.gray(`Language: ${ruleSet.language}`));
        }
        console.log(chalk.gray(`Created: ${new Date(ruleSet.createdAt).toLocaleDateString()}`));
        console.log(chalk.gray(`Updated: ${new Date(ruleSet.updatedAt).toLocaleDateString()}`));
        console.log(chalk.gray(`Tags: ${ruleSet.tags.join(', ')}`));
        console.log();
        console.log(chalk.bold.yellow('Description:'));
        console.log(chalk.white(ruleSet.description));
        console.log();

        // Show rule counts
        const ruleCounts = this.getRuleCounts(ruleSet);
        console.log(chalk.bold.yellow('Rule Counts:'));
        Object.entries(ruleCounts).forEach(([type, count]) => {
            if (count > 0) {
                console.log(chalk.gray(`  ${type}: ${count}`));
            }
        });

        if (ruleSet.metadata) {
            console.log();
            console.log(chalk.bold.yellow('Metadata:'));
            if (ruleSet.metadata.compressionRatio) {
                console.log(chalk.gray(`  Compression Ratio: ${(ruleSet.metadata.compressionRatio * 100).toFixed(1)}%`));
            }
            if (ruleSet.metadata.usage !== undefined) {
                console.log(chalk.gray(`  Usage Count: ${ruleSet.metadata.usage}`));
            }
            if (ruleSet.metadata.rating !== undefined) {
                console.log(chalk.gray(`  Rating: ${ruleSet.metadata.rating}/5`));
            }
        }
    }

    private getRuleCounts(ruleSet: CompressionRuleSet): Record<string, number> {
        const counts: Record<string, number> = {};

        if (ruleSet.rules.redundantPhrases) counts['Redundant Phrases'] = ruleSet.rules.redundantPhrases.length;
        if (ruleSet.rules.commonPhrases) counts['Common Phrases'] = ruleSet.rules.commonPhrases.length;
        if (ruleSet.rules.fillerWords) counts['Filler Words'] = ruleSet.rules.fillerWords.length;
        if (ruleSet.rules.instructions) counts['Instructions'] = ruleSet.rules.instructions.length;
        if (ruleSet.rules.conjunctions) counts['Conjunctions'] = ruleSet.rules.conjunctions.length;
        if (ruleSet.rules.codingPhrases) counts['Coding Phrases'] = ruleSet.rules.codingPhrases.length;
        if (ruleSet.rules.customRules) counts['Custom Rules'] = ruleSet.rules.customRules.length;

        return counts;
    }

    isConnected(): boolean {
        return this.ipfsManager.isConnected();
    }

    getRegistry(): RuleSetRegistry {
        return this.registry;
    }
}
