export interface CompressionResult {
    originalPrompt: string;
    compressedPrompt: string;
    originalTokens: number;
    compressedTokens: number;
    compressionRatio: number;
    savedTokens: number;
    savedCost: number;
}

export class PromptCompressor {
    private static readonly TOKEN_COST_PER_1K = 0.003; // Claude-3 pricing

    static compress(prompt: string): string {
        let compressed = prompt;

        // Remove excessive whitespace
        compressed = compressed.replace(/\s+/g, ' ').trim();

        // Remove redundant phrases
        compressed = compressed.replace(/please (kindly )?/gi, '');
        compressed = compressed.replace(/could you (please )?/gi, '');
        compressed = compressed.replace(/I would like you to /gi, '');
        compressed = compressed.replace(/can you help me (with|to) /gi, '');

        // Compress common phrases
        compressed = compressed.replace(/as much detail as possible/gi, 'detailed');
        compressed = compressed.replace(/step by step/gi, 'stepwise');
        compressed = compressed.replace(/make sure (that )?/gi, 'ensure ');
        compressed = compressed.replace(/it is important (that|to)/gi, 'importantly,');
        compressed = compressed.replace(/keep in mind (that )?/gi, 'note: ');

        // Remove filler words
        compressed = compressed.replace(/\b(very|really|quite|rather|pretty)\s+/gi, '');
        compressed = compressed.replace(/\b(actually|basically|essentially|literally)\s+/gi, '');

        // Compress instructions
        compressed = compressed.replace(/provide me with/gi, 'provide');
        compressed = compressed.replace(/give me/gi, 'provide');
        compressed = compressed.replace(/explain to me/gi, 'explain');

        // Remove redundant conjunctions at sentence starts
        compressed = compressed.replace(/\. And /gi, '. ');
        compressed = compressed.replace(/\. Also, /gi, '. ');
        compressed = compressed.replace(/\. Additionally, /gi, '. ');

        // Clean up any double spaces that might have been created
        compressed = compressed.replace(/\s+/g, ' ').trim();

        return compressed;
    }

    static getTokenCount(text: string): number {
        // Rough approximation: ~4 characters per token for English text
        // This is a simplified version - in production you'd use tiktoken
        return Math.ceil(text.length / 4);
    }

    static analyze(originalPrompt: string): CompressionResult {
        const compressedPrompt = this.compress(originalPrompt);
        const originalTokens = this.getTokenCount(originalPrompt);
        const compressedTokens = this.getTokenCount(compressedPrompt);
        const savedTokens = originalTokens - compressedTokens;
        const compressionRatio = ((savedTokens / originalTokens) * 100);
        const savedCost = (savedTokens / 1000) * this.TOKEN_COST_PER_1K;

        return {
            originalPrompt,
            compressedPrompt,
            originalTokens,
            compressedTokens,
            compressionRatio,
            savedTokens,
            savedCost
        };
    }
}