'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Zap, BarChart3, Settings, Database, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { PromptCompressor } from '../../lib/compression';
import { LLMLinguaCompressor, LLMLinguaCompressionResult, LLMLinguaCompressorOptions } from '../../lib/llmlingua-compressor';
import { configureONNXRuntime } from '../../lib/onnx-runtime-config';
import AITestPanel from './AITestPanel';
import ExamplePromptsAccordion from './ExamplePromptsAccordion';
import TokenCountBar from '../../demo/components/TokenCountBar';

type CompressionMode = 'regular' | 'llmlingua-downloaded' | 'llmlingua-ipfs';
type AnyCompressionResult = {
    originalPrompt: string;
    compressedPrompt: string;
    originalTokens: number;
    compressedTokens: number;
    compressionRatio: number;
    savedTokens: number;
    compressionMethod: string;
} | LLMLinguaCompressionResult;

export default function PromptComparison() {
    const [inputPrompt, setInputPrompt] = useState('');
    const [result, setResult] = useState<AnyCompressionResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [compressionMode, setCompressionMode] = useState<CompressionMode>('llmlingua-downloaded');
    const [llmlinguaOptions, setLlmlinguaOptions] = useState<LLMLinguaCompressorOptions>({
        modelName: 'TINYBERT',
        rate: 0.7,
    });
    const [isClient, setIsClient] = useState(false);
    const [copiedOriginal, setCopiedOriginal] = useState(false);
    const [copiedCompressed, setCopiedCompressed] = useState(false);
    const [isResultsExpanded, setIsResultsExpanded] = useState(false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsClient(true);
        // Configure ONNX Runtime early to suppress warnings
        configureONNXRuntime();

        // Cleanup timeout on unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
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

    const performCompression = async (prompt: string, options: any) => {
        if (!prompt.trim()) return null;

        try {
            let compressionResult: AnyCompressionResult;

            if (compressionMode === 'regular') {
                // Use advanced IPFS rule-based compression
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
            } else {
                // LLMLingua-2 real AI compression
                const llmlinguaCompressor = LLMLinguaCompressor.getInstance();
                compressionResult = await llmlinguaCompressor.compress(prompt, options);
            }

            return compressionResult;
        } catch (error) {
            console.error('Compression error:', error);
            return null;
        }
    };

    const handleCompress = async () => {
        if (!inputPrompt.trim()) return;

        setIsProcessing(true);

        try {
            const compressionResult = await performCompression(inputPrompt, llmlinguaOptions);
            if (compressionResult) {
                setResult(compressionResult);
            } else {
                // Provide more specific error messages
                let errorMessage = 'Error during compression. Please check the console for details.';
                alert(errorMessage);
            }
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

    const handleSliderChange = async (newRate: number) => {
        if (!inputPrompt.trim() || !result) return;

        // Update the options immediately for UI responsiveness
        setLlmlinguaOptions(prev => ({ ...prev, rate: newRate }));

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for debounced compression
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const newOptions = { ...llmlinguaOptions, rate: newRate };
                const compressionResult = await performCompression(inputPrompt, newOptions);
                if (compressionResult) {
                    setResult(compressionResult);
                }
            } catch (error) {
                console.error('Real-time compression error:', error);
            }
        }, 300); // 300ms debounce delay
    };

    const copyToClipboard = async (text: string, type: 'original' | 'compressed') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'original') {
                setCopiedOriginal(true);
                setTimeout(() => setCopiedOriginal(false), 2000);
            } else {
                setCopiedCompressed(true);
                setTimeout(() => setCopiedCompressed(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const examplePrompts = [
        "Could you please help me write a very detailed step by step guide on how to make sure that I can actually implement a React component that is really quite good and basically handles user authentication? Please make sure that you provide me with as much detail as possible and keep in mind that I am actually pretty new to React development.",
        "I would like you to please provide me with a comprehensive analysis of machine learning algorithms. Could you help me understand the differences between supervised and unsupervised learning? Please make sure to explain it in a way that is very clear and actually quite detailed.",
        "Can you help me write a Python function that actually processes data from a CSV file? Please make sure that it handles errors very carefully and basically validates all the input data. I would really like you to provide step by step instructions and keep in mind that performance is quite important."
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Compression Mode Selection */}
            <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold font-title">Compression Settings</h2>
                </div>

                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                        onClick={() => setCompressionMode('regular')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            compressionMode === 'regular'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <Database className="w-6 h-6 text-blue-600" />
                            <div>
                                <h3 className="font-semibold">Regular (IPFS Rules)</h3>
                                <p className="text-sm text-gray-600">Instant, rule-based compression</p>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => setCompressionMode('llmlingua-downloaded')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            compressionMode === 'llmlingua-downloaded'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <Brain className="w-6 h-6 text-purple-600" />
                            <div>
                                <h3 className="font-semibold">LLMLingua (Hugging Face)</h3>
                                <p className="text-sm text-gray-600">Real AI models from Hugging Face</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    >
                        <div className="flex items-center space-x-3">
                            <Zap className="w-6 h-6 text-gray-400" />
                            <div>
                                <h3 className="font-semibold text-gray-500">LLMLingua (IPFS)</h3>
                                <p className="text-sm text-gray-500">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings - Always Visible */}
                <div className="border-t pt-6 space-y-4">
                    {compressionMode === 'llmlingua-downloaded' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Model
                                </label>
                                <select
                                    value={llmlinguaOptions.modelName}
                                    onChange={(e) => setLlmlinguaOptions(prev => ({ ...prev, modelName: e.target.value as any }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="TINYBERT">TinyBERT</option>
                                    <option value="BERT">BERT</option>
                                    <option value="XLM_ROBERTA">XLM-RoBERTa</option>
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
                                    onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Example Prompts Accordion */}
            <ExamplePromptsAccordion onSelectExample={setInputPrompt} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg font-title">Original Prompt</h3>
                            <p className="text-sm text-gray-600">{PromptCompressor.getTokenCount(inputPrompt)} tokens</p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(inputPrompt, 'original')}
                            className="btn-sm bg-gray-800 text-white hover:bg-gray-900 px-3 py-1 rounded text-sm"
                        >
                            {copiedOriginal ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4">
                        {result && (
                            <TokenCountBar
                                tokens={result.originalTokens}
                                maxTokens={Math.max(result.originalTokens, result.compressedTokens)}
                                color="red"
                            />
                        )}
                        <div className={result ? "mt-4" : ""}>
                            <textarea
                                value={inputPrompt}
                                onChange={(e) => setInputPrompt(e.target.value)}
                                placeholder="Paste your verbose prompt here..."
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-0"
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
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

                            <div className="text-sm text-gray-500 text-center">
                                Or try an example:
                            </div>
                            <div className="flex gap-2">
                                {examplePrompts.map((example, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputPrompt(example)}
                                        className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                    >
                                        Example {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg font-title">Compressed Prompt</h3>
                            <p className="text-sm text-green-600">{result?.compressedTokens || 0} tokens</p>
                        </div>
                        <button
                            onClick={() => result && copyToClipboard(result.compressedPrompt, 'compressed')}
                            className="btn-sm bg-green-600 text-white hover:bg-green-700 px-3 py-1 rounded text-sm"
                        >
                            {copiedCompressed ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4">
                        {result && (
                            <TokenCountBar
                                tokens={result.compressedTokens}
                                maxTokens={Math.max(result.originalTokens, result.compressedTokens)}
                                color="green"
                            />
                        )}
                        <div>
                            <textarea
                                value={result?.compressedPrompt || ''}
                                readOnly
                                placeholder="Compressed prompt will appear here..."
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none bg-green-50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            {result && (
                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 overflow-hidden">
                    <div 
                        className="p-6 cursor-pointer hover:bg-green-100/50 transition-colors"
                        onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="text-green-600" size={24} />
                                <h3 className="text-xl font-semibold text-gray-800 font-title">Compression Results</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                                    {compressionMode === 'regular' ? 'Regular IPFS' : 'LLMLingua-2 AI'} Compression
                                </span>
                                {isResultsExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                        </div>
                    </div>

                    {isResultsExpanded && (
                        <div className="px-6 pb-6">
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
            <div className="hidden mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="text-lg font-semibold mb-2 font-title">Intelligent Compression</h3>
                    <p className="text-gray-600 text-sm">Removes redundancy while preserving meaning and intent</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">💰</div>
                    <h3 className="text-lg font-semibold mb-2 font-title">Cost Reduction</h3>
                    <p className="text-gray-600 text-sm">Save money on API calls by reducing input token count</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="text-lg font-semibold mb-2 font-title">Faster Processing</h3>
                    <p className="text-gray-600 text-sm">Shorter prompts mean faster AI response times</p>
                </div>
            </div>
        </div>
    );
}
