'use client'

import { useState, useEffect, useMemo } from 'react'
import { PromptCompressor } from '../../lib/compression'
import TokenCountBar from './TokenCountBar'
import ExamplePrompts from './ExamplePrompts'
import CompressionStats from './CompressionStats'

interface CompressionResult {
    originalPrompt: string
    compressedPrompt: string
    originalTokens: number
    compressedTokens: number
    compressionRatio: number
    savedTokens: number
    savedCost: number
}

export default function CompressionDemo() {
    const [prompt, setPrompt] = useState('')
    const [result, setResult] = useState<CompressionResult | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)
    const [copiedOriginal, setCopiedOriginal] = useState(false)
    const [copiedCompressed, setCopiedCompressed] = useState(false)

    const compressor = useMemo(() => new PromptCompressor(), [])

    useEffect(() => {
        if (prompt.trim()) {
            const timer = setTimeout(() => {
                compressPrompt(prompt)
            }, 500) // Debounce compression
            return () => clearTimeout(timer)
        } else {
            setResult(null)
        }
    }, [prompt, compressor])

    const compressPrompt = async (inputPrompt: string) => {
        setIsCompressing(true)
        try {
            const originalTokens = PromptCompressor.getTokenCount(inputPrompt)
            const compressed = await compressor.compress(inputPrompt)
            const compressedTokens = PromptCompressor.getTokenCount(compressed)
            
            const savedTokens = originalTokens - compressedTokens
            const compressionRatio = ((savedTokens / originalTokens) * 100)
            
            // Rough cost calculation (assuming ~$0.003 per 1k tokens for Claude)
            const savedCost = (savedTokens / 1000) * 0.003

            setResult({
                originalPrompt: inputPrompt,
                compressedPrompt: compressed,
                originalTokens,
                compressedTokens,
                compressionRatio,
                savedTokens,
                savedCost
            })
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

    const handleExampleSelect = (examplePrompt: string) => {
        setPrompt(examplePrompt)
    }

    return (
        <div className="space-y-8">
            {/* Example Prompts */}
            <ExamplePrompts onSelectExample={handleExampleSelect} />

            {/* Input Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 font-title">Your Prompt</h2>
                    <textarea
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your prompt here to see compression in action..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                {result && (
                    <div className="p-6">
                        <CompressionStats result={result} />
                    </div>
                )}
            </div>

            {/* Results Comparison */}
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original Prompt */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg font-title">Original Prompt</h3>
                                <p className="text-sm text-gray-600">{result.originalTokens} tokens</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(result.originalPrompt, 'original')}
                                className="btn-sm bg-gray-800 text-white hover:bg-gray-900"
                            >
                                {copiedOriginal ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-4">
                            <TokenCountBar 
                                tokens={result.originalTokens} 
                                maxTokens={Math.max(result.originalTokens, result.compressedTokens)}
                                color="red"
                            />
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {result.originalPrompt}
                            </div>
                        </div>
                    </div>

                    {/* Compressed Prompt */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-green-50 border-b border-green-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg font-title">Compressed Prompt</h3>
                                <p className="text-sm text-green-600">{result.compressedTokens} tokens</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(result.compressedPrompt, 'compressed')}
                                className="btn-sm bg-green-600 text-white hover:bg-green-700"
                            >
                                {copiedCompressed ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-4">
                            <TokenCountBar 
                                tokens={result.compressedTokens} 
                                maxTokens={Math.max(result.originalTokens, result.compressedTokens)}
                                color="green"
                            />
                            <div className="mt-4 p-4 bg-green-50 rounded-lg text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {result.compressedPrompt}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isCompressing && (
                <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="text-gray-600">Compressing prompt...</span>
                    </div>
                </div>
            )}
        </div>
    )
}