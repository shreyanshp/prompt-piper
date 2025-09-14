'use client'

import { Tiktoken } from "js-tiktoken/lite";
import { o200k_base } from "./tiktoken-utils";
import { configureONNXRuntime, getOptimizedTransformersConfig } from "./onnx-runtime-config";

export class LLMLingua2Browser {
    private static instance: LLMLingua2Browser | null = null;
    private oaiTokenizer: Tiktoken;
    private currentModel: string | null = null;
    private isInitializing = false;
    private loadedModels: { [key: string]: { model: any; tokenizer: any; config: any } } = {};

    private MODEL_CONFIGS = {
        tinybert: {
            modelName: "atjsh/llmlingua-2-js-tinybert-meetingbank",
            size: "57MB",
            description: "Fastest processing, good for quick compression",
        },
        bert: {
            modelName: "Arcoldd/llmlingua4j-bert-base-onnx",
            size: "710MB",
            description: "Better accuracy, balanced performance",
        },
        "xlm-roberta": {
            modelName: "atjsh/llmlingua-2-js-xlm-roberta-large-meetingbank",
            size: "2.2GB",
            description: "Best accuracy, highest resource usage",
        }
    }

    constructor() {
        this.oaiTokenizer = new Tiktoken(o200k_base);
    }

    static getInstance(): LLMLingua2Browser {
        if (!LLMLingua2Browser.instance) {
            LLMLingua2Browser.instance = new LLMLingua2Browser();
        }
        return LLMLingua2Browser.instance;
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
        if (this.currentModel === modelId) {
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
            // Configure ONNX Runtime before loading models
            configureONNXRuntime();

            const config = this.MODEL_CONFIGS[modelId as keyof typeof this.MODEL_CONFIGS];
            if (!config) {
                throw new Error(`Unknown model: ${modelId}`);
            }

            console.log(`🤖 Loading LLMLingua-2 model: ${config.modelName}`);
            console.log(`📁 Model size: ${config.size}`);
            console.log(`🔗 HuggingFace URL: https://huggingface.co/${config.modelName}`);

            onProgress?.(10);

            // Dynamically import Hugging Face Transformers to avoid SSR issues
            console.log(`📦 Loading Transformers.js...`);
            const {
                AutoConfig,
                AutoModelForTokenClassification,
                AutoTokenizer
            } = await import('@huggingface/transformers');

            onProgress?.(20);

            // Use optimized configuration
            const transformerJSConfig = getOptimizedTransformersConfig();

            onProgress?.(40);

            console.log(`🔄 Loading model configuration...`);
            const modelConfig = await AutoConfig.from_pretrained(config.modelName);

            onProgress?.(60);

            const tokenizerConfig = {
                config: {
                    ...modelConfig,
                    "transformers.js_config": transformerJSConfig
                }
            };

            console.log(`🔄 Loading tokenizer...`);
            const tokenizer = await AutoTokenizer.from_pretrained(config.modelName, tokenizerConfig);

            onProgress?.(80);

            const fullModelConfig = {
                config: {
                    ...modelConfig,
                    "transformers.js_config": transformerJSConfig
                }
            };

            console.log(`🔄 Loading classification model...`);
            const model = await AutoModelForTokenClassification.from_pretrained(
                config.modelName,
                fullModelConfig
            );

            onProgress?.(100);

            console.log(`✅ Model loaded successfully: ${config.modelName}`);

            // Store the loaded model components
            this.loadedModels[modelId] = {
                model,
                tokenizer,
                config: modelConfig
            };

            this.currentModel = modelId;
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
        console.log(`🔄 Starting AI compression with rate: ${compressionRate}`);

        // Check if model is loaded
        if (!this.loadedModels[modelId]) {
            throw new Error(`Model ${modelId} is not loaded. Please load the model first.`);
        }

        const { model, tokenizer } = this.loadedModels[modelId];

        try {
            // Tokenize the input text
            const { input_ids, attention_mask } = await tokenizer(text, {
                padding: true,
                truncation: true,
                max_length: 512
            });

            console.log(`🔄 Running AI model inference...`);

            // Run the model inference
            const outputs = await model({
                input_ids,
                attention_mask,
            });

            console.log(`🔄 Processing model outputs...`);

            // Extract logits and convert to probabilities
            const logits = outputs.logits;
            const [batch_size, seq_len, num_classes] = logits.dims;

            // Get probabilities for class 1 (keep token)
            const probs: number[] = [];
            for (let i = 0; i < seq_len; i++) {
                const tokenLogits = logits.data.slice(i * num_classes, (i + 1) * num_classes);
                const expLogits = tokenLogits.map((x: number) => Math.exp(x));
                const sumExp = expLogits.reduce((a: number, b: number) => a + b, 0);
                const prob = expLogits[1] / sumExp; // Probability of keeping the token
                probs.push(prob);
            }

            // Get token IDs and filter by attention mask
            const tokenIds = input_ids.data;
            const mask = attention_mask.data;

            const activeTokens = [];
            const activeProbs = [];

            for (let i = 0; i < tokenIds.length; i++) {
                if (mask[i] > 0 && tokenIds[i] !== 0) {
                    activeTokens.push(tokenIds[i]);
                    activeProbs.push(probs[i] || 0);
                }
            }

            // Convert token IDs back to tokens
            const tokens = tokenizer.model.convert_ids_to_tokens(activeTokens);

            // Merge tokens into words and calculate word probabilities
            const words: string[] = [];
            const wordProbs: number[] = [];
            let currentWord = '';
            let currentProbs: number[] = [];

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const prob = activeProbs[i];

                // Check if this is the start of a new word
                if (token.startsWith('##') || token.startsWith('▁')) {
                    // This is a continuation token
                    currentWord += token.replace(/^##|^▁/, '');
                    currentProbs.push(prob);
                } else {
                    // This is a new word
                    if (currentWord) {
                        words.push(currentWord);
                        wordProbs.push(currentProbs.reduce((a, b) => a + b, 0) / currentProbs.length);
                    }
                    currentWord = token.replace(/^##|^▁/, '');
                    currentProbs = [prob];
                }
            }

            // Add the last word
            if (currentWord) {
                words.push(currentWord);
                wordProbs.push(currentProbs.reduce((a, b) => a + b, 0) / currentProbs.length);
            }

            // Apply compression based on probabilities
            const targetWords = Math.floor(words.length * compressionRate);
            const threshold = wordProbs.slice().sort((a, b) => b - a)[targetWords - 1] || 0;

            const selectedWords = [];
            for (let i = 0; i < words.length; i++) {
                if (wordProbs[i] >= threshold || forceTokens.includes(words[i])) {
                    selectedWords.push(words[i]);
                }
            }

            const result = selectedWords.join(' ');
            console.log(`✅ AI compression completed: ${words.length} → ${selectedWords.length} words`);
            return result;

        } catch (error) {
            console.error('AI compression failed, falling back to simple compression:', error);

            // Fallback to simple word-based compression
            return this.simpleCompress(text, compressionRate);
        }
    }

    private simpleCompress(text: string, compressionRate: number): string {
        console.log(`🔄 Using fallback compression with rate: ${compressionRate}`);

        const words = text.split(/\s+/);
        const targetLength = Math.floor(words.length * compressionRate);

        if (targetLength >= words.length) return text;

        // Keep important words (longer words, content words)
        const wordsWithScores = words.map((word, index) => ({
            word,
            index,
            score: this.getWordImportance(word, index, words)
        }));

        wordsWithScores.sort((a, b) => b.score - a.score);

        const selectedWords = wordsWithScores
            .slice(0, targetLength)
            .sort((a, b) => a.index - b.index)
            .map(item => item.word);

        const result = selectedWords.join(' ');
        console.log(`✅ Fallback compression completed: ${words.length} → ${selectedWords.length} words`);
        return result;
    }

    private getWordImportance(word: string, index: number, allWords: string[]): number {
        let score = 0.5;

        // Content words are more important
        if (this.isContentWord(word)) {
            score += 0.3;
        }

        // Longer words tend to be more important
        score += Math.min(word.length * 0.02, 0.2);

        // Words at the beginning and end are more important
        const position = index / allWords.length;
        if (position < 0.2 || position > 0.8) {
            score += 0.1;
        }

        return score;
    }

    private isContentWord(word: string): boolean {
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'can', 'please', 'very', 'really', 'quite'
        ]);

        return !stopWords.has(word.toLowerCase().replace(/[.,!?;:]$/, ''));
    }

    getModelStatus(modelId: string): 'not-loaded' | 'loading' | 'loaded' | 'error' {
        if (this.loadedModels[modelId]) return 'loaded';
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
