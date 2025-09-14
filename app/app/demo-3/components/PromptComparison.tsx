'use client';

import { useState, useEffect } from 'react';
import { Copy, Zap, BarChart3, Settings } from 'lucide-react';
import { PromptCompressor, CompressionResult } from '../../lib/prompt-compressor';
import { LLMLinguaCompressor, LLMLinguaCompressionResult, LLMLinguaCompressorOptions } from '../../lib/llmlingua-compressor';
import { configureONNXRuntime } from '../../lib/onnx-runtime-config';
import AITestPanel from './AITestPanel';

type CompressionMode = 'regular' | 'llmlingua-2-real';
type AnyCompressionResult = CompressionResult | LLMLinguaCompressionResult;

export default function PromptComparison() {
    const [inputPrompt, setInputPrompt] = useState('');
    const [result, setResult] = useState<AnyCompressionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionMode, setCompressionMode] = useState<CompressionMode>('llmlingua-2-real');
    const [llmlinguaOptions, setLlmlinguaOptions] = useState<LLMLinguaCompressorOptions>({
        modelName: 'TINYBERT',
        rate: 0.7,
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Configure ONNX Runtime early to suppress warnings
        configureONNXRuntime();
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Prompt Piper...</p>
                </div>
            </div>
        );
    }

    const handleCompress = async () => {
        if (!inputPrompt.trim()) return;

        setIsProcessing(true);

        try {
            let compressionResult: AnyCompressionResult;

            if (compressionMode === 'regular') {
                // Simulate processing time for demo effect
                await new Promise(resolve => setTimeout(resolve, 500));
                compressionResult = PromptCompressor.analyze(inputPrompt);
            } else {
                // LLMLingua-2 real AI compression
                const llmlinguaCompressor = LLMLinguaCompressor.getInstance();
                compressionResult = await llmlinguaCompressor.compress(inputPrompt, llmlinguaOptions);
            }

            setResult(compressionResult);
        } catch (error) {
            console.error('Compression error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Error during compression. Please check the console for details.';
            
            if (error instanceof Error) {
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error: Failed to download the AI model. Please check your internet connection and try again.';
                } else if (error.message.includes('WebAssembly')) {
                    errorMessage = 'WebAssembly error: Your browser may not support the required features. Please try using a modern browser.';
                } else if (error.message.includes('memory')) {
                    errorMessage = 'Memory error: The model is too large for your device. Try using the TinyBERT model instead.';
                }
            }
            
            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const examplePrompts = [
        "Could you please help me write a very detailed step by step guide on how to make sure that I can actually implement a React component that is really quite good and basically handles user authentication? Please make sure that you provide me with as much detail as possible and keep in mind that I am actually pretty new to React development.",
        "I would like you to please provide me with a comprehensive analysis of machine learning algorithms. Could you help me understand the differences between supervised and unsupervised learning? Please make sure to explain it in a way that is very clear and actually quite detailed.",
        "Can you help me write a Python function that actually processes data from a CSV file? Please make sure that it handles errors very carefully and basically validates all the input data. I would really like you to provide step by step instructions and keep in mind that performance is quite important."
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Prompt Piper 🎵
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                    Compress your AI prompts and save tokens without losing meaning
                </p>
            </div>

            {/* Compression Mode Toggle */}
            <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Settings size={20} />
                        Compression Settings
                    </h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compression Mode
                        </label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="compressionMode"
                                    value="regular"
                                    checked={compressionMode === 'regular'}
                                    onChange={(e) => setCompressionMode(e.target.value as CompressionMode)}
                                    className="mr-2"
                                />
                                <span className="text-sm">Regular (IPFS Rule-based)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="compressionMode"
                                    value="llmlingua-2-real"
                                    checked={compressionMode === 'llmlingua-2-real'}
                                    onChange={(e) => setCompressionMode(e.target.value as CompressionMode)}
                                    className="mr-2"
                                />
                                <span className="text-sm">LLMLingua-2 (AI-powered)</span>
                            </label>
                        </div>
                    </div>

                    {compressionMode === 'llmlingua-2-real' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Model Selection
                                </label>
                                <select
                                    value={llmlinguaOptions.modelName}
                                    onChange={(e) => setLlmlinguaOptions({
                                        ...llmlinguaOptions,
                                        modelName: e.target.value as any
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="TINYBERT">TinyBERT (57MB - Fastest)</option>
                                    <option value="BERT">BERT (710MB - Better accuracy)</option>
                                    <option value="ROBERTA">XLM-RoBERTa (2.2GB - Best accuracy)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Compression Rate: {Math.round((1 - llmlinguaOptions.rate!) * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.9"
                                    step="0.1"
                                    value={llmlinguaOptions.rate}
                                    onChange={(e) => setLlmlinguaOptions({
                                        ...llmlinguaOptions,
                                        rate: parseFloat(e.target.value)
                                    })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>90% reduction</span>
                                    <span>10% reduction</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 italic">
                                Note: First compression with a model will download it (~{
                                    llmlinguaOptions.modelName === 'TINYBERT' ? '57MB' :
                                    llmlinguaOptions.modelName === 'BERT' ? '710MB' : '2.2GB'
                                }). Subsequent compressions will be faster.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Original Prompt</h2>
                    </div>

                    <textarea
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        placeholder="Paste your verbose prompt here..."
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleCompress}
                            disabled={!inputPrompt.trim() || isProcessing}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Zap size={20} />
                            {isProcessing ? (
                                compressionMode.includes('llmlingua-2') ? 'AI Compressing...' : 'Compressing...'
                            ) : (
                                compressionMode.includes('llmlingua-2') ? 'AI Compress Prompt' : 'Compress Prompt'
                            )}
                        </button>

                        <div className="text-sm text-gray-500">
                            Or try an example:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {examplePrompts.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInputPrompt(example)}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700 transition-colors"
                                >
                                    Example {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Compressed Prompt</h2>
                    </div>

                    <div className="relative">
                        <textarea
                            value={result?.compressedPrompt || ''}
                            readOnly
                            placeholder="Compressed prompt will appear here..."
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none bg-gray-50"
                        />
                        {result && (
                            <button
                                onClick={() => copyToClipboard(result.compressedPrompt)}
                                className="absolute top-3 right-3 p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                                title="Copy compressed prompt"
                            >
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            {result && (
                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="text-green-600" size={24} />
                            <h3 className="text-xl font-semibold text-gray-800">Compression Results</h3>
                        </div>
                        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                            {compressionMode === 'regular' ? 'Regular IPFS' : 'LLMLingua-2 AI'} Compression
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{result.originalTokens}</div>
                            <div className="text-sm text-gray-600">Original Tokens</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{result.compressedTokens}</div>
                            <div className="text-sm text-gray-600">Compressed Tokens</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{result.savedTokens}</div>
                            <div className="text-sm text-gray-600">Tokens Saved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{result.compressionRatio.toFixed(1)}%</div>
                            <div className="text-sm text-gray-600">Reduction</div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded border border-green-200">
                        <div className="text-sm text-gray-700">
                            <strong>Cost Savings:</strong> At $0.003/1K tokens (Claude-3), you'd save approximately
                            <span className="text-green-600 font-semibold"> ${(result.savedTokens * 0.003 / 1000).toFixed(4)}</span> per request
                        </div>
                    </div>
                </div>
            )}

            {/* AI Testing Section */}
            {result && (
                <AITestPanel
                    originalPrompt={result.originalPrompt}
                    compressedPrompt={result.compressedPrompt}
                />
            )}

            {/* Features Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="text-lg font-semibold mb-2">Intelligent Compression</h3>
                    <p className="text-gray-600 text-sm">Removes redundancy while preserving meaning and intent</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">💰</div>
                    <h3 className="text-lg font-semibold mb-2">Cost Reduction</h3>
                    <p className="text-gray-600 text-sm">Save money on API calls by reducing input token count</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="text-lg font-semibold mb-2">Faster Processing</h3>
                    <p className="text-gray-600 text-sm">Shorter prompts mean faster AI response times</p>
                </div>
            </div>
        </div>
    );
}
