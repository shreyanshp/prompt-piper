import { NextRequest, NextResponse } from 'next/server';
import { PromptCompressor } from '../../lib/compression';
import { LLMLinguaCompressor } from '../../lib/llmlingua-compressor';

// Add this line to specify Edge Runtime
export const runtime = 'edge';

// OpenRouter API integration
class OpenRouterAPI {
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('OpenRouter API key required. Set OPENROUTER_API_KEY environment variable.');
        }
    }

    async executePrompt(prompt: string, isCompressed: boolean = false): Promise<string> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/prompt-piper/app',
                'X-Title': 'Prompt Piper App'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: isCompressed ? 790 : 960,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || prompt;
    }
}

// Bitcoin.com AI API integration
class BitcoinComAPI {
    private apiKey: string;
    private baseURL = 'https://ai.bitcoin.com/api/v1';

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.BITCOINCOM_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('Bitcoin.com AI API key required. Set BITCOINCOM_API_KEY environment variable.');
        }
    }

    async executePrompt(prompt: string, isCompressed: boolean = false): Promise<string> {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'chatgpt-4o-latest',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: isCompressed ? 790 : 960,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Bitcoin.com AI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || prompt;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { prompt, provider, compressionMode, llmlinguaOptions } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let response;
        let model;
        let processedPrompt = prompt;
        let compressionResult = null;

        // Apply compression if requested
        if (compressionMode) {
            try {
                if (compressionMode === 'regular') {
                    const compressor = new PromptCompressor();
                    const compressedPrompt = await compressor.compress(prompt);
                    const stats = compressor.getCompressionStats(prompt, compressedPrompt);
                    
                    compressionResult = {
                        originalPrompt: prompt,
                        compressedPrompt,
                        originalTokens: stats.originalTokens,
                        compressedTokens: stats.compressedTokens,
                        compressionRatio: stats.compressionRatio,
                        savedTokens: stats.savedTokens,
                        compressionMethod: 'IPFS Rule-based'
                    };
                    processedPrompt = compressionResult.compressedPrompt;
                } else if (compressionMode === 'llmlingua-2-real' && llmlinguaOptions) {
                    const llmlinguaCompressor = LLMLinguaCompressor.getInstance();
                    compressionResult = await llmlinguaCompressor.compress(prompt, llmlinguaOptions);
                    processedPrompt = compressionResult.compressedPrompt;
                }
            } catch (compressionError: any) {
                console.error('Compression error:', compressionError);
                // Continue with original prompt if compression fails
                processedPrompt = prompt;
            }
        }

        if (provider === 'claude') {
            try {
                const openRouterApi = new OpenRouterAPI();
                response = await openRouterApi.executePrompt(processedPrompt, !!compressionResult);
                model = 'claude-3.5-sonnet (via OpenRouter)';
            } catch (error: any) {
                return NextResponse.json({ 
                    error: `OpenRouter API error: ${error.message}`,
                    details: 'Make sure OPENROUTER_API_KEY is set in your environment variables'
                }, { status: 500 });
            }

        } else if (provider === 'chatgpt') {
            try {
                const bitcoinComApi = new BitcoinComAPI();
                response = await bitcoinComApi.executePrompt(processedPrompt, !!compressionResult);
                model = 'chatgpt-4o-latest (via Bitcoin.com AI)';
            } catch (error: any) {
                return NextResponse.json({ 
                    error: `Bitcoin.com AI API error: ${error.message}`,
                    details: 'Make sure BITCOINCOM_API_KEY is set in your environment variables'
                }, { status: 500 });
            }

        } else {
            return NextResponse.json({ error: 'Invalid provider. Use "claude" or "chatgpt"' }, { status: 400 });
        }

        return NextResponse.json({
            response,
            model,
            promptLength: prompt.length,
            responseLength: response.length,
            compressionResult,
            processedPromptLength: processedPrompt.length
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to process request',
            details: error.response?.data || null
        }, { status: 500 });
    }
}
