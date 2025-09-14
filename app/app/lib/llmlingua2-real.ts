'use client'

import { Tiktoken } from "js-tiktoken/lite";
import { o200k_base } from "./tiktoken-utils";
import * as LLMLingua2 from "./llmlingua2";

export class LLMLingua2Real {
    private static instance: LLMLingua2Real | null = null;
    private promptCompressor: LLMLingua2.PromptCompressor | null = null;
    private oaiTokenizer: Tiktoken;
    private currentModel: string | null = null;
    private isInitializing = false;

    private MODEL_CONFIGS = {
        tinybert: {
            modelName: "atjsh/llmlingua-2-js-tinybert-meetingbank",
            factory: LLMLingua2.WithBERTMultilingual,
            size: "57MB",
            description: "Fastest processing, good for quick compression",
            modelSpecificOptions: undefined
        },
        bert: {
            modelName: "Arcoldd/llmlingua4j-bert-base-onnx",
            factory: LLMLingua2.WithBERTMultilingual,
            size: "710MB",
            description: "Better accuracy, balanced performance",
            modelSpecificOptions: { subfolder: "" }
        },
        "xlm-roberta": {
            modelName: "atjsh/llmlingua-2-js-xlm-roberta-large-meetingbank",
            factory: LLMLingua2.WithXLMRoBERTa,
            size: "2.2GB",
            description: "Best accuracy, highest resource usage",
            modelSpecificOptions: { use_external_data_format: true }
        }
    }

    constructor() {
        this.oaiTokenizer = new Tiktoken(o200k_base);
    }

    static getInstance(): LLMLingua2Real {
        if (!LLMLingua2Real.instance) {
            LLMLingua2Real.instance = new LLMLingua2Real();
        }
        return LLMLingua2Real.instance;
    }

    async loadModel(modelId: string, onProgress?: (progress: number) => void): Promise<any> {
        return this.initialize(modelId, {
            device: 'auto',
            modelDataType: 'fp32'
        }, onProgress);
    }

    async initialize(
        modelId: string,
        options: { device?: string; modelDataType?: string } = {},
        onProgress?: (progress: number) => void
    ): Promise<void> {
        const { device = 'auto', modelDataType = 'fp32' } = options;

        // Skip if already initialized with the same model
        if (this.promptCompressor && this.currentModel === modelId) {
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
            const config = this.MODEL_CONFIGS[modelId as keyof typeof this.MODEL_CONFIGS];
            if (!config) {
                throw new Error(`Unknown model: ${modelId}`);
            }

            console.log(`🤖 Loading LLMLingua-2 model: ${config.modelName}`);
            console.log(`📁 Model size: ${config.size}`);
            console.log(`🔗 HuggingFace URL: https://huggingface.co/${config.modelName}`);

            onProgress?.(10);

            const transformerJSConfig = {
                device: device as 'auto' | 'cpu' | 'gpu' | 'wasm',
                dtype: modelDataType as 'fp32' | 'fp16' | 'int8',
                backend: 'wasm' as const // Use WebAssembly backend for browser compatibility
            };

            onProgress?.(50);

            // Use the proper factory function from the working implementation
            const { promptCompressor } = await config.factory(config.modelName, {
                transformerJSConfig,
                oaiTokenizer: this.oaiTokenizer,
                modelSpecificOptions: config.modelSpecificOptions,
                logger: (message) => {
                    console.log(`🔄 LLMLingua2:`, message);
                    onProgress?.(Math.min(90, 50 + Math.random() * 40));
                },
            });

            onProgress?.(100);

            this.promptCompressor = promptCompressor;
            this.currentModel = modelId;

            console.log(`✅ Model loaded successfully: ${config.modelName}`);
        } finally {
            this.isInitializing = false;
        }
    }

    async compress(
        text: string,
        modelId: string,
        compressionRate: number = 0.7,
        forceTokens: string[] = []
    ): Promise<string> {
        // Ensure initialized
        await this.initialize(modelId);

        if (!this.promptCompressor) {
            throw new Error('Compressor not initialized');
        }

        return await this.promptCompressor.compress(text, {
            rate: compressionRate,
            forceTokens,
            tokenToWord: 'mean',
            forceReserveDigit: false,
            dropConsecutive: false,
            chunkEndTokens: ['.', '\n'],
        });
    }


    getModelStatus(modelId: string): 'not-loaded' | 'loading' | 'loaded' | 'error' {
        if (this.promptCompressor && this.currentModel === modelId) return 'loaded';
        if (this.isInitializing) return 'loading';
        return 'not-loaded';
    }

    getModelSize(modelId: string): string {
        const config = this.MODEL_CONFIGS[modelId as keyof typeof this.MODEL_CONFIGS];
        return config?.size || 'Unknown';
    }

    static getTokenCount(text: string): number {
        const tokenizer = new Tiktoken(o200k_base);
        return tokenizer.encode(text).length;
    }

    getTokenCount(text: string): number {
        return this.oaiTokenizer.encode(text).length;
    }

}