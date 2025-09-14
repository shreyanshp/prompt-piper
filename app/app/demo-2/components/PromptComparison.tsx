'use client'

import { useState, useEffect } from 'react'
import { Copy, Settings, Zap, Database, Brain, ArrowRight, CheckCircle } from 'lucide-react'
import { PromptCompressor } from '../../lib/compression'
import LLMLinguaCompressor from './LLMLinguaCompressor'
import AITestPanel from './AITestPanel'

type CompressionMode = 'regular' | 'llmlingua-simple' | 'llmlingua-downloaded'

interface CompressionResult {
    originalPrompt: string
    compressedPrompt: string
    originalTokens: number
    compressedTokens: number
    compressionRatio: number
    savedTokens: number
    method: string
}

const MODELS = [
    { 
        id: 'tinybert', 
        name: 'TinyBERT', 
        size: '57MB', 
        description: 'Fastest processing, good for quick compression',
        factory: 'WithBERTMultilingual'
    },
    { 
        id: 'bert', 
        name: 'BERT', 
        size: '710MB', 
        description: 'Better accuracy, balanced performance',
        factory: 'WithBERTMultilingual'
    },
    { 
        id: 'xlm-roberta', 
        name: 'XLM-RoBERTa', 
        size: '2.2GB', 
        description: 'Best accuracy, highest resource usage',
        factory: 'WithXLMRoBERTa'
    }
]

const EXAMPLE_PROMPTS = [
    "Please help me write a comprehensive and detailed summary of the main key points and important aspects of machine learning, including but not limited to the various different types and categories of machine learning algorithms, their practical applications in real-world scenarios, and the benefits they provide.",
    
    "I would really appreciate if you could take a look at this Python code and provide detailed feedback on improvements, best practices, and potential issues:\n\ndef calculate_factorial(n):\n    if n < 0:\n        return 'Error: Cannot calculate factorial of negative number'\n    elif n == 0:\n        return 1\n    else:\n        result = 1\n        for i in range(1, n + 1):\n            result = result * i\n        return result",
    
    "Could you please help me create a comprehensive business plan for a new startup company? The business plan should include all the necessary components that are typically found in professional business plans, including executive summary, market analysis, competitive analysis, marketing strategy, operations plan, and financial projections.",
    
    "Please help me create comprehensive technical documentation for a REST API. The documentation should include detailed information about all endpoints, request/response formats, authentication methods, error handling, rate limiting, and best practices for integration."
]

export default function PromptComparison() {
    const [originalPrompt, setOriginalPrompt] = useState('')
    const [compressedPrompt, setCompressedPrompt] = useState('')
    const [compressionMode, setCompressionMode] = useState<CompressionMode>('regular')
    const [selectedModel, setSelectedModel] = useState('tinybert')
    const [compressionRate, setCompressionRate] = useState(50)
    const [isCompressing, setIsCompressing] = useState(false)
    const [result, setResult] = useState<CompressionResult | null>(null)
    const [showSettings, setShowSettings] = useState(false)
    const [copiedOriginal, setCopiedOriginal] = useState(false)
    const [copiedCompressed, setCopiedCompressed] = useState(false)

    const promptCompressor = new PromptCompressor()
    const llmlinguaCompressor = new LLMLinguaCompressor()

    const handleCompress = async () => {
        if (!originalPrompt.trim()) return

        setIsCompressing(true)
        try {
            const originalTokens = PromptCompressor.getTokenCount(originalPrompt)
            let compressed = ''
            let method = ''

            switch (compressionMode) {
                case 'regular':
                    compressed = await promptCompressor.compress(originalPrompt)
                    method = 'IPFS Rule-based'
                    break
                case 'llmlingua-simple':
                    compressed = await llmlinguaCompressor.compressSimple(originalPrompt, compressionRate / 100)
                    method = 'LLMLingua-2 (Simulated)'
                    break
                case 'llmlingua-downloaded':
                    compressed = await llmlinguaCompressor.compress(originalPrompt, selectedModel, compressionRate / 100)
                    method = `LLMLingua-2 (${MODELS.find(m => m.id === selectedModel)?.name})`
                    break
            }

            const compressedTokens = PromptCompressor.getTokenCount(compressed)
            const savedTokens = originalTokens - compressedTokens
            const compressionRatio = (savedTokens / originalTokens) * 100

            setResult({
                originalPrompt,
                compressedPrompt: compressed,
                originalTokens,
                compressedTokens,
                compressionRatio,
                savedTokens,
                method
            })
            setCompressedPrompt(compressed)
        } catch (error) {
            console.error('Compression failed:', error)
        } finally {
            setIsCompressing(false)
        }
    }

    const copyToClipboard = async (text: string, type: 'original' | 'compressed') => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === 'original') {
                setCopiedOriginal(true)
                setTimeout(() => setCopiedOriginal(false), 2000)
            } else {
                setCopiedCompressed(true)
                setTimeout(() => setCopiedCompressed(false), 2000)
            }
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const handleExampleSelect = (example: string) => {
        setOriginalPrompt(example)
        setResult(null)
        setCompressedPrompt('')
    }

    const getCostSavings = (savedTokens: number) => {
        // Based on Claude-3 pricing: ~$0.003 per 1k tokens
        const costPer1k = 0.003
        const savingsPerRequest = (savedTokens / 1000) * costPer1k
        return {
            perRequest: savingsPerRequest,
            per1k: savingsPerRequest * 1000,
            per10k: savingsPerRequest * 10000
        }
    }

    return (
        <div className="space-y-8">
            {/* Compression Settings Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-title">Compression Settings</h2>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        {showSettings ? 'Hide Settings' : 'Show Settings'}
                    </button>
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
                        onClick={() => setCompressionMode('llmlingua-simple')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            compressionMode === 'llmlingua-simple'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <Zap className="w-6 h-6 text-green-600" />
                            <div>
                                <h3 className="font-semibold">LLMLingua-2 (Simulated)</h3>
                                <p className="text-sm text-gray-600">AI-powered, no download needed</p>
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
                                <h3 className="font-semibold">LLMLingua-2 (Downloaded)</h3>
                                <p className="text-sm text-gray-600">Real AI models from Hugging Face</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                {showSettings && (
                    <div className="border-t pt-6 space-y-4">
                        {(compressionMode === 'llmlingua-simple' || compressionMode === 'llmlingua-downloaded') && (
                            <>
                                {/* Model Selection */}
                                {compressionMode === 'llmlingua-downloaded' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Model Selection
                                        </label>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {MODELS.map((model) => (
                                                <option key={model.id} value={model.id}>
                                                    {model.name} ({model.size}) - {model.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Compression Rate Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Compression Rate: {compressionRate}%
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        value={compressionRate}
                                        onChange={(e) => setCompressionRate(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>10% (Light)</span>
                                        <span>50% (Balanced)</span>
                                        <span>90% (Aggressive)</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold mb-4 font-title">Example Prompts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXAMPLE_PROMPTS.map((example, index) => (
                        <button
                            key={index}
                            onClick={() => handleExampleSelect(example)}
                            className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                        >
                            <div className="text-sm text-gray-600 line-clamp-3">
                                {example.substring(0, 150)}...
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input/Output Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Prompt */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg font-title">Original Prompt</h3>
                            <p className="text-sm text-gray-600">
                                {result ? `${result.originalTokens} tokens` : 'Enter your prompt'}
                            </p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(originalPrompt, 'original')}
                            disabled={!originalPrompt}
                            className="btn-sm bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copiedOriginal ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedOriginal ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4">
                        <textarea
                            className="w-full h-64 p-4 border-0 resize-none focus:outline-none"
                            placeholder="Enter your prompt here to see compression in action..."
                            value={originalPrompt}
                            onChange={(e) => setOriginalPrompt(e.target.value)}
                        />
                    </div>
                </div>

                {/* Compressed Prompt */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg font-title">Compressed Prompt</h3>
                            <p className="text-sm text-green-600">
                                {result ? `${result.compressedTokens} tokens` : 'Compressed output will appear here'}
                            </p>
                        </div>
                        <button
                            onClick={() => copyToClipboard(compressedPrompt, 'compressed')}
                            disabled={!compressedPrompt}
                            className="btn-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {copiedCompressed ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedCompressed ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4">
                        <textarea
                            className="w-full h-64 p-4 border-0 resize-none focus:outline-none bg-gray-50"
                            placeholder="Compressed prompt will appear here after compression..."
                            value={compressedPrompt}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            {/* Compress Button */}
            <div className="text-center">
                <button
                    onClick={handleCompress}
                    disabled={!originalPrompt.trim() || isCompressing}
                    className="btn text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCompressing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Compressing...
                        </>
                    ) : (
                        <>
                            Compress Prompt
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
            </div>

            {/* Statistics Dashboard */}
            {result && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-2xl font-bold mb-6 font-title">Compression Statistics</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{result.originalTokens}</div>
                            <div className="text-sm text-blue-600">Original Tokens</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{result.compressedTokens}</div>
                            <div className="text-sm text-green-600">Compressed Tokens</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{result.savedTokens}</div>
                            <div className="text-sm text-purple-600">Tokens Saved</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{result.compressionRatio.toFixed(1)}%</div>
                            <div className="text-sm text-orange-600">Compression Ratio</div>
                        </div>
                    </div>

                    {/* Cost Savings */}
                    {(() => {
                        const savings = getCostSavings(result.savedTokens)
                        return (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Cost Savings (Claude-3 pricing)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800">${(savings.perRequest * 1000).toFixed(2)} mills</div>
                                        <div className="text-gray-600">Per Request</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800">${savings.per1k.toFixed(2)}</div>
                                        <div className="text-gray-600">Per 1K Requests</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-800">${savings.per10k.toFixed(2)}</div>
                                        <div className="text-gray-600">Per 10K Requests</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Compression method: <span className="font-medium">{result.method}</span>
                    </div>
                </div>
            )}

            {/* AI Testing Panel */}
            {result && (
                <AITestPanel 
                    originalPrompt={result.originalPrompt}
                    compressedPrompt={result.compressedPrompt}
                />
            )}
        </div>
    )
}