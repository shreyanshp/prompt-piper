import chalk from 'chalk';
import { createThirdwebClient, ThirdwebClient } from 'thirdweb';
import { upload, download } from 'thirdweb/storage';
import type { CompressionRuleSet } from '../types';
import { RuleSetRegistry } from './rule-set-registry';
import { SpecializedRuleSets } from './specialized-rules';

export interface StorageResult {
    id: string;
    name: string;
    ipfsUri: string;
    gatewayUrl: string;
    timestamp: string;
}

export interface StorageManifest {
    version: string;
    created: string;
    ruleSets: StorageResult[];
    manifestUri?: string;
}

export class IPFSStorageService {
    private client: ThirdwebClient;
    private registry: RuleSetRegistry;
    private storedHashes: Map<string, StorageResult> = new Map();

    constructor() {
        const clientId = process.env.THIRDWEB_CLIENT_ID;
        const secretKey = process.env.THIRDWEB_SECRET_KEY;

        if (!clientId) {
            throw new Error(
                chalk.red('❌ THIRDWEB_CLIENT_ID not found\n') +
                chalk.yellow('Set: export THIRDWEB_CLIENT_ID="your_client_id"\n') +
                chalk.gray('Get from: https://thirdweb.com/dashboard')
            );
        }

        this.client = createThirdwebClient({
            clientId: clientId,
            secretKey: secretKey
        });

        this.registry = RuleSetRegistry.getInstance();
        this.loadSpecializedRules();
    }

    private loadSpecializedRules() {
        const specializedSets = SpecializedRuleSets.getAllSpecializedRuleSets();
        specializedSets.forEach(ruleSet => {
            this.registry.registerRuleSet(ruleSet);
        });
    }

    async storeRuleSet(ruleSetId: string): Promise<StorageResult | null> {
        const ruleSet = this.registry.getRuleSet(ruleSetId);
        if (!ruleSet) {
            console.error(chalk.red(`Rule set "${ruleSetId}" not found`));
            return null;
        }

        try {
            console.log(chalk.gray(`Storing "${ruleSet.name}" to IPFS...`));

            const files = [{
                data: JSON.stringify(ruleSet, null, 2),
                name: `${ruleSet.id}.json`
            }];

            const uris = await upload({
                client: this.client,
                files
            });

            const ipfsUri = uris[0];
            const gatewayUrl = `https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`;

            const result: StorageResult = {
                id: ruleSet.id,
                name: ruleSet.name,
                ipfsUri,
                gatewayUrl,
                timestamp: new Date().toISOString()
            };

            this.storedHashes.set(ruleSet.id, result);

            console.log(chalk.green('✅ Successfully stored!'));
            console.log(chalk.cyan('   IPFS URI:'), ipfsUri);
            console.log(chalk.cyan('   Gateway:'), gatewayUrl);

            return result;
        } catch (error) {
            console.error(chalk.red('❌ Storage failed:'), error);
            return null;
        }
    }

    async storeAllRuleSets(): Promise<StorageManifest> {
        console.log(chalk.yellow.bold('📤 Storing All Rule Sets to IPFS'));
        console.log(chalk.gray('='.repeat(60)));

        const allRuleSets = this.registry.getAllRuleSets();
        const results: StorageResult[] = [];

        for (const ruleSet of allRuleSets) {
            const result = await this.storeRuleSet(ruleSet.id);
            if (result) {
                results.push(result);
            }
        }

        const manifest: StorageManifest = {
            version: '1.0.0',
            created: new Date().toISOString(),
            ruleSets: results
        };

        try {
            console.log(chalk.gray('\nStoring manifest...'));

            const files = [{
                data: JSON.stringify(manifest, null, 2),
                name: 'rule-sets-manifest.json'
            }];

            const uris = await upload({
                client: this.client,
                files
            });

            const manifestUri = uris[0];
            console.log(chalk.green('✅ Manifest stored!'));
            console.log(chalk.cyan('   Manifest URI:'), manifestUri);
            console.log(chalk.cyan('   Total rule sets:'), results.length);

            return {
                ...manifest,
                manifestUri
            };
        } catch (error) {
            console.error(chalk.red('❌ Failed to store manifest:'), error);
            return manifest;
        }
    }

    async retrieveRuleSet(ipfsUri: string): Promise<CompressionRuleSet | null> {
        try {
            console.log(chalk.gray(`Retrieving from ${ipfsUri}...`));

            const response = await download({
                client: this.client,
                uri: ipfsUri
            });

            const text = await response.text();
            const ruleSet = JSON.parse(text) as CompressionRuleSet;

            console.log(chalk.green('✅ Retrieved:'), ruleSet.name);
            return ruleSet;
        } catch (error) {
            console.error(chalk.red('❌ Retrieval failed:'), error);
            return null;
        }
    }

    async storeCustomRuleSet(ruleSet: CompressionRuleSet): Promise<StorageResult | null> {
        try {
            console.log(chalk.gray(`Storing custom rule set "${ruleSet.name}"...`));

            const files = [{
                data: JSON.stringify(ruleSet, null, 2),
                name: `${ruleSet.id}.json`
            }];

            const uris = await upload({
                client: this.client,
                files
            });

            const ipfsUri = uris[0];
            const gatewayUrl = `https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`;

            const result: StorageResult = {
                id: ruleSet.id,
                name: ruleSet.name,
                ipfsUri,
                gatewayUrl,
                timestamp: new Date().toISOString()
            };

            console.log(chalk.green('✅ Custom rule set stored!'));
            console.log(chalk.cyan('   IPFS URI:'), ipfsUri);

            return result;
        } catch (error) {
            console.error(chalk.red('❌ Storage failed:'), error);
            return null;
        }
    }

    getStoredHashes(): Map<string, StorageResult> {
        return this.storedHashes;
    }

    displayStoredHashes() {
        if (this.storedHashes.size === 0) {
            console.log(chalk.yellow('No rule sets stored yet!'));
            return;
        }

        console.log(chalk.yellow('\n📋 Stored Rule Sets:'));
        console.log(chalk.gray('─'.repeat(60)));

        this.storedHashes.forEach((result, id) => {
            console.log(chalk.cyan(`\n${result.name}`));
            console.log(chalk.gray('  ID:'), id);
            console.log(chalk.gray('  IPFS:'), result.ipfsUri);
            console.log(chalk.gray('  Gateway:'), result.gatewayUrl);
            console.log(chalk.gray('  Stored:'), result.timestamp);
        });
    }
}

export default IPFSStorageService;