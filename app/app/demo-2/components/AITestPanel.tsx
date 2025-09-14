'use client'

import { useState } from 'react'
import { Play, MessageSquare, Zap, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

interface AITestPanelProps {
    originalPrompt: string
    compressedPrompt: string
}

type APIProvider = 'openrouter' | 'bitcoincom'

interface TestResult {
    provider: string
    model: string
    prompt: string
    response: string
    tokens: number
    cost: number
    quality: 'excellent' | 'good' | 'fair' | 'poor'
    timestamp: number
}

const PROVIDERS = {
    openrouter: {
        name: 'OpenRouter',
        models: [
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', cost: 0.003 },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', cost: 0.00025 },
            { id: 'openai/gpt-4', name: 'GPT-4', cost: 0.03 },
            { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: 0.002 }
        ]
    },
    bitcoincom: {
        name: 'Bitcoin.com AI',
        models: [
            { id: 'gpt-4', name: 'GPT-4', cost: 0.03 },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', cost: 0.002 }
        ]
    }
}

export default function AITestPanel({ originalPrompt, compressedPrompt }: AITestPanelProps) {
    const [selectedProvider, setSelectedProvider] = useState<APIProvider>('openrouter')
    const [selectedModel, setSelectedModel] = useState(PROVIDERS.openrouter.models[0].id)
    const [isTestingOriginal, setIsTestingOriginal] = useState(false)
    const [isTestingCompressed, setIsTestingCompressed] = useState(false)
    const [isTestingBoth, setIsTestingBoth] = useState(false)
    const [originalResult, setOriginalResult] = useState<TestResult | null>(null)
    const [compressedResult, setCompressedResult] = useState<TestResult | null>(null)
    const [showComparison, setShowComparison] = useState(false)

    const handleProviderChange = (provider: APIProvider) => {
        setSelectedProvider(provider)
        setSelectedModel(PROVIDERS[provider].models[0].id)
    }

    const simulateAPICall = async (prompt: string, provider: APIProvider, model: string): Promise<TestResult> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

        // Simulate different response qualities and lengths based on compression
        const isCompressed = prompt.length < originalPrompt.length
        const responseLength = isCompressed
            ? 150 + Math.random() * 100  // Compressed prompts might get shorter responses
            : 200 + Math.random() * 150  // Original prompts get fuller responses

        // Generate simulated response
        const responses = {
            excellent: [
                "Here's a comprehensive analysis of your request with detailed insights and practical recommendations.",
                "I'll provide a thorough breakdown of the key concepts with examples and actionable steps.",
                "Let me walk you through this systematically with clear explanations and relevant examples."
            ],
            good: [
                "Here's an overview of the main points with some practical insights.",
                "I can help explain the key aspects with relevant examples.",
                "Let me address the main components of your request."
            ],
            fair: [
                "Here are the basic points to consider.",
                "I'll cover the main aspects briefly.",
                "Here's a general overview."
            ],
            poor: [
                "Brief response.",
                "Limited information available.",
                "Basic overview only."
            ]
        }

        // Quality tends to be slightly lower for heavily compressed prompts
        const compressionRatio = (originalPrompt.length - prompt.length) / originalPrompt.length
        let quality: TestResult['quality'] = 'excellent'

        if (compressionRatio > 0.7) {
            quality = Math.random() > 0.3 ? 'good' : 'fair'
        } else if (compressionRatio > 0.5) {
            quality = Math.random() > 0.2 ? 'excellent' : 'good'
        } else if (compressionRatio > 0.2) {
            quality = Math.random() > 0.1 ? 'excellent' : 'good'
        }

        const baseResponse = responses[quality][Math.floor(Math.random() * responses[quality].length)]
        const response = baseResponse + ' ' + '.'.repeat(Math.floor(responseLength - baseResponse.length))

        // Calculate cost based on tokens
        const tokens = Math.floor((prompt.length + response.length) / 4) // Rough estimation
        const modelData = PROVIDERS[provider].models.find(m => m.id === model)
        const cost = (tokens / 1000) * (modelData?.cost || 0.002)

        return {
            provider: PROVIDERS[provider].name,
            model: modelData?.name || model,
            prompt,
            response,
            tokens,
            cost,
            quality,
            timestamp: Date.now()
        }
    }

    const testOriginal = async () => {
        setIsTestingOriginal(true)
        try {
            const result = await simulateAPICall(originalPrompt, selectedProvider, selectedModel)
            setOriginalResult(result)
        } catch (error) {
            console.error('Original test failed:', error)
        } finally {
            setIsTestingOriginal(false)
        }
    }

    const testCompressed = async () => {
        setIsTestingCompressed(true)
        try {
            const result = await simulateAPICall(compressedPrompt, selectedProvider, selectedModel)
            setCompressedResult(result)
        } catch (error) {
            console.error('Compressed test failed:', error)
        } finally {
            setIsTestingCompressed(false)
        }
    }

    const testBoth = async () => {
        setIsTestingBoth(true)
        try {
            const [originalRes, compressedRes] = await Promise.all([
                simulateAPICall(originalPrompt, selectedProvider, selectedModel),
                simulateAPICall(compressedPrompt, selectedProvider, selectedModel)
            ])
            setOriginalResult(originalRes)
            setCompressedResult(compressedRes)
            setShowComparison(true)
        } catch (error) {
            console.error('Batch test failed:', error)
        } finally {
            setIsTestingBoth(false)
        }
    }

    const getQualityColor = (quality: TestResult['quality']) => {
        const colors = {
            excellent: 'text-green-600 bg-green-50',
            good: 'text-blue-600 bg-blue-50',
            fair: 'text-yellow-600 bg-yellow-50',
            poor: 'text-red-600 bg-red-50'
        }
        return colors[quality]
    }

    const getQualityIcon = (quality: TestResult['quality']) => {
        if (quality === 'excellent' || quality === 'good') {
            return <CheckCircle className="w-4 h-4" />
        }
        return <XCircle className="w-4 h-4" />
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6 font-title">AI Response Testing</h2>

            {/* Provider and Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Provider
                    </label>
                    <div className="space-y-2">
                        {Object.entries(PROVIDERS).map(([key, provider]) => (
                            <label key={key} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="provider"
                                    value={key}
                                    checked={selectedProvider === key}
                                    onChange={() => handleProviderChange(key as APIProvider)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="font-medium">{provider.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {PROVIDERS[selectedProvider].models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.name} (${model.cost}/1k tokens)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Test Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    onClick={testOriginal}
                    disabled={isTestingOriginal || isTestingBoth}
                    className="btn bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isTestingOriginal ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Testing Original...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2" />
                            Test Original
                        </>
                    )}
                </button>

                <button
                    onClick={testCompressed}
                    disabled={isTestingCompressed || isTestingBoth}
                    className="btn bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isTestingCompressed ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Testing Compressed...
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4 mr-2" />
                            Test Compressed
                        </>
                    )}
                </button>

                <button
                    onClick={testBoth}
                    disabled={isTestingBoth || isTestingOriginal || isTestingCompressed}
                    className="btn bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isTestingBoth ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Testing Both...
                        </>
                    ) : (
                        <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Test Both & Compare
                        </>
                    )}
                </button>
            </div>

            {/* Results */}
            {(originalResult || compressedResult) && (
                <div className="space-y-6">
                    {showComparison && originalResult && compressedResult ? (
                        /* Comparison View */
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-blue-900">Original Prompt Response</h3>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getQualityColor(originalResult.quality)}`}>
                                        {getQualityIcon(originalResult.quality)}
                                        <span className="capitalize">{originalResult.quality}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-blue-800 mb-2">
                                    {originalResult.provider} • {originalResult.model}
                                </div>
                                <div className="text-sm text-blue-700 mb-3">
                                    {originalResult.tokens} tokens • ${originalResult.cost.toFixed(4)} cost
                                </div>
                                <div className="text-sm text-blue-900 bg-white p-3 rounded-lg">
                                    {originalResult.response}
                                </div>
                            </div>

                            <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-green-900">Compressed Prompt Response</h3>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getQualityColor(compressedResult.quality)}`}>
                                        {getQualityIcon(compressedResult.quality)}
                                        <span className="capitalize">{compressedResult.quality}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-green-800 mb-2">
                                    {compressedResult.provider} • {compressedResult.model}
                                </div>
                                <div className="text-sm text-green-700 mb-3">
                                    {compressedResult.tokens} tokens • ${compressedResult.cost.toFixed(4)} cost
                                </div>
                                <div className="text-sm text-green-900 bg-white p-3 rounded-lg">
                                    {compressedResult.response}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Individual Results */
                        <div className="space-y-4">
                            {originalResult && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold">Original Prompt Result</h3>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getQualityColor(originalResult.quality)}`}>
                                            {getQualityIcon(originalResult.quality)}
                                            <span className="capitalize">{originalResult.quality}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {originalResult.provider} • {originalResult.model} • {originalResult.tokens} tokens • ${originalResult.cost.toFixed(4)}
                                    </div>
                                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                        {originalResult.response}
                                    </div>
                                </div>
                            )}

                            {compressedResult && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold">Compressed Prompt Result</h3>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getQualityColor(compressedResult.quality)}`}>
                                            {getQualityIcon(compressedResult.quality)}
                                            <span className="capitalize">{compressedResult.quality}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {compressedResult.provider} • {compressedResult.model} • {compressedResult.tokens} tokens • ${compressedResult.cost.toFixed(4)}
                                    </div>
                                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                        {compressedResult.response}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {originalResult && compressedResult && (
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Testing Summary</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-bold text-gray-800">
                                        {((originalResult.cost - compressedResult.cost) / originalResult.cost * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-gray-600">Cost Savings</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-800">
                                        ${(originalResult.cost - compressedResult.cost).toFixed(4)}
                                    </div>
                                    <div className="text-gray-600">Absolute Savings</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-gray-800">
                                        {originalResult.quality === compressedResult.quality ? 'Same' : 'Different'}
                                    </div>
                                    <div className="text-gray-600">Quality Impact</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}