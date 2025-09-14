import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { PromptCompressor } from '../../lib/compression';
import { LLMLinguaCompressor } from '../../lib/llmlingua-compressor';

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
            if (!process.env.ANTHROPIC_API_KEY) {
                return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
            }

            const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });

            const message = await anthropic.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: processedPrompt
                    }
                ]
            });


            response = message.content[0].type === 'text' ? message.content[0].text : 'No text response';
            model = 'claude-3-haiku';

        } else if (provider === 'chatgpt') {
            if (!process.env.OPENAI_API_KEY) {
                return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
            }

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: processedPrompt
                    }
                ],
                max_tokens: 1000,
            });

            response = completion.choices[0]?.message?.content || 'No response';
            model = 'gpt-3.5-turbo';

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
