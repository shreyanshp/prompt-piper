'use client';

import { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';

interface AITestResult {
    response: string;
    model: string;
    promptLength: number;
    responseLength: number;
}

interface AITestPanelProps {
    originalPrompt: string;
    compressedPrompt: string;
}

export default function AITestPanel({ originalPrompt, compressedPrompt }: AITestPanelProps) {
    const [provider, setProvider] = useState<'claude' | 'chatgpt'>('claude');
    const [originalResult, setOriginalResult] = useState<AITestResult | null>(null);
    const [compressedResult, setCompressedResult] = useState<AITestResult | null>(null);
    const [loadingOriginal, setLoadingOriginal] = useState(false);
    const [loadingCompressed, setLoadingCompressed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testPrompt = async (prompt: string, isOriginal: boolean) => {
        if (!prompt.trim()) return;

        const setLoading = isOriginal ? setLoadingOriginal : setLoadingCompressed;
        const setResult = isOriginal ? setOriginalResult : setCompressedResult;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/test-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    provider
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get AI response');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testBoth = async () => {
        if (!originalPrompt.trim() || !compressedPrompt.trim()) return;

        setError(null);
        await Promise.all([
            testPrompt(originalPrompt, true),
            testPrompt(compressedPrompt, false)
        ]);
    };

    const hasValidPrompts = originalPrompt.trim() && compressedPrompt.trim();

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Bot className="text-purple-600 dark:text-purple-400" size={24} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white font-title">AI Response Comparison</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setProvider('claude')}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                            provider === 'claude'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        Claude (OpenRouter)
                    </button>
                    <button
                        onClick={() => setProvider('chatgpt')}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                            provider === 'chatgpt'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        ChatGPT (Bitcoin.com AI)
                    </button>
                </div>

                <button
                    onClick={testBoth}
                    disabled={!hasValidPrompts || loadingOriginal || loadingCompressed}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={16} />
                    Test Both Prompts
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
                    <strong>Error:</strong> {error}
                    <br />
                    <span className="text-xs text-red-600 dark:text-red-500">
                        Make sure to set your API keys in environment variables: OPENROUTER_API_KEY or BITCOINCOM_API_KEY
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Response */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 dark:text-white">Original Prompt Response</h4>
                        <button
                            onClick={() => testPrompt(originalPrompt, true)}
                            disabled={!originalPrompt.trim() || loadingOriginal}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm disabled:opacity-50"
                        >
                            {loadingOriginal ? 'Testing...' : 'Test'}
                        </button>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-600 rounded p-4 min-h-[200px] bg-gray-50 dark:bg-gray-700">
                        {loadingOriginal ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="animate-spin" size={24} />
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Getting AI response...</span>
                            </div>
                        ) : originalResult ? (
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Model: {originalResult.model} | Response Length: {originalResult.responseLength} chars
                                </div>
                                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{originalResult.response}</div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 italic">No response yet. Click "Test Both Prompts" to compare.</div>
                        )}
                    </div>
                </div>

                {/* Compressed Response */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 dark:text-white">Compressed Prompt Response</h4>
                        <button
                            onClick={() => testPrompt(compressedPrompt, false)}
                            disabled={!compressedPrompt.trim() || loadingCompressed}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm disabled:opacity-50"
                        >
                            {loadingCompressed ? 'Testing...' : 'Test'}
                        </button>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-600 rounded p-4 min-h-[200px] bg-green-50 dark:bg-green-900/20">
                        {loadingCompressed ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="animate-spin" size={24} />
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Getting AI response...</span>
                            </div>
                        ) : compressedResult ? (
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Model: {compressedResult.model} | Response Length: {compressedResult.responseLength} chars
                                </div>
                                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{compressedResult.response}</div>
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 italic">No response yet. Click "Test Both Prompts" to compare.</div>
                        )}
                    </div>
                </div>
            </div>

            {originalResult && compressedResult && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quality Assessment</h4>
                    <div className="text-sm text-blue-700 dark:text-blue-400">
                        Both responses are from {originalResult.model}. Compare the quality and completeness of the answers to ensure
                        the compressed prompt maintains the same level of detail and accuracy while using fewer tokens.
                    </div>
                    {Math.abs(originalResult.responseLength - compressedResult.responseLength) < 100 && (
                        <div className="mt-2 text-green-700 dark:text-green-400 font-medium">
                            ✅ Response lengths are similar - compression successful without quality loss!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
