'use client'

interface CompressionResult {
    originalPrompt: string
    compressedPrompt: string
    originalTokens: number
    compressedTokens: number
    compressionRatio: number
    savedTokens: number
    savedCost: number
}

interface CompressionStatsProps {
    result: CompressionResult
}

export default function CompressionStats({ result }: CompressionStatsProps) {
    const stats = [
        {
            label: 'Tokens Saved',
            value: result.savedTokens,
            suffix: 'tokens',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            icon: '📉'
        },
        {
            label: 'Compression Ratio',
            value: result.compressionRatio,
            suffix: '%',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            icon: '⚡'
        },
        {
            label: 'Cost Saved (per request)',
            value: (result.savedCost * 1000).toFixed(2),
            suffix: 'mills',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            icon: '💰'
        }
    ]

    const scaledStats = [
        {
            label: 'Cost Saved (1K requests)',
            value: `$${(result.savedCost * 1000).toFixed(2)}`,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Cost Saved (10K requests)',
            value: `$${(result.savedCost * 10000).toFixed(2)}`,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-4 font-title">Compression Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-xl p-4 text-center transition-transform hover:scale-105`}
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-2xl font-bold ${stat.color}`}>
                                {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
                                <span className="text-sm ml-1">{stat.suffix}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-md font-semibold mb-3 font-title">Projected Savings at Scale</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scaledStats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-lg p-3 text-center`}
                        >
                            <div className={`text-lg font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {result.compressionRatio > 30 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                        <div className="text-green-600 text-xl">🎉</div>
                        <div>
                            <div className="text-green-800 font-semibold">Excellent Compression!</div>
                            <div className="text-green-600 text-sm">
                                You achieved over 30% compression - this will significantly reduce your API costs.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}