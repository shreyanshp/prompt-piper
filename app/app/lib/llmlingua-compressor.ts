import * as LLMLingua2 from "./llmlingua2";
import { Tiktoken } from "js-tiktoken/lite";
import { o200k_base } from "./tiktoken-utils";
import { configureONNXRuntime, getOptimizedTransformersConfig } from "./onnx-runtime-config";

export interface LLMLinguaCompressionResult {
    originalPrompt: string;
    compressedPrompt: string;
    originalTokens: number;
    compressedTokens: number;
    compressionRatio: number;
    savedTokens: number;
    compressionMethod: 'llmlingua-2';
}

export interface LLMLinguaCompressorOptions {
    modelName?: 'TINYBERT' | 'BERT' | 'ROBERTA';
    rate?: number; // Compression rate (0-1, where 0.3 means keep 30% of tokens)
    forceTokens?: string[];
    device?: 'auto' | 'gpu' | 'cpu';
    modelDataType?: 'fp32' | 'fp16' | 'int8';
}

// Model configurations similar to the demo
const MODEL_CONFIGS = {
    TINYBERT: {
        modelName: "atjsh/llmlingua-2-js-tinybert-meetingbank",
        factory: LLMLingua2.WithBERTMultilingual,
    },
    BERT: {
        modelName: "Arcoldd/llmlingua4j-bert-base-onnx",
        factory: LLMLingua2.WithBERTMultilingual,
        modelSpecificOptions: {
            subfolder: "",
        },
    },
    ROBERTA: {
        modelName: "atjsh/llmlingua-2-js-xlm-roberta-large-meetingbank",
        factory: LLMLingua2.WithXLMRoBERTa,
        modelSpecificOptions: {
            use_external_data_format: true,
        },
    },
};

export class LLMLinguaCompressor {
    private static instance: LLMLinguaCompressor | null = null;
    private promptCompressor: LLMLingua2.PromptCompressor | null = null;
    private oaiTokenizer: Tiktoken;
    private currentModel: string | null = null;
    private isInitializing = false;

    private constructor() {
        this.oaiTokenizer = new Tiktoken(o200k_base);
    }

    static getInstance(): LLMLinguaCompressor {
        if (!LLMLinguaCompressor.instance) {
            LLMLinguaCompressor.instance = new LLMLinguaCompressor();
        }
        return LLMLinguaCompressor.instance;
    }

    async initialize(options: LLMLinguaCompressorOptions = {}): Promise<void> {
        const {
            modelName = 'TINYBERT',
            device = 'auto', // Use auto device selection like the original
            modelDataType = 'fp32'
        } = options;

        // Configure ONNX Runtime before any model loading
        configureONNXRuntime();

        // Skip if already initialized with the same model
        if (this.promptCompressor && this.currentModel === modelName) {
            return;
        }

        // Prevent multiple initializations
        if (this.isInitializing) {
            // Wait for current initialization to complete
            while (this.isInitializing) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        this.isInitializing = true;

        try {
            const config = MODEL_CONFIGS[modelName];
            if (!config) {
                throw new Error(`Unknown model: ${modelName}`);
            }

            // Use optimized configuration
            const transformerJSConfig = getOptimizedTransformersConfig();

            const { promptCompressor } = await config.factory(config.modelName, {
                transformerJSConfig,
                oaiTokenizer: this.oaiTokenizer,
                modelSpecificOptions: (config as any).modelSpecificOptions,
                logger: () => {}, // Silent logger
            });

            this.promptCompressor = promptCompressor;
            this.currentModel = modelName;
        } finally {
            this.isInitializing = false;
        }
    }

    async compress(
        prompt: string,
        options: LLMLinguaCompressorOptions = {}
    ): Promise<LLMLinguaCompressionResult> {
        const {
            rate = 0.7, // Keep 70% of tokens by default
            forceTokens = [],
        } = options;

        // Ensure initialized
        await this.initialize(options);

        if (!this.promptCompressor) {
            throw new Error('Compressor not initialized');
        }

        // Get original token count
        const originalTokens = this.oaiTokenizer.encode(prompt).length;

        // Compress the prompt
        const compressedPrompt = await this.promptCompressor.compress(prompt, {
            rate,
            forceTokens,
            tokenToWord: 'mean',
            forceReserveDigit: false,
            dropConsecutive: false,
            chunkEndTokens: ['.', '\n'],
        });

        // Get compressed token count
        const compressedTokens = this.oaiTokenizer.encode(compressedPrompt).length;
        const savedTokens = originalTokens - compressedTokens;
        const compressionRatio = (savedTokens / originalTokens) * 100;

        return {
            originalPrompt: prompt,
            compressedPrompt,
            originalTokens,
            compressedTokens,
            compressionRatio,
            savedTokens,
            compressionMethod: 'llmlingua-2',
        };
    }

    getTokenCount(text: string): number {
        return this.oaiTokenizer.encode(text).length;
    }
}
