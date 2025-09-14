// SPDX-License-Identifier: MIT

/**
 * @categoryDescription Factory
A collection of utility functions and types for model-specific token handling.
 *
 * @showCategories
 */

import {
    AutoConfig,
    AutoModelForTokenClassification,
    AutoTokenizer,
    PretrainedConfig,
    TransformersJSConfig,
} from "@huggingface/transformers";
import { Tiktoken } from "js-tiktoken/lite";

import { PromptCompressorLLMLingua2 } from "./prompt-compressor";
import {
    get_pure_tokens_bert_base_multilingual_cased,
    get_pure_tokens_xlm_roberta_large,
    is_begin_of_new_word_bert_base_multilingual_cased,
    is_begin_of_new_word_xlm_roberta_large,
    Logger,
} from "./utils";
import { getONNXConfig } from "../onnx-runtime-config";

type PreTrainedTokenizerOptions = Parameters<
    typeof AutoTokenizer.from_pretrained
>[1];
type PretrainedModelOptions = Parameters<
    typeof AutoModelForTokenClassification.from_pretrained
>[1];

async function prepareDependencies(
    modelName: string,
    transformerJSConfig: TransformersJSConfig,
    logger: Logger,

    pretrainedConfig?: PretrainedConfig | null,
    pretrainedTokenizerOptions?: PreTrainedTokenizerOptions | null,
    modelSpecificOptions?: PretrainedModelOptions | null
) {
    const config =
        pretrainedConfig ?? (await AutoConfig.from_pretrained(modelName));
    logger({ config });

    const tokenizerConfig = {
        config: {
            ...config,
            ...(transformerJSConfig
                ? { "transformers.js_config": transformerJSConfig }
                : {}),
        },
        ...pretrainedTokenizerOptions,
    };
    logger({ tokenizerConfig });

    const tokenizer = await AutoTokenizer.from_pretrained(
        modelName,
        tokenizerConfig
    );
    logger({ tokenizer });

    const modelConfig = {
        config: {
            ...config,
            ...(transformerJSConfig
                ? { "transformers.js_config": transformerJSConfig }
                : {}),
        },
        // Add optimized ONNX Runtime configuration
        ...getONNXConfig(),
        ...modelSpecificOptions,
    };
    logger({ modelConfig });

    const model = await AutoModelForTokenClassification.from_pretrained(
        modelName,
        modelConfig
    );
    logger({ model });

    return { model, tokenizer, config };
}

/**
 * Options for the LLMLingua-2 factory functions.
 *
 * @category Factory
 */
export interface LLMLingua2FactoryOptions {
    /**
     * Configuration for Transformers.js.
     */
    transformerJSConfig: TransformersJSConfig;

    /**
     * The tokenizer to use calculating the compression rate.
     */
    oaiTokenizer: Tiktoken;

    /**
     * Optional pretrained configuration.
     */
    pretrainedConfig?: PretrainedConfig | null;

    /**
     * Optional pretrained tokenizer options.
     */
    pretrainedTokenizerOptions?: PreTrainedTokenizerOptions | null;

    /**
     * Optional model-specific options.
     */
    modelSpecificOptions?: PretrainedModelOptions | null;

    /**
     * Optional logger function.
     */
    logger?: Logger;
}

/**
 * Return type for the LLMLingua-2 factory functions. Use `promptCompressor` to compress prompts.
 *
 * @category Factory
 */
export interface LLMLingua2FactoryReturn {
    /**
     * Instance of LLMLingua-2 PromptCompressor.
     *
     * @see {@link PromptCompressorLLMLingua2}
     */
    promptCompressor: PromptCompressorLLMLingua2;

    /**
     * The model used for token classification.
     */
    model: AutoModelForTokenClassification;

    /**
     * The tokenizer used for tokenization.
     */
    tokenizer: AutoTokenizer;

    /**
     * The configuration used for the model.
     */
    config: AutoConfig;
}


export async function WithXLMRoBERTa(
    modelName: string,
    options: LLMLingua2FactoryOptions
): Promise<LLMLingua2FactoryReturn> {
    const {
        transformerJSConfig,
        oaiTokenizer,
        pretrainedConfig,
        pretrainedTokenizerOptions,
        modelSpecificOptions,
        logger = console.log,
    } = options;

    const { model, tokenizer, config } = await prepareDependencies(
        modelName,
        transformerJSConfig,
        logger,
        pretrainedConfig,
        pretrainedTokenizerOptions,
        modelSpecificOptions
    );

    const promptCompressor = new PromptCompressorLLMLingua2(
        model,
        tokenizer,
        get_pure_tokens_xlm_roberta_large,
        is_begin_of_new_word_xlm_roberta_large,
        oaiTokenizer
    );

    logger({ promptCompressor });

    return {
        promptCompressor,
        model,
        tokenizer,
        config,
    };
}

export async function WithBERTMultilingual(
    modelName: string,
    options: LLMLingua2FactoryOptions
): Promise<LLMLingua2FactoryReturn> {
    const {
        transformerJSConfig,
        oaiTokenizer,
        pretrainedConfig,
        pretrainedTokenizerOptions,
        modelSpecificOptions,
        logger = console.log,
    } = options;

    const { model, tokenizer, config } = await prepareDependencies(
        modelName,
        transformerJSConfig,
        logger,
        pretrainedConfig,
        pretrainedTokenizerOptions,
        modelSpecificOptions
    );

    const promptCompressor = new PromptCompressorLLMLingua2(
        model,
        tokenizer,
        get_pure_tokens_bert_base_multilingual_cased,
        is_begin_of_new_word_bert_base_multilingual_cased,
        oaiTokenizer
    );

    logger({ promptCompressor });

    return {
        promptCompressor,
        model,
        tokenizer,
        config,
    };
}
