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

export interface StorageResult {
    id: string;
    name: string;
    ipfsHash: string;
    url: string;
    gatewayUrl: string;
    timestamp: string;
}

export interface BatchStorageResult {
    stored: StorageResult[];
    failed: Array<{ name: string; error: string }>;
    totalTime: number;
}

export interface StorageManifest {
    version: string;
    created: string;
    ruleSets: StorageResult[];
}