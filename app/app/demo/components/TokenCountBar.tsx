'use client'

interface TokenCountBarProps {
    tokens: number
    maxTokens: number
    color: 'red' | 'green'
}

export default function TokenCountBar({ tokens, maxTokens, color }: TokenCountBarProps) {
    const percentage = (tokens / maxTokens) * 100

    const colorClasses = {
        red: 'bg-red-500',
        green: 'bg-green-500'
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Token Usage</span>
                <span className="text-sm font-medium text-gray-800">{tokens} tokens</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out rounded-full ${colorClasses[color]}`}
                    style={{ width: `${percentage}%` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
                {percentage.toFixed(1)}% of maximum
            </div>
        </div>
    )
}